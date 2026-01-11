const AWS = require("aws-sdk");
const { PDFDocument, StandardFonts } = require("pdf-lib");

const procedureModel = require("../models/procedures");

module.exports = (transaction, docId) => {
    return new Promise(async (resolve, reject) => {
        try {
            const { short } = await procedureModel.getDocumento(transaction, false);
            /* Configuramos AWS para S3 */
            AWS.config.update({
                accessKeyId: process.env.S3_KEY,
                secretAccessKey: process.env.S3_SECRET,
                region: process.env.S3_REGION,
            });

            /* Obtenemos la plantilla desde S3 */
            const s3 = new AWS.S3();

            s3.getObject(
                {
                    Bucket: process.env.S3_BUCKET,
                    Key: `${transaction}-${docId}.pdf`,
                },
                async (err, file) => {
                    if (err) {
                        reject({ message: "Archivo no encontrado en S3" });
                    }
                    try {
                        console.log("file", file);

                        resolve(file.Body);
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
