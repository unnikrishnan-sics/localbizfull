const jwt = require("jsonwebtoken");

const protectedRoute = (req, res, next) => {
    try {
        const bearerToken = req.headers["authorization"];
        console.log(bearerToken);
        const token=bearerToken.split(" ")[1];
        console.log(token);

        if (!token) {
            return res.status(401).send("Access denied. No token provided.");
        }

        const decoded = jwt.verify(token, process.env.SECRET_KEY);
        console.log(decoded);
        req.user = decoded;
        next();

    } catch (error) {
        console.log(error.message);
        res.status(500).json({
            message: "Internal Server Error"
        })
    }
}

module.exports={protectedRoute}