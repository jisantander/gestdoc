const verificationsModel = require("../../models/verifications");
const usersModel = require("../../models/users");

module.exports = (app) => {
    app.get("/api/verification_email/:hash", async (req, res) => {
        try {
            var query = { _hash: req.params.hash };

            const data = await verificationsModel.findOne(query);
            let resultData = null;
            if (data.email) {
                resultData = await usersModel.updateStatus(data.email, { status: true });
                const deletethis = await verificationsModel.deleteHash(req.params.hash);
                res.json(data);
            } else {
                res.json({ message: "el hash no existe" });
            }
        } catch (e) {
            console.error("[preview]", e);
            res.status(500).json({
                message: "Hubo un error al consultar el hash.",
            });
        }
    });

    app.post("/api/reset_password/", async (req, res) => {
        try {
            var query = { _hash: req.body._hash };
            const data = await verificationsModel.findOne(query);
            let resultData = null;
            if (data.email) {
                resultData = await usersModel.updatePassword({ email: data.email, password: req.body.password });
                const deletethis = await verificationsModel.deleteHash(req.body._hash);
                res.json(data);
            } else {
                res.json({ message: "el hash no existe" });
            }
        } catch (e) {
            console.error("[preview]", e);
            res.status(500).json({
                message: "Hubo un error  2 al generar el documento2.",
            });
        }
    });
};
