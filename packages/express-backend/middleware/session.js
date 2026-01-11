const jwt = require("../lib/jwt");

module.exports = async (req, res, next) => {
    let token = req.headers["authorization"];
    if (!token) token = req.query.token;
    if (!token)
        return res.status(401).json({
            error: true,
            message: "Inicia sesión para acceder a este recurso",
        });
    try {
        const jwtData = await jwt.verifyToken(token);
        req.session = jwtData;
        next();
    } catch (err) {
        res.status(401).json({
            message: "Sesión expirada",
            error: err,
        });
        throw err;
    }
};
