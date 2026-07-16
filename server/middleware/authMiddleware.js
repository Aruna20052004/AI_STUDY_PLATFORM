const jwt = require("jsonwebtoken");

const authMiddleware = (req, res, next) => {

    try {

        const token = req.headers.authorization;

        if (!token) {

            return res.status(401).json({
                message: "No Token Provided",
            });

        }

        const verified = jwt.verify(
            token,
            process.env.JWT_SECRET
        );

        req.user = {
            id: verified.id || verified.userId,
            userId: verified.userId || verified.id,
            role: verified.role || "student"
        };

        next();

    } catch (error) {

        res.status(401).json({
            message: "Invalid Token",
        });

    }

};

module.exports = authMiddleware;