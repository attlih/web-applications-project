const jwt = require('jsonwebtoken');

module.exports = function (req, res, next) {
    const authHeader = req.headers['authorization'];
    let token;
    if (authHeader) token = authHeader.split(' ')[1];
    else token = null;
    if (token == null) return res.status(401).json({msg: "Access denied"});

    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
        if (err) return res.status(401).json({msg: "Invalid token"})
        req.user = decoded;
        next();
    });
}