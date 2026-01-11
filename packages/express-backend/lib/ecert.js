const axios = require("axios");
const Sentry = require("@sentry/node");
const { ECERT_DOMAIN, ECERT_USER, ECERT_PWD, ECERT_RUT, REACT_URL, ECERT_JUST_DOMAIN } = process.env;

const ecertLogin = () => {
    return new Promise(async (resolve, reject) => {
        try {
            const {
                data: {
                    ObjetoGenerico: { Token },
                },
            } = await axios.post(`https://${ECERT_DOMAIN}/Login/Authenticate`, {
                UserName: ECERT_USER,
                Password: ECERT_PWD,
            });
            resolve(Token);
        } catch (err) {
            const scope = new Sentry.Scope();
            const errorSentry = {
                UserName: ECERT_USER,
                Password: ECERT_PWD,
                context: "ecertLogin method",
            };
            Sentry.captureException(errorSentry, scope);
            reject(err.response.data);
        }
    });
};

const ecertPreinscribeOne = ({ token, rut, nombre, appat, apmat, email, signatureType }) => {
    return new Promise(async (resolve, reject) => {
        try {
            const { data } = await axios.post(
                `https://${ECERT_DOMAIN}/integracion/Preinscripcion`,
                {
                    RutUsuario: rut,
                    Nombre: nombre,
                    ApellidoPaterno: appat,
                    ApellidoMaterno: apmat,
                    Email: email,
                    RutEmpresa: ECERT_RUT,
                    CantidadDoctos: 1,
                    UrlCallback: `https://${ECERT_JUST_DOMAIN}/TempUser/Index`,
                    UrlWebHook: `${REACT_URL}/api/ecert/callback`,
                    TipoFirma: signatureType,
                },
                {
                    headers: {
                        Authorization: token,
                    },
                }
            );
            resolve(data);
        } catch (err) {
            const scope = new Sentry.Scope();
            const errorSentry = {
                err,
                rut,
                signatureType,
                email,
                context: "ecertPreinscribeOne method",
            };
            Sentry.captureException(errorSentry, scope);
            reject(err.response);
        }
    });
};

const ecertUpload = ({ token, rut, idcert, docContent, docTitle, index = 0, page = 1 }) => {
    return new Promise(async (resolve, reject) => {
        try {
            let pos_x = 10 + (index + 1) * 120;
            let pos_y = 10;
            if (index > 3) {
                pos_x = 10 + (index - 4 + 1) * 120;
                pos_y = 10 + 90 * 1;
            }
            if (index > 7) {
                pos_x = 10 + (index - 8 + 1) * 120;
                pos_y = 10 + 90 * 2;
            }
            const { data } = await axios.post(
                `https://${ECERT_DOMAIN}/integracion/SubirDocumento`,
                {
                    RutUsuario: rut,
                    IdUsuarioECert: idcert,
                    NombreDocumento: docTitle !== "" ? docTitle : "Documento de firma",
                    DocumentoBase64: docContent,
                    RequiereCustodia: false,
                    PosicionFirmaX: pos_x,
                    PosicionFirmaY: pos_y,
                    PosicionFirmaPagina: page,
                },
                {
                    headers: {
                        Authorization: token,
                    },
                }
            );
            resolve(data);
        } catch (err) {
            const scope = new Sentry.Scope();
            const errorSentry = {
                err,
                rut,
                IdUsuarioECert: idcert,
                context: "ecertUpload method",
            };
            Sentry.captureException(errorSentry, scope);
            if (err.response) return reject(err.response.data);
            reject(err);
        }
    });
};

const ecertEmail = ({ token, idcert, rut }) => {
    return new Promise(async (resolve, reject) => {
        try {
            const { data } = await axios.post(
                `https://${ECERT_DOMAIN}/integracion/NotificarUsuario`,
                {
                    RutUsuario: rut,
                    IdUsuarioECert: idcert,
                },
                {
                    headers: {
                        Authorization: token,
                    },
                }
            );
            resolve(data);
        } catch (err) {
            const scope = new Sentry.Scope();
            const errorSentry = {
                RutUsuario: rut,
                IdUsuarioECert: idcert,
                error: err.response,
                context: "ecertEmail method",
            };
            Sentry.captureException(errorSentry, scope);
            reject(err.response);
        }
    });
};

