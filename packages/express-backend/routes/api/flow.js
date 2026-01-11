const fs = require("fs");
const path = require("path");
const axios = require("axios");
const qs = require("qs");
const mail = require("../../lib/mail");
const asyncForEach = require("../../lib/asyncForEach");

const { getDocumento, updateDocumento } = require("../../models/procedures");
const flow = require("../../lib/flow");
const { sendPixelEvent } = require("../../lib/facebookEvents");
const Sentry = require("@sentry/node");
const FLOW_URL_CONFIRMACION = process.env.FLOW_URL_CONFIRMATION;
const FLOW_URL_RETORNO = process.env.FLOW_URL_RETURN;

module.exports = (app) => {
    /**
     * Servicio de solicitud a Flow
     * Se recibe el ID de la transferencia en la variable req.body.transaction
     * Se genera la orden a Flow y se redirige al usuario.
     */
    app.post("/api/flow/create", async (req, res, next) => {
        try {
            if (!req.body.transaction) throw "Debe enviar una transaccion!";
            const documento = await getDocumento(req.body.transaction);
            let amountTotal = 0;

            if (documento.email === undefined) {
                return next(
                    "No se ha iniciado sesión durante el procedimiento. Por favor comunicar a soporte para esta corrección."
                );
            }

            let participantData = null;
            if (documento.documento.participants.length > 1) {
                participantData = documento.gestores.find((it) => it.id === participant);
            } else if (documento) {
                participantData = documento.gestores[0];
            }
            documento.documento.participants.forEach((item) => {
                if (item.id === req.body.participant) {
                    amountTotal = parseFloat(item.next["custom:charge_value"]);
                    //custom:charge_by_sign:'1500'  * num sign
                    if (item.next["custom:charge_by_sign"]) {
                        amountTotal = amountTotal + item.next["custom:charge_by_sign"] * participantData.emails.length;
                    }
                }
            });
            const orderId = req.body.transaction + "-" + req.body.current + "-" + amountTotal;
            const order = {
                apiKey: process.env.FLOW_API_KEY,
                commerceOrder: orderId,
                subject: documento.documento._nameSchema,
                amount: amountTotal,
                email: documento.email,
                urlConfirmation: FLOW_URL_CONFIRMACION + orderId,
                urlReturn: FLOW_URL_RETORNO + orderId,
            };

            const firma = flow(order);
            const { data } = await axios.post(
                `${process.env.FLOW_URL}/payment/create`,
                qs.stringify({
                    ...order,
                    s: firma,
                })
            );
            res.send(data);
        } catch (err) {
            console.error(err);
            const scope = new Sentry.Scope();
            Sentry.captureException(err, scope);
            if (err.isAxiosError) {
                res.status(500).json(err.response.data);
            } else {
                res.status(500).json({ message: err });
            }
        }
    });

    /**
     * Servicio de recepcion de confirmación de Flow
     * Se recibe el ID de la transferencia en la variable req.body.token
     * Este se debe almacenar en la base de datos
     */
    app.post("/api/flow/confirm/:flowid", async (req, res, next) => {
        try {
            const [transaction, current, amount] = req.params.flowid.split("-");
            //aqui deberia mandar correos
            const nextStage = await updateDocumento(transaction, current, {
                token: req.body.token,
                titleStage: "Pago con Flow",
                type: "charge",
                amount,
            });
            if (nextStage) {
                //si es que el proximo stage es signature debe enviar correos
                if (nextStage["custom:functions"] === "signature") {
                    if (nextStage.emails) {
                        return new Promise(async (resolve, reject) => {
                            try {
                                await asyncForEach(nextStage.emails, async (item) => {
                                    await mail.pixel({
                                        activity: current,
                                        email: item,
                                        procedure: transaction,
                                    });
                                });
                                resolve(res.json(nextStage));
                            } catch (err) {
                                reject(next(err));
                            }
                        });
                    }
                }
            }
            try {
                console.log("intenta enviar pixel a fb");
                const procedure = await getDocumento(transaction, false);
                const remoteIp =
                    req.headers["x-real-ip"] || req.headers["x-forwarded-for"] || req.connection.remoteAddress;
            
                    await sendPixelEvent({
                    amount,
                    transaction,
                    procedure: procedure.bpmn,
                    ip: remoteIp,
                    agent: req.get("User-Agent"),
                    email: procedure.email,
                });
            
                console.log("envia con exito pixel a fb");
            } catch (err) {
                console.error("[FB PIXEL]", err);
                const scope = new Sentry.Scope();
                Sentry.captureException(err, scope);
            }
            res.json(nextStage);
        } catch (err) {
            const scope = new Sentry.Scope();
            Sentry.captureException(err, scope);
            next(err);
        }
    });

    /**
     * Servicio de redirección de Flow
     * Flow nos devuelve un POST, pero nosotros necesitamos un GET para React
     * Utilizamos ese HTML intermedio para salvar este contratiempo
     */
    app.post("/api/flow/continue/:flowid", async (req, res) => {
        fs.readFile(path.join(__dirname, "../../templates/redirect.html"), "utf8", function (err, html) {
            if (err) {
                console.error(err);
                return res.status(500).end();
            }
            const [transaction, current] = req.params.flowid.split("-");
            template = html;
            template = template.replace("{{REACT_URL}}", process.env.REACT_URL);
            template = template.replace("{{TRANSACTION}}", transaction);
            res.send(template);
        });
    });

    app.use((err, req, res, next) => {
        console.error(err);
        res.status(500).json({ message: err });
    });
};
