const fs = require("fs");

const mailgun = require("mailgun-js")({
    apiKey: process.env.MAILGUN_KEY,
    domain: process.env.MAILGUN_DOMAIN,
});

const bpmnSpecific = require("./bpmnSpecific");

const { createPixel } = require("../models/pixel");

const MAIL_CHARSET = "UTF-8";
let templateVerification = "";
fs.readFile("templates/verification.html", "utf8", function (err, html) {
    templateVerification = html;
});
let templateForgot_pass = "";
fs.readFile("templates/forgot.html", "utf8", function (err, html) {
    templateForgot_pass = html;
});
let templateSignup = "";
fs.readFile("templates/signup.html", "utf8", function (err, html) {
    templateSignup = html;
});
let templateProcedure = "";
fs.readFile("templates/procedure.html", "utf8", function (err, html) {
    templateProcedure = html;
});
let templateSignature = "";
fs.readFile("templates/signature.html", "utf8", function (err, html) {
    templateSignature = html;
});
let templateAskReview = "";
fs.readFile("templates/ask_review.html", "utf8", function (err, html) {
    templateAskReview = html;
});
let templateHasReviewed = "";
fs.readFile("templates/has_reviewed.html", "utf8", function (err, html) {
    templateHasReviewed = html;
});
let templateNotification = "";
fs.readFile("templates/notification.html", "utf8", function (err, html) {
    templateNotification = html;
});
let templateEcertAlert = "";
fs.readFile("templates/ecert_alert.html", "utf8", function (err, html) {
    templateEcertAlert = html;
});
let templateSimpleSignatureAlert = "";
fs.readFile("templates/simple_signature_alert.html", "utf8", function (err, html) {
    templateSimpleSignatureAlert = html;
});

const setParams = (emails, subject, body) => {
    return {
        from: `Gestdoc Express <contacto@gestdoc.cl>`,
        to: emails,
        subject: subject,
        text: subject,
        html: body,
    };
};

