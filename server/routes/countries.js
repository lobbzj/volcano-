var express = require('express');
var router = express.Router();

 
router.get("/", function (req, res, next) {
    if (Object.keys(req.query).length > 0) {
        return res.status(400).json({
            "error": true,
            "message": "Invalid query parameters. Query parameters are not permitted."
        });
    }
    req.db
        .from("volcanoes.data")
        .select("country")
        .distinct('country')
        .orderBy('country', 'asc')
        .then((rows) => {
            const countries = rows.map(row => row.country);
            res.json(countries);
        })
        .catch((err) => {
            console.log(err);
            res.json({ Error: false, Message: "errerr " });
        });
});
 

module.exports = router;
