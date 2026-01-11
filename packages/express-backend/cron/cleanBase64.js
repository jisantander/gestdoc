const cron = require("node-cron");
const moment = require("moment");
const AWS = require("aws-sdk");

const procedureModel = require("../models/procedures");
const asyncForEach = require("../lib/asyncForEach");

AWS.config.update({
    accessKeyId: process.env.S3_KEY,
    secretAccessKey: process.env.S3_SECRET,
    region: process.env.S3_REGION,
});
const s3 = new AWS.S3();

const uploadToS3 = (title, buff, format, procedure, gestor, i, j) => {
    return new Promise((resolve, reject) => {
        s3.upload(
            {
                Bucket: process.env.S3_BUCKET,
                Key: title,
                ACL: "public-read",
                ContentEncoding: "base64",
                Body: buff,
                ContentType: format,
            },
            async (error, data) => {
                if (error) {
                    reject(error);
                }
                const urlFile = data.Location;
                await procedureModel.updateOne(
                    { _id: procedure._id, "gestores.id": gestor.id },
                    {
                        $set: {
                            [`gestores.$.base64`]: false,
                            [`gestores.$.form.${j}`]: urlFile,
                            [`gestores.$.history.${i}.form_types.${j}`]: "",
                            [`gestores.$.history.${i}.form.${j}`]: urlFile,
                        },
                    }
                );
                resolve(true);
            }
        );
    });
};

module.exports = () => {
    cron.schedule("0 3 * * *", async () => {
        //(async () => {
        const procedures = await procedureModel.findAll({
            updatedAt: { $lte: moment().add(-2, "days") },
            "gestores.base64": true,
        });

        if (procedures.length > 0) {
            await asyncForEach(procedures, async (procedure) => {
                await asyncForEach(procedure.gestores, async (gestor) => {
                    if (gestor.base64) {
                        for (var i in gestor.history) {
                            if (gestor.history[i].form_types) {
                                for (var j in gestor.history[i].form_types) {
                                    if (gestor.history[i].form_types[j] === "data-url") {
                                        const fileTemp = gestor.history[i].form[j];
                                        let mimeType = fileTemp.match(/[^:]\w+\/[\w-+\d.]+(?=;|,)/)[0];
                                        let title = `${procedure._id}_${j}_${moment().unix()}`;
                                        switch (mimeType) {
                                            case "image/png":
                                                title += ".png";
                                                break;
                                            case "image/gif":
                                                title += ".gif";
                                                break;
                                            case "image/jpeg":
                                                title += ".jpg";
                                                break;
                                            case "image/jpg":
                                                title += ".jpg";
                                                break;
                                            case "application/pdf":
                                                title += ".pdf";
                                                break;
                                            default:
                                                title;
                                        }
                                        const format = fileTemp.substring(
                                            fileTemp.indexOf("data:") + 5,
                                            fileTemp.indexOf(";base64")
                                        );
                                        const base64String = fileTemp.split(";");
                                        const baseFinal = base64String[base64String.length - 1].replace("base64,", "");
                                        const buff = Buffer.from(baseFinal, "base64");
                                        await uploadToS3(title, buff, format, procedure, gestor, i, j);
                                    }
                                }
                            }
                        }
                    }
                });
            });
        }
        //})();
    });
};
