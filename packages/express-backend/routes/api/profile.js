const modelUser = require("../../models/users");
const middlewareSession = require("../../middleware/session");

module.exports = (app) => {
    app.put("/api/profile", middlewareSession, async (req, res, next) => {
        try {
            await modelUser.update(req.session._id, req.body);
            res.json({ message: "Usuario actualizado" });
        } catch (err) {
            console.error(err);
            next(err);
        }
    });
};
