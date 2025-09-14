const jwt = require('jsonwebtoken');
module.exports = function (req, res, next) {
    req.userEmail = null;
    if (!("authorization" in req.headers) ) {
        console.log(req.headers);
        console.log("No Authorization header");
        next();
        return;
    }
    if (!req.headers.authorization.match(/^Bearer /)) {
        res.status(401).json({ error: true, message: "Authorization header is malformed" });
        return;
    }
    const token = req.headers.authorization.replace(/^Bearer /, "");
    try {
        const reuslt = jwt.verify(token, process.env.JWT_SECRET);
        console.log(reuslt)
        req.userEmail = reuslt.email;
    } catch (e) {
        if (e.name === "TokenExpiredError") {
            res.status(401).json({ error: true, message: "JWT token has expired" });
        } else {
            res.status(401).json({ error: true, message: "Invalid JWT token" });
        }
        return;
    }
    next();
};