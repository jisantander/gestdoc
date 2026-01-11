const jwt = require("jsonwebtoken");

const JWT_SECRET = process.env.JWT_SECRET || "covfefe";

module.exports = {
    generateToken: (data) => {
        return new Promise((resolve, reject) => {
            if (JWT_SECRET == null) return reject({ message: "No hay un token de seguridad!" });
            return resolve(jwt.sign(data, JWT_SECRET));
        });
    },
    generateEternalToken: (data) => {
        return new Promise((resolve, reject) => {
            if (JWT_SECRET == null) return reject({ message: "No hay un token de seguridad!" });
            return resolve(jwt.sign(data, JWT_SECRET, {}));
        });
    },
    verifyToken: (token) => {
        return new Promise((resolve, reject) => {
            jwt.verify(token, JWT_SECRET, (err, data) => {
                if (err) {
                    return reject(err);
                }
                //return data using the id from w/in JWTToken
                resolve(data);
            });
        });
    },
};
