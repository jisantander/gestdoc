const urlModel = require("../../models/url");

module.exports = (app) => {
    app.get("/api/short/:code", async (req, res) => {
        try {
            const { rxsUrl } = await urlModel.findByCode(req.params.code);
            urlModel.updClick(req.params.code);
            res.json({ url: rxsUrl });
        } catch (err) {
            console.error("[get short]", err);
            next(err);
        }
    });
};