module.exports = {
    signup: (data) => {
        console.log({ data });
        return new Promise(async (resolve, reject) => {
            const subjectMail = `Tienes un documento esperando en GestDoc!`;

            let _body = templateSignup + "";
            _body = _body.split("{email_usuario_sesion}").join(data.email);
            //_body = _body.split("{url_signup}").join(`${process.env.REACT_URL}/signup?bpmn=${data._id}`);
            //     _body = _body.split("{pwd_temp}").join(data.pwd);
            _body = _body.split("{url_procedure}").join(`${process.env.REACT_URL}/procedure/${data._id}`);

            /* Finalmente, enviamos el correo */
            const params = setParams([data.email], subjectMail, _body);

            mailgun.messages().send(params, (err, data) => {
                if (err) return reject(err);
                console.log(data); // successful response
                resolve(data);
            });
        });
    },
    email_verification: (data) => {
        console.log({ data });
        return new Promise(async (resolve, reject) => {
            const subjectMail = `Confirma tu correo para registrarte en Gestdoc!`;

            let _body = templateVerification + "";
            _body = _body.split("{email_usuario_sesion}").join(data.email);
            //_body = _body.split("{url_signup}").join(`${process.env.REACT_URL}/signup?bpmn=${data._id}`);
            //     _body = _body.split("{pwd_temp}").join(data.pwd);
            _body = _body.split("{url_procedure}").join(`${process.env.REACT_URL}/verification_email/${data.hash}`);

            /* Finalmente, enviamos el correo */
            const params = setParams([data.email], subjectMail, _body);

            mailgun.messages().send(params, (err, data) => {
                if (err) return reject(err);
                console.log(data); // successful response
                resolve(data);
            });
        });
    },
    email_forgot_password: (data) => {
        console.log({ data });
        return new Promise(async (resolve, reject) => {
            const subjectMail = `Cambiar contraseña`;

            let _body = templateForgot_pass + "";
            _body = _body.split("{email_usuario_sesion}").join(data.email);
            //_body = _body.split("{url_signup}").join(`${process.env.REACT_URL}/signup?bpmn=${data._id}`);
            //     _body = _body.split("{pwd_temp}").join(data.pwd);
            _body = _body.split("{url_procedure}").join(`${process.env.REACT_URL}/forgot_email/${data.hash}`);

            /* Finalmente, enviamos el correo */
            const params = setParams([data.email], subjectMail, _body);

            mailgun.messages().send(params, (err, data) => {
                if (err) return reject(err);
                console.log(data); // successful response
                resolve(data);
            });
        });
    },
    newProcedure: (data) => {
        return new Promise(async (resolve, reject) => {
            const subjectMail = `¡Iniciamos tu nuevo trámite!`;

            let _body = templateProcedure + "";
            _body = _body.split("{email_usuario_sesion}").join(data.email);
            _body = _body.split("{url_procedure}").join(`${process.env.REACT_URL}/procedure/${data._id}`);

            /* Finalmente, enviamos el correo */
            const params = setParams([data.email], subjectMail, _body);

            mailgun.messages().send(params, (err, data) => {
                if (err) return reject(err);
                console.log(data); // successful response
                resolve(data);
            });
        });
    },
    template: (transaction, current, documentoMail) => {
        return new Promise(async (resolve, reject) => {
            try {
                /* Obtenemos el procedimiento correspondiente */
                //const procedure = await getDocumento(transaction, false);
                const procedure = documentoMail;
                /* Obtenemos la data de email del bpmn */
                let { _body, _subject, _recipient } = await bpmnSpecific(procedure.bpmn, "mail", current);
                /* Modificamos campos en el subject y en el body del correo */
                _recipient = _recipient.map((it) => {
                    let emailReci = it;
                    if (emailReci === "{email_usuario_sesion}") emailReci = procedure.email;
                    return emailReci;
                });
                _subject = _subject.split("{nombre_usuario_sesion}").join(procedure.email);
                _body = _body.split("{nombre_usuario_sesion}").join(procedure.email);
                /* Creamos el string de participantes a mostrar */
                const strParticipantes = `<ul>
					${procedure.gestores.map((gestor) => {
						const urlGestor = `${process.env.REACT_URL}/procedure/${transaction}/${gestor.id}`;
						return `<li>${gestor.name}: <a href='${urlGestor}'>${urlGestor}</a></li>`;
					})}
				</ul>`;
                _body = _body.split("{participantes}").join(strParticipantes);

				procedure.gestores.forEach((gestor) => {
					for(var i in gestor.form){
						if(gestor.form[i]){
							_body = _body.split(`{${i}}`).join(gestor.form[i]);
							_subject = _subject.split(`{${i}}`).join(gestor.form[i]);
						}
					}
				});

                /* Finalmente, enviamos el correo */
                const params = setParams(_recipient, _subject, _body);

                mailgun.messages().send(params, (err, data) => {
                    if (err) return reject(err);
                    console.log(data); // successful response
                    resolve(data);
                });
            } catch (e) {
                reject(e);
            }
        });
    },
    /**
     * Email con pixel tracking para firma
     * @param procedure
     * @param email
     * @param activity
     */
    pixel: ({ procedure, email, activity }) => {
        return new Promise(async (resolve, reject) => {
            const pixelId = await createPixel({
                procedure,
                activity,
                email,
            });
            const subjectMail = `Necesitamos tu firma digital :)`;

            let _body = templateSignature + "";
            _body = _body.split("{email_usuario_sesion}").join(email);
            _body = _body.split("{url_procedure}").join(`${process.env.REACT_URL}/procedure/${procedure}?p=${pixelId}`);
            _body = _body.split("{url_pixel}").join(`${process.env.REACT_URL}/api/pixel/${pixelId}`);

            /* Finalmente, enviamos el correo */
            const params = setParams([email], subjectMail, _body);
            mailgun.messages().send(params, (err, data) => {
                if (err) return reject(err);
                console.log(data); // successful response
                resolve(data);
            });
        });
    },
    askReview: ({ procedure, emails }) => {
        return new Promise(async (resolve, reject) => {
            const subjectMail = "!Un documento legal necesita tu revisión!";
            emails.forEach((item) => {
                let _body = templateAskReview + "";
                _body = _body
                    .split("{url_procedure}")
                    .join(`${process.env.REACT_URL}/procedure/${procedure}?r=${item.uid}`);
                const params = setParams([item.email], subjectMail, _body);
                mailgun.messages().send(params);
            });
            resolve();
        });
    },
    hasReviewed: ({ procedure, email, reviewer }) => {
        return new Promise(async (resolve, reject) => {
            const subjectMail = "!Tu documento legal ha sido revisado!";
            let _body = templateHasReviewed + "";
            _body = _body.split("{email_reviewer}").join(reviewer);
            _body = _body.split("{url_procedure}").join(`${process.env.REACT_URL}/procedure/${procedure}`);
            const params = setParams([email], subjectMail, _body);
            mailgun.messages().send(params, (err, data) => {
                if (err) return reject(err);
                console.log(data);
                resolve(data);
            });
        });
    },
    notifyNextStage: (emails, data) => {
        return new Promise(async (resolve, reject) => {
            const subjectMail = `Un trámite ha cambiado de etapa`;
            let _body = templateNotification + "";
            _body = _body.split("{url_procedure}").join(`${process.env.REACT_URL}/procedure/${data.procedure}`);
            _body = _body.split("{nombre_procedimiento}").join(data.bpmn);
            _body = _body.split("{nombre_etapa}").join(data.etapa);
            _body = _body.split("{email_owner}").join(data.email);

            /* Finalmente, enviamos el correo */
            const params = setParams(emails, subjectMail, _body);

            mailgun.messages().send(params, (err, data) => {
                if (err) return reject(err);
                console.log(data); // successful response
                resolve(data);
            });
        });
    },
    sendEcertAlert: (emails, procedureId) => {
        return new Promise(async (resolve, reject) => {
            const subjectMail = `El documento que firmaste ya tiene todas las firmas`;
            let _body = templateEcertAlert + "";
            _body = _body.split("{url_procedure}").join(`${process.env.REACT_URL}/procedure/${procedureId}`);

            /* Finalmente, enviamos el correo */
            const params = setParams(emails, subjectMail, _body);

            mailgun.messages().send(params, (err, data) => {
                if (err) return reject(err);
                console.log(data); // successful response
                resolve(data);
            });
        });
    },
    sendSimpleSignatureAlert: (emails, procedureId) => {
        return new Promise(async (resolve, reject) => {
            const subjectMail = `El documento que firmaste ya tiene todas las firmas`;
            let _body = templateSimpleSignatureAlert + "";
            _body = _body.split("{url_procedure}").join(`${process.env.REACT_URL}/procedure/${procedureId}`);

            /* Finalmente, enviamos el correo */
            const params = setParams(emails, subjectMail, _body);

            mailgun.messages().send(params, (err, data) => {
                if (err) return reject(err);
                console.log(data); // successful response
                resolve(data);
            });
        });
    },
};
