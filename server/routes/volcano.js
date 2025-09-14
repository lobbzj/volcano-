var express = require('express');
var router = express.Router();

const authenticateToken = require('../middleware/authenticate');

router.get("/:id", authenticateToken, function (req, res, next) {
    console.log("req.userEmail: ", req.userEmail)
    req.db
        .from("volcanoes.data")
        .select("*")
        .where("id", "=", req.params.id)
        .then((rows) => {

            if (rows.length === 0) {
                return res.status(404).json({
                    "error": true,
                    "message": "Volcano not found."
                });
            }
            let volcano = rows[0];
            if (req.userEmail == null) {
                delete volcano.population_5km;
                delete volcano.population_10km;
                delete volcano.population_30km;
                delete volcano.population_100km;
            }
            res.json(volcano);
        })
        .catch((err) => {
            console.log(e)
            if (e.message === "Volcano not found.") {
                res.status(404).json({
                    error: true,
                    message: "Volcano not found."
                });
            } else {
                res.status(500).json({
                    error: true,
                    message: "Internal server error"
                });
            }

        });
});

router.post("/:id/population", authenticateToken, function (req, res, next) {
    if (req.userEmail == null || req.userEmail == undefined || req.userEmail == "") {
        return res.status(401).json({ error: true, message: `Forbidden` });
    }

    const updates = req.body;
    const volcanoId = req.params.id;
    const { population_5km, population_10km, population_30km, population_100km } = req.body
    console.log(updates)
    console.log(population_5km, population_10km, population_30km, population_100km)
    if (population_5km == undefined || population_10km == undefined || population_30km == undefined || population_100km == undefined) {
        return res.status(400).json({
            "error": true,
            "message": "invalid input: missing required fields, population_5km, population_10km,population_30km, population_100km"
        });
    }

    for (const key in updates) {
        if (updates[key] !== undefined &&
            !Number.isInteger(updates[key]) || updates[key] < 0) {
            return res.status(400).json({
                "error": true,
                "message": `Invalid input: Invalid population data for ${key}. It must be a non-negative integer.`
            });
        }
    }

    req.db('volcanoes.data')
        .where('id', volcanoId)
        .update(updates)
        .then((rowsUpdated) => {
            if (rowsUpdated === 0) {
                return res.status(404).json({
                    "error": true,
                    "message": "Volcano not found"
                });
            }
            res.json({ "error": false, "message": "Updated successfully." });
        })
        .catch((err) => {
            console.error(err);
            res.status(500).json({
                "error": true,
                "message": "Internal server error"
            });
        });
});

module.exports = router;
