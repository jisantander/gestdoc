const { PDFDocument, StandardFonts } = require("pdf-lib");
const QRCode = require("qrcode");
const ObjectId = require("mongoose").Types.ObjectId;

const asyncForEach = require("../../lib/asyncForEach");
const { findOne, findByFilter, getDocumento, updateOne, ecertFixDocumento } = require("../../models/procedures");
const userModel = require("../../models/users");
const { createEcert, updateEcert } = require("../../models/ecert");
const {
    ecertLogin,
    ecertPreinscribeOne,
    ecertUpload,
    ecertEmail,
    ecertEnroladoPreinscribe,
    ecertEnroladoUpload,
    ecertEnroladoEmail,
    ecertCaducar,
} = require("../../lib/ecert");
const downloadBase64 = require("../../lib/downloadBase64");
const uploadBase64 = require("../../lib/uploadBase64");
const uploadBase64Text = require("../../lib/uploadBase64Text");
const Sentry = require("@sentry/node");
const updateDocument = require("../../lib/updateDocument");

function escapeRegExp(string) {
    return string.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}
function replaceAll(str, term, replacement) {
    return str.replace(new RegExp(escapeRegExp(term), "g"), replacement);
}

module.exports = (app) => {
    app.post("/api/ecert/request", async (req, res, next) => {
        try {
            const { transaction, participant, requests } = req.body;
            const ecertToSign = [];
            const ecert = [];

            if (!transaction) {
                throw "No se ha enviado la transaccion a modificar";
            }
            if (!participant) {
                throw "No se ha enviado el participante actual";
            }

            const token = await ecertLogin();
            const procedure = await getDocumento(transaction);

            const current = procedure.documento.participants.find((it) => {
                return it.next["custom:functions"] === "advanced_signature";
            });

            let rutEnrolados = [];
            if (current.next["custom:ecert_rut"])
                if (current.next["custom:ecert_rut"] !== "") rutEnrolados = current.next["custom:ecert_rut"].split(",");

            if (requests.length === 0 && rutEnrolados.length === 0) {
                throw "Se debe ingresar al menos un participante o un firmante enrolado.";
            }
            if (requests.length > 0) {
                if (!requests) {
                    throw "No se ha enviado ningun usuario para firmar";
                }
                if (requests.length === 0) {
                    throw "No se ha enviado ningun usuario para firmar";
                }
                let isValid = true;
                requests.forEach((item) => {
                    if (!item.rut) isValid = false;
                    if (!item.nombre) isValid = false;
                    if (!item.appat) isValid = false;
                    //if (!item.apmat) isValid = false;
                    if (!item.email) isValid = false;
                    ecertToSign.push(item);
                });
                if (!isValid) {
                    throw "Se debe enviar RUT, nombre, apellido paterno y correo electronico";
                }
            }

            if (current.next["custom:ecert_rut"] !== "") {
                if (rutEnrolados.length > 0) {
                    let usersEcert = await userModel.findAll({ _id: { $in: rutEnrolados.map((it) => ObjectId(it)) } });
                    if (procedure.company) {
                        usersEcert = usersEcert.filter((it) => {
                            if (it.company === undefined) return false;
                            return it.company + "" === procedure.company + "";
                        });
                    }
                    if (usersEcert.length > 0) {
                        usersEcert.forEach((userRol) => {
                            ecertToSign.push({
                                ecertName: userRol.ecert_title_rol,
                                rut: replaceAll(userRol.ecert_rut, ".", ""),
                            });
                        });
                    }
                }
            }

            let docToReview = false;
            let docTitle = "";
            procedure.gestores.forEach((item) => {
                if (item.id === participant) {
                    for (var key in item.history) {
                        const historyStage = item.history[key];
                        if (historyStage.type === "doc") {
                            docToReview = historyStage.value;
                        }
                    }
                }
            });
            if (!docToReview) {
                for (var key in procedure.documento.docs) {
                    if (!docToReview) docToReview = procedure.documento.docs[key].id;
                }
            }
            for (var key in procedure.documento.docs) {
                if (key === docToReview) docTitle = procedure.documento.docs[key].title;
            }
            if (docTitle === "") {
                docTitle = procedure.documento._nameSchema;
            }

            let signatureType = 3; // advanced
            procedure.documento.participants.forEach((item) => {
                if (item.id === participant) {
                    if (item.next["custom:ecert_type"] === "simple") {
                        signatureType = 4; // simple
                    }
                }
            });
            const filePath = procedure.upload === "" ? `${transaction}-${docToReview}.pdf` : `${transaction}.pdf`;
            const contentBaseFile = await downloadBase64(filePath);

            const pdfDoc = await PDFDocument.load(contentBaseFile);
            /* Obtenemos la primera pagina */
            const pages = pdfDoc.getPages();
            //const firstPage = pages[0];
            const lastPage = pages[pages.length - 1];

            await pdfDoc.embedFont(StandardFonts.TimesRoman);
            const ticketId = `${process.env.REACT_URL}/p/${procedure.short}`;

            const out = await QRCode.toString(ticketId, {
                type: "svg",
                //version: 9,
                //errorCorrectionLevel: "H",
            });
            const svgresolve = out.split('stroke="#000000" d="');
            const svgresolve2 = svgresolve[1].split('"/></');

            lastPage.moveTo(10, lastPage.getHeight() - 5);
            lastPage.moveDown(680);
            lastPage.drawSvgPath(svgresolve2[0], {
                scale: 2.5,
            });
            const pdfBytes = await pdfDoc.save();
            const pdfBuffer = Buffer.from(pdfBytes.buffer, "binary");
            const contentBase64 = pdfBuffer.toString("base64");

            console.log(ecertToSign);
            await asyncForEach(ecertToSign, async (item, index) => {
                if (index === 0) {
                    if (item.ecertName) {
                        const data = await ecertEnroladoPreinscribe({
                            token,
                            signatureType,
                            rut: item.rut,
                        });
                        const upload = await ecertEnroladoUpload({
                            token,
                            rut: item.rut,
                            idcert: data.IdPrenscripcion,
                            docContent: contentBase64,
                            docTitle,
                            page: pages.length,
                        });
                        ecert.push({
                            ...item,
                            ...data,
                            ...upload,
                            last: false,
                            type: signatureType,
                            title: docTitle,
                            page: pages.length,
                            filePath,
                            signed: false,
                            content: "",
                            accepted: false,
                            reason: "",
                        });
                        await ecertEnroladoEmail({ token, idcert: data.IdPrenscripcion, rut: item.rut });
                    } else {
                        const data = await ecertPreinscribeOne({
                            token,
                            signatureType,
                            ...item,
                        });
                        const upload = await ecertUpload({
                            token,
                            rut: item.rut,
                            idcert: data.IdUsuarioECert,
                            docContent: contentBase64,
                            docTitle,
                            page: pages.length,
                        });
                        ecert.push({
                            ...item,
                            ...data,
                            ...upload,
                            last: false,
                            type: signatureType,
                            title: docTitle,
                            page: pages.length,
                            filePath,
                            signed: false,
                            content: "",
                            accepted: false,
                            reason: "",
                        });
                        await ecertEmail({ token, idcert: data.IdUsuarioECert, rut: item.rut });
                    }
                } else {
                    ecert.push({ ...item });
                }
            });
            await updateOne({ _id: transaction }, { $set: { ecert } });
            res.json({ message: "ok" });
        } catch (err) {
            next(err);
        }
    });

    app.post("/api/ecert/reviews", async (req, res) => {
        const { transaction } = req.body;
        if (!transaction) {
            throw "No se ha enviado la transaccion a revisar";
        }
        const { ecert } = await getDocumento(transaction, false);
        res.json({ ecert });
    });

    app.post("/api/ecert/modify", async (req, res, next) => {
        const { transaction, participant, data } = req.body;
        if (!transaction) {
            throw "No se ha enviado la transaccion a revisar";
        }
        if (!participant) {
            throw "No se ha enviado el participante del tramite";
        }
        if (!data) {
            throw "No se ha enviado la información a modificar";
        }
        try {
            const { ecert } = await getDocumento(transaction, false);
            let ecertIndex = false;
            if (data.IdUsuarioECert) {
                ecertIndex = ecert.findIndex((it) => it.IdUsuarioECert === data.IdUsuarioECert);
                const token = await ecertLogin();

                await ecertCaducar({ token, idcert: data.IdUsuarioECert, rut: ecert[ecertIndex].rut });

                const contentBaseFile = await downloadBase64(data.filePath);

                const newData = await ecertPreinscribeOne({
                    token,
                    signatureType: data.type,
                    ...data,
                });
                const upload = await ecertUpload({
                    token,
                    rut: data.rut,
                    idcert: newData.IdUsuarioECert,
                    docContent: contentBaseFile.toString("base64"),
                    docTitle: data.title,
                    index: ecertIndex,
                    page: data.page,
                });
                const ecertData = {
                    ...data,
                    ...newData,
                    ...upload,
                    last: data.last,
                    type: data.type,
                    title: data.title,
                    page: data.page,
                    filePath: data.filePath,
                    signed: false,
                    content: "",
                    accepted: false,
                    reason: "",
                };
                await ecertEmail({ token, idcert: newData.IdUsuarioECert, rut: data.rut });

                await updateOne(
                    { _id: transaction, "ecert.IdUsuarioECert": data.IdUsuarioECert },
                    {
                        $set: {
                            "ecert.$": ecertData,
                        },
                        $push: {
                            oldEcert: ecert[ecertIndex],
                        },
                    }
                );
            } else {
                ecertIndex = ecert.findIndex((it) => it.rut === data.rut);
                const ecertData = {
                    ...ecert[ecertIndex],
                    ...data,
                };

                await updateOne(
                    { _id: transaction, "ecert.rut": data.rut },
                    {
                        $set: {
                            "ecert.$": ecertData,
                        },
                        $push: {
                            oldEcert: ecert[ecertIndex],
                        },
                    }
                );
            }
            res.json({ message: "ok" });
        } catch (err) {
            if (err) next(err.toString());
            else next("Hubo un error al modificar");
        }
    });

    app.post("/api/ecert/fixreview", async (req, res, next) => {
        try {
            const { transaction, participant, form } = req.body;
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
            await ecertFixDocumento(transaction, participant, formToSet, procedure.ecert);
            res.json({ message: "Documento actualizado!" });
        } catch (err) {
            console.error("[review doc]", err);
            next(err);
        }
    });

    app.post("/api/ecert/callback", async (req, res, next) => {
        try {
            const temporalId = await createEcert(req.body);
            const { DoctoId, Firmado, RazonRechazo, DoctoBase64 } = req.body;
            const procedure = await findByFilter({ "ecert.DocumentoId": DoctoId }, true);
            const current = procedure.documento.participants.find((it) => {
                return it.next["custom:functions"] === "advanced_signature";
            });
            const ecertInd = procedure.ecert.findIndex((it) => it.DocumentoId === DoctoId);
            const ecertUpd = procedure.ecert[ecertInd];
            let url = "";
            if (Firmado) url = await uploadBase64Text(DoctoBase64, ecertUpd.filePath);
            if (ecertInd + 1 === procedure.ecert.length) {
                /*if (current.next["ecert_user"] && !ecertUpd.last) {
                    const userRol = await userModel.findOne(current.next["ecert_user"]);
                    const { type: signatureType, title: docTitle, page } = ecertUpd;
                    const ecertNext = {
                        rut: replaceAll(userRol.ecert_rut, ".", ""),
                    };
                    const token = await ecertLogin();
                    const data = await ecertEnroladoPreinscribe({
                        token,
                        signatureType,
                        ...ecertNext,
                    });
                    const upload = await ecertEnroladoUpload({
                        token,
                        rut: ecertNext.rut,
                        idcert: data.IdPrenscripcion,
                        docContent: DoctoBase64,
                        docTitle,
                        index: ecertInd + 1,
                        page,
                    });
                    const ecertData = {
                        ...ecertNext,
                        ...data,
                        ...upload,
                        last: true,
                        type: signatureType,
                        title: docTitle,
                        page,
                        filePath: ecertUpd.filePath,
                        signed: false,
                        content: "",
                        accepted: false,
                        reason: "",
                    };
                    await ecertEnroladoEmail({ token, idcert: data.IdPrenscripcion, rut: ecertNext.rut });
                    await updateOne({ _id: procedure._id }, { $set: { [`ecert.${ecertInd + 1}`]: ecertData } });
                } else {*/
                /* Aqui acaba el procedimiento */
                await updateDocument(
                    procedure._id,
                    {
                        current: procedure.gestores[0].current,
                        data: {
                            type: "advanced_signature",
                            titleStage: current.next.name,
                            notification: current.next["custom:notification"] === "true",
                        },
                    },
                    req
                );
                //}
            } else {
                const ecertNext = procedure.ecert[ecertInd + 1];
                const { type: signatureType, title: docTitle, page } = ecertUpd;
                let docTitleToSet = docTitle;
                if (!docTitleToSet) {
                    docTitleToSet = procedure.ecert[0].title;
                }
                if (docTitleToSet === "") {
                    docTitleToSet = "Procedimiento";
                }
                const token = await ecertLogin();
                if (ecertNext.ecertName) {
                    const data = await ecertEnroladoPreinscribe({
                        token,
                        signatureType,
                        ...ecertNext,
                    });
                    const upload = await ecertEnroladoUpload({
                        token,
                        rut: ecertNext.rut,
                        idcert: data.IdPrenscripcion,
                        docContent: DoctoBase64,
                        docTitle: docTitleToSet,
                        index: ecertInd + 1,
                        page,
                    });
                    const ecertData = {
                        ...ecertNext,
                        ...data,
                        ...upload,
                        last: false,
                        type: signatureType,
                        title: docTitleToSet,
                        page,
                        filePath: ecertUpd.filePath,
                        signed: false,
                        content: "",
                        accepted: false,
                        reason: "",
                    };
                    await ecertEnroladoEmail({ token, idcert: data.IdPrenscripcion, rut: ecertNext.rut });
                    await updateOne({ _id: procedure._id }, { $set: { [`ecert.${ecertInd + 1}`]: ecertData } });
                } else {
                    const data = await ecertPreinscribeOne({
                        token,
                        signatureType,
                        ...ecertNext,
                    });
                    const upload = await ecertUpload({
                        token,
                        rut: ecertNext.rut,
                        idcert: data.IdUsuarioECert,
                        docContent: DoctoBase64,
                        docTitle,
                        index: ecertInd + 1,
                        page,
                    });
                    const ecertData = {
                        ...ecertNext,
                        ...data,
                        ...upload,
                        last: false,
                        type: signatureType,
                        title: docTitle,
                        page,
                        filePath: ecertUpd.filePath,
                        signed: false,
                        content: "",
                        accepted: false,
                        reason: "",
                    };
                    await ecertEmail({ token, idcert: data.IdUsuarioECert, rut: ecertNext.rut });
                    await updateOne({ _id: procedure._id }, { $set: { [`ecert.${ecertInd + 1}`]: ecertData } });
                }
            }
            await updateOne(
                { "ecert.DocumentoId": DoctoId },
                {
                    $set: {
                        "ecert.$.signed": true,
                        "ecert.$.accepted": Firmado,
                        "ecert.$.reason": RazonRechazo,
                        "ecert.$.content": url,
                        "ecert.$.updated": new Date(),
                    },
                }
            );
            await updateEcert(temporalId, { valid: true });
            res.json({ message: "ok" });
        } catch (err) {
            next(err);
            console.log("TODO: ERROR ENRONALDO", err);
            const scope = new Sentry.Scope();
            const errorSentry = {
                reqBody: req.body,
                context: "ecert callback",
            };
            Sentry.captureException(errorSentry, scope);
        }
    });

    app.use((err, req, res, next) => {
        console.error(err);
        let message = err;
        if (err.response) message = err.response.data;
        res.status(500).json({ message });
    });
};
