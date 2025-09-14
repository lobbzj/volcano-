var express = require('express');
var router = express.Router();


router.get("/", function (req, res, next) {
    const validParams = ['country', 'populatedWithin'];
    const isValidParams = Object.keys(req.query).every(param => validParams.includes(param));
    if (!isValidParams) {
        return res.status(400).json({
            "error": true,
            "message": "Invalid query parameters. Only 'country' and 'populatedWithin' are allowed."
        });
    }
    if (!req.query.country) {
        return res.status(400).json({
            "error": true,
            "message": "Country is a required query parameter."
        });
    }

    let populatedWithin = req.query.populatedWithin || '';
    let query = req.db('data')
        .select('id', 'name', 'country', 'region', 'subregion')
        .where('country', '=', req.query.country);

    if (populatedWithin) {
        switch (populatedWithin) {
            case '5km':
                query = query.where('population_5km', '>', 0);
                break;
            case '10km':
                query = query.where('population_10km', '>', 0);
                break;
            case '30km':
                query = query.where('population_30km', '>', 0);
                break;
            case '100km':
                query = query.where('population_100km', '>', 0);
                break;
            default:
                return res.status(400).json({
                    "error": true,
                    "message": "Invalid populatedWithin query parameter."
                });
        }
    }
    query.then(function (rows) {
        const volcanoes = rows.map(row => ({
            id: row.id,
            name: row.name,
            country: row.country,
            region: row.region,
            subregion: row.subregion
        }));
        res.json(volcanoes);
    }).catch(function (err) {
        console.error(err);
        res.status(500).json({ Error: true, Message: "Error retrieving volcanoes" });
    });
});

const calculateDistance = (lat1, lon1, lat2, lon2) => {
    //console.log(lat1, lon1, lat2, lon2);
    const R = 6371;  
    const dLat = (lat2 - lat1) * (Math.PI / 180);
    const dLon = (lon2 - lon1) * (Math.PI / 180);
    const a = 
      Math.sin(dLat/2) * Math.sin(dLat/2) +
      Math.cos(lat1 * (Math.PI / 180)) * Math.cos(lat2 * (Math.PI / 180)) * 
      Math.sin(dLon/2) * Math.sin(dLon/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    return R * c; 
  };

router.get('/near', function (req, res) {
    const { longitude, latitude, range } = req.query;
    if (!longitude || !latitude | !range) {
        return res.status(400).json({ error: true, message: 'Missing parameters longitude latitude, range' });
    }
    const longitudeInt = parseFloat(longitude);
    const latitudeInt = parseFloat(latitude);
    const rangeInt = parseFloat(range);

    if (isNaN(longitudeInt) || isNaN(latitudeInt) || isNaN(rangeInt)) {
        return res.status(400).json({ error: true, message: 'Invalid query parameters. longitude,latitude, range must be number' });
    }

    req.db('data').select('id', 'name', 'country', 'region', 'subregion','latitude', 'longitude').then((volcanoes) => {
        let filteredVolcanoes = volcanoes.map(volcano => {
            const distance = calculateDistance(latitudeInt, longitudeInt, volcano.latitude, volcano.longitude);
            return {
                ...volcano,
                distance: distance 
            };
        }).filter(volcano => {
            return volcano.distance <= rangeInt;
        });
        filteredVolcanoes.sort((a, b) => a.distance - b.distance);
        if (filteredVolcanoes.length === 0) {
            return res.status(404).json({ error: true, message: 'No volcanoes found in the range' });
        }
        res.json(filteredVolcanoes);
    }).catch((err) => {
        console.error(err);
        if(err.message === "No volcanoes found in the range")
        {
            res.status(404).json({ error: true, message: 'No volcanoes found in the range' });
        }
        else{
            res.status(500).json({ error: true, message: 'Database error' });
        }
       
    });
});

module.exports = router;
