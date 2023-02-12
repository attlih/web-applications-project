const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
    const authHeader = req.headers["authorization"];
    console.log(authHeader);
    let token;
    if (authHeader) {
        token = authHeader.split(" ")[1];
    }
    if (token) {
        console.log("Token found");
        jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
            if (err) {
                console.log("Token invalid");
                res.status(401).json({ message: "Token invalid" });
            } else {
                console.log("Token valid");
                req.user = decoded;
                next();
            }
        });
    } else {
        console.log("No token found");
        res.status(401).json({ message: "No token found" });
    }
};