const ecertEnroladoPreinscribe = ({ token, rut, signatureType }) => {
    return new Promise(async (resolve, reject) => {
        try {
            const newType = signatureType == 3 ? 1 : 2;
            const { data } = await axios.post(
                `https://${ECERT_DOMAIN}/Enrolado/Preinscripcion`,
                {
                    RutUsuario: rut,
                    RutEmpresa: ECERT_RUT,
                    CantidadDoctos: 1,
                    UrlWebHook: `${REACT_URL}/api/ecert/callback`,
                    TipoFirma: newType,
                },
                {
                    headers: {
                        Authorization: token,
                    },
                }
            );
            resolve(data);
        } catch (err) {
            const scope = new Sentry.Scope();
            const errorSentry = {
                RutUsuario: rut,
                err,
                context: "ecertEmail method",
            };
            Sentry.captureException(errorSentry, scope);
            if (err.response) return reject(err.response.data);
            reject(err);
        }
    });
};

const ecertEnroladoUpload = ({ token, rut, idcert, docContent, docTitle, index = 0, page = 1 }) => {
    return new Promise(async (resolve, reject) => {
        try {
            let pos_x = 10 + (index + 1) * 120;
            let pos_y = 10;
            if (index > 3) {
                pos_x = 10 + (index - 4 + 1) * 120;
                pos_y = 10 + 90 * 1;
            }
            if (index > 7) {
                pos_x = 10 + (index - 8 + 1) * 120;
                pos_y = 10 + 90 * 2;
            }
            const { data } = await axios.post(
                `https://${ECERT_DOMAIN}/Enrolado/SubirDocumento`,
                {
                    RutUsuario: rut,
                    IdPrenscripcion: idcert,
                    NombreDocumento: docTitle,
                    DocumentoBase64: docContent,
                    RequiereCustodia: false,
                    PosicionFirmaX: pos_x,
                    PosicionFirmaY: pos_y,
                    PosicionFirmaPagina: page,
                },
                {
                    headers: {
                        Authorization: token,
                    },
                }
            );
            resolve(data);
        } catch (err) {
            const scope = new Sentry.Scope();
            const errorSentry = {
                RutUsuario: rut,
                IdPrenscripcion: idcert,
                NombreDocumento: docTitle,
                err,
                context: "ecertEnroladoUpload method",
            };
            Sentry.captureException(errorSentry, scope);

            if (err.response) return reject(err.response.data);
            reject(err);
        }
    });
};

const ecertEnroladoEmail = ({ token, idcert, rut }) => {
    return new Promise(async (resolve, reject) => {
        try {
            const { data } = await axios.post(
                `https://${ECERT_DOMAIN}/Enrolado/NotificarUsuario`,
                {
                    RutUsuario: rut,
                    IdPreinscripcion: idcert,
                },
                {
                    headers: {
                        Authorization: token,
                    },
                }
            );
            resolve(data);
        } catch (err) {
            const scope = new Sentry.Scope();
            const errorSentry = {
                RutUsuario: rut,
                IdPreinscripcion: idcert,
                err,
                context: "ecertEnroladoEmail method",
            };
            Sentry.captureException(errorSentry, scope);

            if (err.response) return reject(err.response.data);
            reject(err.response);
        }
    });
};

const ecertCaducar = ({ token, idcert, rut }) => {
    return new Promise(async (resolve, reject) => {
        try {
            const { data } = await axios.post(
                `https://${ECERT_DOMAIN}/integracion/CaducarPreinscripcion`,
                {
                    RutUsuario: rut,
                    RutEmpresa: ECERT_RUT,
                    IdUsuarioECert: idcert,
                },
                {
                    headers: {
                        Authorization: token,
                    },
                }
            );
            resolve(data);
        } catch (err) {
            const scope = new Sentry.Scope();
            const errorSentry = {
                RutUsuario: rut,
                IdPreinscripcion: idcert,
                err,
                context: "ecertCaducar method",
            };
            Sentry.captureException(errorSentry, scope);

            if (err.response) return reject(err.response.data);
            reject(err.response);
        }
    });
};

module.exports = {
    ecertLogin,
    ecertPreinscribeOne,
    ecertUpload,
    ecertEmail,
    ecertEnroladoPreinscribe,
    ecertEnroladoUpload,
    ecertEnroladoEmail,
    ecertCaducar,
};
