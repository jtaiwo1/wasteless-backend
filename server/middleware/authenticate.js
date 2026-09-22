const jwt = require("jsonwebtoken");

function authenticator(req, res, next) {
    const authHeader = req.headers["authorization"];

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
        return res.status(401).json({
            error: "Missing token"
        });
    }

    const token = authHeader.split(" ")[1];

    jwt.verify(token, process.env.JWT_SECRET, (err, data) => {
        if (err) {
            return res.status(401).json({
                error: "Invalid or expired token"
            });
        }

        req.user = data;
        next();
    });
}

module.exports = authenticator;