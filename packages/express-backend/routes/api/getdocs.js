const previewDocument = require("../../lib/previewDocument");
const generateWord = require("../../lib/generateWord");
const signDocument = require("../../lib/signDocument");
const reviewDocs = require("../../lib/reviewDocs");
const reviewUpload = require("../../lib/reviewUpload");
const awsDownload = require("../../lib/awsDownload");
const Sentry = require("@sentry/node");

module.exports = (app) => {
    app.get("/api/getdocs/:transaction/:doc", async (req, res) => {
        try {
            const { stat, file, name } = await previewDocument(req.params.transaction, req.params.doc);
            res.setHeader("Content-Length", stat.size);
            res.setHeader("Content-Type", "application/pdf");
            res.setHeader("Content-Disposition", "inline; filename=" + name);
            file.pipe(res);
        } catch (e) {
            console.error("[preview]", e);

            const scope = new Sentry.Scope();
            let errorSentry = {
                transaction: req.params.transaction,
                doc: req.params.doc,
                err: e,
                context: "/api/getdocs/:transaction/:doc method",
            };

            if (e.properties?.errors?.length > 0) {
                //generar una lista de los errores con el metodo reduce de Js
                const errors = e.properties.errors.reduce((acc, error) => {
                    return acc + "  " + error.properties.explanation + "  ";
                });
                console.log(errors);
                errorSentry.moreError = errors;

                res.status(500).json({
                    message: "Hubo un error  al generar el documento." + errors,
                });
            } else {
                res.status(500).json({
                    message: "Hubo un error al generar el documento.",
                });
            }

            Sentry.captureException(errorSentry, scope);
        }
    });

    app.get("/api/file-sign/:transaction/:doc", async (req, res) => {
        try {
            const pdfBuffer = await signDocument(req.params.transaction, req.params.doc);
            res.status(200);
            res.type("pdf");
            res.send(pdfBuffer);
        } catch (e) {
            console.error("[sign]", e);
            const scope = new Sentry.Scope();
            Sentry.captureException(e, scope);

            res.status(500).json({
                message: "Hubo un error  al firmar el documento.",
            });
        }
    });

    app.get("/api/previewDoc/:transaction/:doc", async (req, res) => {
        try {
            const pdfBuffer = await reviewDocs(req.params.transaction, req.params.doc);
            res.status(200);
            res.type("pdf");
            res.send(pdfBuffer);
        } catch (e) {
            console.error("[sign]", e);
            const scope = new Sentry.Scope();
            Sentry.captureException(e, scope);

            res.status(500).json({
                message: "Hubo un error  al firmar el documento.",
            });
        }
    });

    app.get("/api/uploaded/:transaction", async (req, res) => {
        try {
            const pdfBuffer = await reviewUpload(req.params.transaction);
            res.status(200);
            res.type("pdf");
            res.send(pdfBuffer);
        } catch (e) {
            console.error("[get uploaded]", e);
            const scope = new Sentry.Scope();
            Sentry.captureException(e, scope);

            res.status(500).json({
                message: "Hubo un error  al firmar el documento.",
            });
        }
    });

    app.get("/api/rescue/:pdfUrl", async (req, res) => {
        try {
            const pdfBuffer = await awsDownload(req.params.pdfUrl);
            res.status(200);
            res.type("pdf");
            res.send(pdfBuffer);
        } catch (err) {
            console.error("[try uploaded]", err.response);
            next(err);
        }
    });

    app.get("/api/generarUnError", async (req, res) => {
        try {
            throw "myException";
        } catch (e) {
            console.error("[sign]", e);
            const scope = new Sentry.Scope();
            Sentry.captureException(e, scope);

            res.status(500).json({
                message: "Hubo un error  al firmar el documento.",
            });
        }
    });

    app.get("/api/word/:transaction/:doc", async (req, res) => {
        try {
            const { stat, file, name } = await generateWord(req.params.transaction, req.params.doc);
            res.setHeader("Content-Length", stat.size);
            res.setHeader("Content-Type", "application/octet-stream");
            res.setHeader("Content-Disposition", "attachment; filename=" + name);
            file.pipe(res);
        } catch (e) {
            console.error("[preview]", e);

            const scope = new Sentry.Scope();
            let errorSentry = {
                transaction: req.params.transaction,
                doc: req.params.doc,
                err: e,
                context: "/api/getdocs/:transaction/:doc method",
            };

            if (e.properties?.errors?.length > 0) {
                //generar una lista de los errores con el metodo reduce de Js
                const errors = e.properties.errors.reduce((acc, error) => {
                    return acc + "  " + error.properties.explanation + "  ";
                });
                console.log(errors);
                errorSentry.moreError = errors;

                res.status(500).json({
                    message: "Hubo un error  al generar el documento." + errors,
                });
            } else {
                res.status(500).json({
                    message: "Hubo un error al generar el documento.",
                });
            }

            Sentry.captureException(errorSentry, scope);
        }
    });
};
