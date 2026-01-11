const { find } = require("../../models/procedures");
const middlewareSession = require("../../middleware/session");

module.exports = (app) => {
    app.get("/api/orders", middlewareSession, async (req, res, next) => {
        try {
            const data = await find({ email: req.session.email });
            res.json(data);
        } catch (err) {
            next(err);
        }
    });

    app.use((err, req, res, next) => {
        console.error(err);
        res.status(500).json({ message: err });
    });
};
