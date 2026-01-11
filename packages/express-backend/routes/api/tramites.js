const bpmnModel = require("../../models/bpmn");
const mailgun = require("mailgun-js")({
    apiKey: process.env.MAILGUN_KEY,
    domain: process.env.MAILGUN_DOMAIN,
});

module.exports = (app) => {
    app.post("/api/tramites", async (req, res, next) => {
        try {
            const bpmn = await bpmnModel.getAll();
            res.json(bpmn);
        } catch (err) {
            next(err);
        }
    });
    app.get("/api/tramites/:id", async (req, res, next) => {
        try {
            const bpmn = await bpmnModel.findOne(req.params.id);
            res.json(bpmn);
        } catch (err) {
            next(err);
        }
    });
    app.get("/api/email", async (req, res, next) => {
        try {
            const params = {
                from: `Gestdoc Express <contacto@gestdoc.cl>`,
                to: "seba.medinad@gmail.com",
                subject: "Test email",
                text: "Hello Charith Sample description time 1517831318946",
                html: "<html><body><h1>Hello  Charith</h1><p style='color:red'>Sample description</p> <p>Time 1517831318946</p></body></html>",
            };

            mailgun.messages().send(params, (err, data) => {
                if (err) {
                    next(err);
                } else {
                    console.log(data); // successful response
                    res.json({ ok: true });
                }
            });
        } catch (err) {
            next(err);
        }
    });

    app.use((err, req, res, next) => {
        console.error(err);
        res.status(500).json({ message: err });
    });
};
