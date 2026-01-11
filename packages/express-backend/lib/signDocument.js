const AWS = require("aws-sdk");
const { PDFDocument, StandardFonts } = require("pdf-lib");
const QRCode = require("qrcode");

const procedureModel = require("../models/procedures");

const { S3_KEY, S3_SECRET, S3_REGION, S3_BUCKET, REACT_URL } = process.env;

module.exports = (transaction, docId) => {
    return new Promise(async (resolve, reject) => {
        try {
            const { short } = await procedureModel.getDocumento(transaction, false);
            /* Configuramos AWS para S3 */
            AWS.config.update({
                accessKeyId: S3_KEY,
                secretAccessKey: S3_SECRET,
                region: S3_REGION,
            });

            /* Obtenemos la plantilla desde S3 */
            const s3 = new AWS.S3();

            s3.getObject(
                {
                    Bucket: S3_BUCKET,
                    Key: `${transaction}-${docId}.pdf`,
                },
                async (err, file) => {
                    if (err) {
                        reject({ message: "Archivo no encontrado en S3" });
                    }
                    try {
                        const existingPdfBytes = file.Body;

                        /* Abrimos el archivo PDf */
                        const pdfDoc = await PDFDocument.load(existingPdfBytes);

                        /* Obtenemos la primera pagina */
                        const pages = pdfDoc.getPages();
                        //const firstPage = pages[0];
                        const lastPage = pages[pages.length - 1];

                        await pdfDoc.embedFont(StandardFonts.TimesRoman);
                        //const ticketId = `${REACT_URL}/signaturedoc/${transaction}-${docId}`; //Asi estba antes el QR pero no funcionaba bien.. REVISAR TODO:
                        let ticketId = `${REACT_URL}/procedure/${transaction}`;
                        if (short) {
                            if (short !== "") {
                                ticketId = `${REACT_URL}/p/${short}`;
                            }
                        }

                        QRCode.toString(ticketId, {
                            type: "svg",
                            //version: 9,
                            //errorCorrectionLevel: "H",
                        }).then(async (out) => {
                            // Draw the SVG path at 50% of its original size

                            const svgresolve = out.split('stroke="#000000" d="');

                            const svgresolve2 = svgresolve[1].split('"/></');
                            lastPage.drawText("Firma Simple Gestdoc Express", {
                                x: 20,
                                y: 20,
                                size: 10,
                            });

                            lastPage.moveTo(10, lastPage.getHeight() - 5);
                            lastPage.moveDown(650);
                            lastPage.drawSvgPath(svgresolve2[0], {
                                scale: 2.5,
                            });
                            const pdfBytes = await pdfDoc.save();
                            const pdfBuffer = Buffer.from(pdfBytes.buffer, "binary");

                            resolve(pdfBuffer);
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
