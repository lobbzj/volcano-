var express = require('express');
var router = express.Router();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { parse, isValid, isBefore,format   } = require('date-fns');
const authenticateToken = require('../middleware/authenticate');

function getValidDate(dateString) {
    const parsedDate = parse(dateString, 'yyyy-MM-dd', new Date());

    if (!isValid(parsedDate)) {
        return null;
    }
    return parsedDate;
}

/* GET users listing. */
router.post('/register', function (req, res, next) {
    // Retrieve email and password from req.body
    const email = req.body.email;
    const password = req.body.password;

    // Verify body
    if (!email || !password) {
        res.status(400).json({
            error: true,
            message: "Request body incomplete, both email and password are required"
        });
        return;
    }

    // Determine if user already exists in table
    const queryUsers = req.db.from("volcanoes.users").select("*").where("email", "=", email);
    queryUsers.then(users => {
        if (users.length > 0) {
            res.status(409).json({
                error: true,
                message: "User already exists"
            });
            return;
        }
        // Insert user into DB
        const saltRounds = 10;
        const hash = bcrypt.hashSync(password, saltRounds);
        return req.db.from("volcanoes.users").insert({ email, hash });
    })
        .then(() => {
            res.status(201).json({  error: true, message: "User created" });
        })
        .catch(e => {
            console.log(e)
            if (e.message === "User already exists") {
                res.status(409).json({
                    error: true,
                    message: "User already exists"
                });
            } else {
                res.status(500).json({
                    error: true,
                    message: "Internal server error"
                });
            }
        });
});


router.post('/login', function (req, res, next) {
    // Retrieve email and password from req.body
    const email = req.body.email;
    const password = req.body.password;

    // Verify body
    if (!email || !password) {
        res.status(400).json({
            error: true,
            message: "Request body incomplete - email and password needed"
        });
        return;
    }

    // Retrieve user from DB
    const queryUsers = req.db.from("volcanoes.users").select("*").where("email", "=", email);
    queryUsers.then(users => {
        if (users.length === 0) {
            throw new Error("User does not exist");
        }

        // Compare password hashes
        const user = users[0];
        return bcrypt.compare(password, user.hash);
    })
        .then(match => {
            if (!match) {
                throw new Error("Passwords do not match");
            }
            console.log("User authenticated");
            const expires_in = 60 * 60 * 24; // 24 hours
            const exp = Math.floor(Date.now() / 1000) + expires_in;
            try {
                const token = jwt.sign({ email, exp }, process.env.JWT_SECRET);
                res.status(200).json({
                    token,
                    token_type: "Bearer",
                    expires_in
                });
            } catch (error) {
                res.status(500).json({  error: true, message: error.message });
            }
        })
        .catch(e => {
            console.log(e)
            if (e.message === "User does not exist" || e.message === "Passwords do not match") {
                res.status(401).json({
                    error: true,
                    message: "Incorrect email or passwor"
                });
            } else {
                res.status(500).json({
                    error: true,
                    message: "Internal server error"
                });
            }
        });


});

router.put('/:email/profile', authenticateToken, (req, res) => {

    if (req.userEmail == null || req.userEmail == undefined || req.userEmail == "") {
        return res.status(401).json({  error: true,message: `Forbidden` });
    }
    const email = req.params.email;
    console.log("xxx",email,req.userEmail);
    if (req.userEmail !== email) {
        return res.status(403).json({  error: true, message: `Forbidden` });
    }

    const firstName = req.body.firstName;
    const lastName = req.body.lastName;
    const dob = req.body.dob;
    const address = req.body.address;
    if (firstName == null || firstName == undefined || firstName == "") {
        return res.status(400).json({  error: true,message: `Request body incomplete: firstName, lastName, dob and address are required.` });
    }
    if (lastName == null || lastName == undefined || lastName == "") {
        return res.status(400).json({ error: true, message: `Request body incomplete: firstName, lastName, dob and address are required.` });
    }
    if (dob == null || dob == undefined || dob == "") {
        return res.status(400).json({  error: true,message: `Request body incomplete: firstName, lastName, dob and address are required.` });
    }
    if (address == null || address == undefined || address == "") {
        return res.status(400).json({ error: true, message: `Request body incomplete: firstName, lastName, dob and address are required.` });
    }

    if (typeof firstName !== "string" || typeof lastName !== "string" || typeof dob !== "string" || typeof address !== "string") {
        return res.status(400).json({  error: true,message: `Request body invalid: firstName, lastName and address must be strings only.` });
    }
    // verify dob
    const dobDate = getValidDate(dob);
    if( dobDate == null)
    {
        return res.status(400).json({  error: true,message: `Invalid input: dob must be a real date in format YYYY-MM-DD.` });
    }
    const today = new Date();
    today.setHours(0, 0, 0, 0); 
    if( !isBefore(dobDate, today) )
    {
        return res.status(400).json({  error: true,message: `Invalid input: dob must be a date in the past.` });
    }

    req.db.from("volcanoes.users").where({ "email": email }).update({
        "firstName": firstName,
        "lastName": lastName,
        "dob": dob,
        "address": address
    })
        .then(() => {
            let profile = {
                email,
                firstName,
                lastName ,
                dob,
                address,  
            };
            res.status(200).json(profile);
            
        }).catch(error => {
            res.status(500).json({  error: true,message: 'Database error - not updated' });
        })

});


router.get('/:email/profile', authenticateToken, function (req, res, next) {
    const { email } = req.params;
    req.db.from("volcanoes.users").where({ "email": email }).first()
        .then(user => {
            if (!user) {
                return res.status(404).json({ error: true, message: "User not found" });
            }
   
            
            let profile = {
                email: user.email,
                firstName: user.firstName,
                lastName: user.lastName,
                dob: user.dob == null ? null: format(user.dob, 'yyyy-MM-dd'), 
                address: user.address
            };
            if ( req.userEmail == null || (req.userEmail != null && req.userEmail != email)) {
                delete profile.dob;
                delete profile.address;
            }
            res.status(200).json(profile);
        })
        .catch(error => {
            console.error(error);
            if (error.message === "User not found"  ) {
                res.status(404).json({
                    error: true,
                    message: "User not found"
                });
            } else {
                res.status(500).json({
                    error: true,
                    message: "Internal server error"
                });
            } 
        });
});

module.exports = router;
