const moment = require("moment");
const AWS = require("aws-sdk");

AWS.config.update({
    accessKeyId: process.env.S3_KEY,
    secretAccessKey: process.env.S3_SECRET,
    region: process.env.S3_REGION,
});
const s3 = new AWS.S3();

const uploadToS3 = (title, buff, format) => {
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
                console.log({ data });
                const urlFile = data.Location;
                resolve(urlFile);
            }
        );
    });
};

module.exports = (fileTemp, procedureId, j) => {
    return new Promise(async (resolve, reject) => {
        let mimeType = fileTemp.match(/[^:]\w+\/[\w-+\d.]+(?=;|,)/)[0];
        let title = `${procedureId}_${j}_${moment().unix()}`;
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
        const format = fileTemp.substring(fileTemp.indexOf("data:") + 5, fileTemp.indexOf(";base64"));
        const base64String = fileTemp.split(";");
        const baseFinal = base64String[base64String.length - 1].replace("base64,", "");
        const buff = Buffer.from(baseFinal, "base64");
        const urlFile = await uploadToS3(title, buff, format);
        resolve(urlFile);
    });
};
