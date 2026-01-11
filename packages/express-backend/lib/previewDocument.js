const fs = require("fs");
const path = require("path");
const { exec } = require("child_process");
const AWS = require("aws-sdk");
const PizZip = require("pizzip");
const Docxtemplater = require("docxtemplater");
var expressions = require("angular-expressions");
var assign = require("lodash/assign");
const writtenNumber = require("written-number");
const moment = require("moment");

const modelProcedure = require("../models/procedures");
const modelDocs = require("../models/docs");

expressions.filters.lower = function (input) {
    // This condition should be used to make sure that if your input is
    // undefined, your output will be undefined as well and will not
    // throw an error
    if (!input) return input;
    return input.toLowerCase();
};
function angularParser(tag) {
    if (tag === ".") {
        return {
            get: function (s) {
                return s;
            },
        };
    }
    if (tag.substring(0, 3) === "nl ") {
        return {
            get: function (scope) {
                return writtenNumber(scope[tag.substring(3)].split(".").join(""), { lang: "es" });
            },
        };
    }
    if (tag.substring(0, 5) === "nclp ") {
        return {
            get: function (scope) {
                return new Intl.NumberFormat("es-CL").format(scope[tag.substring(5)].split(".").join(""));
            },
        };
    }
    if (tag.substring(0, 3) === "nm ") {
        return {
            get: function (scope) {
                return new Intl.NumberFormat("es-CL").format(scope[tag.substring(3)]);
            },
        };
    }
    const expr = expressions.compile(tag.replace(/(’|‘)/g, "'").replace(/(“|”)/g, '"'));
    return {
        get: function (scope, context) {
            let obj = {};
            const scopeList = context.scopeList;
            const num = context.num;
            for (let i = 0, len = num + 1; i < len; i++) {
                obj = assign(obj, scopeList[i]);
            }
            if (typeof scope[tag] === "string")
                if (scope[tag].match(/^\d{4}\-(0[1-9]|1[012])\-(0[1-9]|[12][0-9]|3[01])$/)) {
                    var fecha = moment(scope[tag]).toDate();
                    return fecha.toLocaleDateString("es-ES", { year: "numeric", month: "long", day: "numeric" });
                }
            return expr(scope, obj);
        },
    };
}
// The error object contains additional information when logged with JSON.stringify (it contains a properties object containing all suberrors).
const replaceErrors = (key, value) => {
    if (value instanceof Error) {
        return Object.getOwnPropertyNames(value).reduce(function (error, key) {
            error[key] = value[key];
            return error;
        }, {});
    }
    return value;
};

const errorHandler = (error) => {
    console.log(JSON.stringify({ error: error }, replaceErrors));

    if (error.properties && error.properties.errors instanceof Array) {
        const errorMessages = error.properties.errors
            .map(function (error) {
                return error.properties.explanation;
            })
            .join("\n");
        console.log("errorMessages", errorMessages);
        // errorMessages is a humanly readable message looking like this :
        // 'The tag beginning with "foobar" is unopened'
    }
    throw error;
};

module.exports = (transactionId, docId) => {
    return new Promise(async (resolve, reject) => {
        try {
            /* Configuramos AWS para S3 */
            AWS.config.update({
                accessKeyId: process.env.S3_KEY,
                secretAccessKey: process.env.S3_SECRET,
                region: process.env.S3_REGION,
            });

            /* Obtenemos el procedimiento correspondiente con los valores del forms */
            const procedure = await modelProcedure.getDocumento(transactionId, false);
            /* Obtenemos el nombre del documento de la plantilla para irla a buscar a S3 */
            const docTemplate = await modelDocs.findOne(docId);
            const nameDocx = docTemplate._key;

            /* Obtenemos la plantilla docx desde S3 */
            const s3 = new AWS.S3();
            s3.getObject(
                {
                    Bucket: process.env.S3_BUCKET,
                    Key: nameDocx,
                },
                async (err, file) => {
                    if (err) {
                        reject({ message: "Archivo no encontrado en S3" });
                    }
                    try {
                        const templateFile = file.Body;
                        let resultForms = {};
                        //obtengo los valores del resulado de los formularios
                        procedure.gestores.forEach((element) => {
                            resultForms = { ...resultForms, ...element.form };
                        });

                        // se inicia el proceso de renderear un docx con los resultados.
                        const zip = new PizZip(templateFile);
                        let doc2;
                        try {
                            doc2 = new Docxtemplater(zip, { parser: angularParser });
                        } catch (error) {
                            errorHandler(error);
                            reject(error);
                        }

                        doc2.setData(resultForms);

                        try {
                            doc2.render();
                        } catch (error) {
                            errorHandler(error);
                            reject(error);
                        }
                        //obtengo un buffer del documento con los resultados de los forms
                        const buf = await doc2.getZip().generate({ type: "nodebuffer" });

                        //obtengo un nombre de variable que será el id del proceso y el nombre que tenia el doc en s3
                        const namePdf = `${transactionId}-${nameDocx.replace(".docx", ".pdf")}`;
                        //obtengo una ruta donde dejare mi docx con los resultados (para que ya no sea un buffer)
                        const pathDocxTemp = path.join(__dirname, "../temp", `${transactionId}-${nameDocx}`);
                        //obtengo una ruta donde dejare mi PDF que le retornaré el usuario
                        const pathPdfTemp = path.join(__dirname, "../temp", `${namePdf}`);
                        //aquí hago realidad el buffer del docx con los resultados en un archivo docx temporal que despues paso a pdf
                        fs.writeFile(pathDocxTemp, buf, async (err, data) => {
                            if (err) reject(err);

                            /* Convertimos el documento DOCX a PDF */
                            exec(`unoconv -f pdf ${pathDocxTemp}`, (error, stdout, stderr) => {
                                if (error) {
                                    reject(error);
                                }
                                /* Obtenemos el buffed del PDF */
                                const filePdf = fs.createReadStream(pathPdfTemp);
                                console.log(process.env.S3_BUCKET, namePdf);
                                //subo el PDF a S3 (este paso no debería ser siempre... por ejemplo en vista preview no deberia ser )
                                s3.upload(
                                    {
                                        Bucket: process.env.S3_BUCKET,
                                        Key: namePdf,
                                        Body: filePdf,
                                    },
                                    async (error, data) => {
                                        if (error) {
                                            reject(error);
                                        }
                                        console.log(data);
                                        /* Obtenemos metadata y buffer de pdf temporal */
                                        const file = fs.createReadStream(pathPdfTemp);
                                        const stat = fs.statSync(pathPdfTemp);
                                        /* Eliminamos los archivos temporales */
                                        setTimeout(() => {
                                            exec(`rm ${pathDocxTemp} ${pathPdfTemp}`);
                                        }, 10000);
                                        resolve({
                                            stat,
                                            file,
                                            name: namePdf,
                                        });
                                    }
                                );
                            });
                        });
                    } catch (e) {
                        reject(e);
                    }
                }
            );
        } catch (e) {
            reject(e);
        }
    });
};
