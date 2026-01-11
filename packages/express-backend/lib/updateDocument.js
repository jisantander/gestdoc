const { getDocumento, updateDocumento } = require("../models/procedures");
const { upsert } = require("../models/users");
const mail = require("../lib/mail");
const asyncForEach = require("../lib/asyncForEach");
const { updatePixel } = require("../models/pixel");
const { createNotification } = require("../models/notification");
const previewDocument = require("../lib/previewDocument");

module.exports = (procedureId, bodyData, req = null) => {
    return new Promise(async (resolve, reject) => {
        try {
            let data = { ...bodyData.data };
            let current = bodyData.current;
            let documentoMail = false;

            if (data.type === "email") {
                documentoMail = await getDocumento(procedureId, false);
                await mail.template(procedureId, current, documentoMail);
            }
            if (data.type === "sign_in") {
                if (data.value) {
                    const userData = await upsert(data.value);
                    const documento = await getDocumento(procedureId);
                    if (!documento.email) {
                        data.user = userData._id;
                        if (userData.type === "new") {
                            await mail.signup({ ...documento });
                        } else {
                            await mail.newProcedure({ ...userData, ...documento });
                        }
                    }
                }
            }
            const nextStage = await updateDocumento(procedureId, current, data);
            if (data.type === "request_signature") {
                /*
                await asyncForEach(data.emails, async (item) => {
                    await mail.pixel({
                        activity: current,
                        email: item,
                        procedure: procedureId,
                    });
                });
                */
            }

            if (nextStage) {
                if (nextStage["custom:functions"] === "signature") {
                    if (nextStage.emails) {
                        await asyncForEach(nextStage.emails, async (item) => {
                            await mail.pixel({
                                activity: current,
                                email: item,
                                procedure: procedureId,
                            });
                        });
                    } else {
                        await updatePixel(data.value.pixel, {
                            lecture: {
                                host: req.headers.host,
                                params: req.params,
                                query: req.query,
                                agent: req.headers["user-agent"],
                                ip: req.headers["x-forwarded-for"] || req.connection.remoteAddress,
                            },
                            finalized: true,
                        });
                    }
                }
            }

            if (data.type === "signature") {
                if (data.emails) {
                    await asyncForEach(data.emails, async (item) => {
                        await mail.pixel({
                            activity: current,
                            email: item,
                            procedure: procedureId,
                        });
                    });
                } else {
                    await updatePixel(data.value.pixel, {
                        lecture: {
                            host: req.headers.host,
                            params: req.params,
                            query: req.query,
                            agent: req.headers["user-agent"],
                            ip: req.headers["x-forwarded-for"] || req.connection.remoteAddress,
                        },
                        finalized: true,
                    });
                }
            }
            if (nextStage) {
                try {
                    if (typeof nextStage.next !== "undefined") {
                        if (nextStage.next["$"]["custom:functions"] === "doc") {
                            await previewDocument(procedureId, nextStage.next["$"]["custom:doc"]);
                        }
                    }
                } catch (error) {
                    console.log("[error]", error);
                }
                if (nextStage["custom:functions"] === "doc") {
                    await previewDocument(procedureId, nextStage["custom:doc"]);
                }
            }
            if (nextStage === undefined) {
                let mailSended = false;
                if (!documentoMail) {
                    documentoMail = await getDocumento(procedureId, false);
                }
                if (documentoMail.ecert) {
                    if (documentoMail.ecert.length > 0) {
                        const mailsEcert = documentoMail.ecert
                            .filter((it) => it.nombre)
                            .map((it) => it.email)
                            .join(",");
                        await mail.sendEcertAlert(mailsEcert, documentoMail._id);
                        mailSended = true;
                    }
                }
                if (!mailSended) {
                    const people = documentoMail.gestores[0].people;
                    if (people) {
                        if (people.length > 0) {
                            const mailsEcert = people.map((it) => it.email).join(",");
                            await mail.sendSimpleSignatureAlert(mailsEcert, documentoMail._id);
                            mailSended = true;
                        }
                    }
                }
            }
            if (data.notification) {
                await createNotification({
                    procedure: procedureId,
                    current: current,
                    data: data,
                });
            }
            resolve(nextStage);
        } catch (err) {
            reject(err);
        }
    });
};
