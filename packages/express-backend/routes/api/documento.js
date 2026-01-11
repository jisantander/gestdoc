const { v4: uuidv4 } = require("uuid");
const multer = require("multer");
const {
    getDocumento,
    createDocumento,
    backwardDocumento,
    emailDocumento,
    reviewInitDocumento,
    reviewUpdDocumento,
    reviewFixDocumento,
    findOne,
    updateOne,
} = require("../../models/procedures");
const mail = require("../../lib/mail");
const uploadBase64 = require("../../lib/uploadBase64");
const uploadLocalAws = require("../../lib/uploadLocalAws");
const interfaceModel = require("../../models/interface");
const interfaceOdoo = require("../../lib/interfaceOdoo");
const updateDocument = require("../../lib/updateDocument");

const storage = multer.diskStorage({
    destination: (req, file, callBack) => {
        callBack(null, "uploads");
    },
    filename: (req, file, callBack) => {
        callBack(null, `${file.originalname}`);
    },
});
let upload = multer({ dest: "uploads/" });

module.exports = (app) => {
    app.get("/api/documento/:id", async (req, res, next) => {
        try {
            const documento = await getDocumento(req.params.id);
            res.json(documento);
        } catch (err) {
            console.error("[get doc]", err);
            next("El documento no ha podido ser encontrado");
        }
    });

    app.post("/api/documento", async (req, res, next) => {
        try {
            const documento = await createDocumento(req.body);
            res.json(documento);
        } catch (err) {
            console.error("[create doc]", err);
            next(err);
        }
    });

    app.put("/api/documento/:transaction", async (req, res, next) => {
        try {
            const nextStage = await updateDocument(req.params.transaction, req.body, req);
            res.json(nextStage);
        } catch (err) {
            console.error("bye bye,", err);
            next(err);
        }
    });

    app.put("/api/documento/back/:transaction", async (req, res, next) => {
        try {
            const { current, activity, participant, current_name, vence } = req.body;
            let data = await backwardDocumento(
                req.params.transaction,
                current,
                activity,
                participant,
                current_name,
                vence
            );
            if (data?.type === "sign_in") {
                console.log('Debido a ser "sign_in" se inicia doble retroceso');
                const procedure = await getDocumento(req.params.transaction);
                const participantData = procedure.documento.participants.find((it) => it.id === participant);
                data = await backwardDocumento(
                    req.params.transaction,
                    participantData.previousId,
                    participantData.previous.id,
                    participantData.id,
                    participantData.previous.name,
                    vence
                );
            }
            res.json({ message: "Documento actualizado en retroceso!", data });
        } catch (err) {
            console.error("[back doc]", err);
            next(err);
        }
    });

    app.post("/api/documento/email/:transaction", async (req, res, next) => {
        try {
            const { participant, index, old, ...info } = req.body;
            const pixel = await emailDocumento(req.params.transaction, participant, index, info, old);
            await mail.pixel({
                activity: pixel.activity,
                email: info.email,
                procedure: req.params.transaction,
            });
            res.json({ message: "Documento actualizado en invitacion!" });
        } catch (err) {
            console.error("[email doc]", err);
            next(err);
        }
    });

    app.post("/api/documento/reviews/:transaction", async (req, res, next) => {
        try {
            const { activity, emails } = req.body;
            const emailArray = emails.map((email) => ({
                uid: uuidv4(),
                email,
                activity,
                comment: "",
                reviewed: false,
                approved: false,
                asked: new Date(),
                review_at: false,
            }));
            await reviewInitDocumento(req.params.transaction, emailArray);
            await mail.askReview({
                emails: emailArray,
                procedure: req.params.transaction,
            });
            res.json({ message: "Documento actualizado!" });
        } catch (err) {
            console.error("[reviews doc]", err);
            next(err);
        }
    });

    app.post("/api/documento/review/:transaction", async (req, res, next) => {
        try {
            const { transaction } = req.params;
            const { uid, approved, comment } = req.body;
            const procedure = await findOne(transaction);
            const review = procedure.reviews.find((it) => it.uid === uid);
            if (!review) return res.status(500).json({ message: "Review inválida" });
            if (review.reviewed) return res.status(500).json({ message: "Review ya realizada" });
            await reviewUpdDocumento(transaction, uid, approved, comment);
            if (procedure.email) {
                await mail.hasReviewed({
                    procedure: req.params.transaction,
                    email: procedure.email,
                    reviewer: review.email,
                });
            }
            res.json({ message: "Documento actualizado!" });
        } catch (err) {
            console.error("[review doc]", err);
            next(err);
        }
    });

    app.post("/api/documento/fixreview/:transaction", async (req, res, next) => {
        try {
            const { transaction } = req.params;
            const { activity, participant, form } = req.body;
            const procedure = await findOne(transaction);
            const formToFix = {};
            const participantData = procedure.gestores.find((it) => it.id === participant);
            for (var key in form) {
                if (participantData.form[key] !== form[key]) {
                    if (!Array.isArray(participantData.form[key])) {
                        if (
                            participantData.form[key].substring(0, 8) === "https://" &&
                            form[key].substring(0, 4) === "data"
                        ) {
                            const url = await uploadBase64(form[key], transaction, key);
                            formToFix[key] = url;
                        } else {
                            formToFix[key] = form[key];
                        }
                    } else {
                        formToFix[key] = form[key];
                    }
                }
            }
            const emailArray = procedure.reviews.map(({ email }) => ({
                uid: uuidv4(),
                email,
                activity,
                comment: "",
                reviewed: false,
                approved: false,
                asked: new Date(),
                review_at: false,
            }));
            const formToSet = {};
            for (var key in formToFix) {
                formToSet[`gestores.$.form.${key}`] = formToFix[key];
                for (var keyH in participantData.history) {
                    if (participantData.history[keyH].form) {
                        if (participantData.history[keyH].form[key]) {
                            formToSet[`gestores.$.history.${keyH}.form.${key}`] = formToFix[key];
                        }
                    }
                }
            }
            await reviewFixDocumento(req.params.transaction, participant, emailArray, formToSet, procedure.reviews);
            await mail.askReview({
                emails: emailArray,
                procedure: req.params.transaction,
            });
            res.json({ message: "Documento actualizado!" });
        } catch (err) {
            console.error("[review doc]", err);
            next(err);
        }
    });

    app.post("/api/documento/getreview/:transaction", async (req, res, next) => {
        try {
            const { transaction } = req.params;
            const { reviews } = await findOne(transaction);
            res.json({ reviews });
        } catch (err) {
            console.error("[getreview doc]", err);
            next(err);
        }
    });

    app.post("/api/documento/upload/:transaction", upload.single("file"), async (req, res, next) => {
        try {
            const { transaction } = req.params;
            const file = req.file;
            const awsUrl = await uploadLocalAws(file.path, `${transaction}.pdf`);
            await updateOne({ _id: transaction }, { $set: { upload: awsUrl.Location } });
            res.json({ message: "Subida ok", url: awsUrl.Location });
        } catch (err) {
            console.error("[getreview doc]", err);
            next(err);
        }
    });

    app.post("/api/documento/return/:transaction", async (req, res, next) => {
        try {
            const { transaction } = req.params;
            const procedure = await findOne(transaction);
            const interface = await interfaceModel.findOne(procedure.returnData.interface);
            if (interface.type === "ODOO") {
                await interfaceOdoo.uploadPdf(
                    JSON.parse(interface.authJson),
                    `${procedure._id}.pdf`,
                    procedure.returnData.res
                );
            }
            res.json({ message: "Subida ok" });
        } catch (err) {
            console.error("[getreview doc]", err);
            next(err);
        }
    });

    app.use((err, req, res, next) => {
        res.status(500).json({ message: err });
    });
};
