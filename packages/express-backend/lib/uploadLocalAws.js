const fs = require("fs");
const AWS = require("aws-sdk");

const { S3_KEY, S3_SECRET, S3_REGION, S3_BUCKET } = process.env;

AWS.config.update({
    accessKeyId: S3_KEY,
    secretAccessKey: S3_SECRET,
    region: S3_REGION,
});
const s3 = new AWS.S3();

const uploadToS3 = (title, buff, fileType) => {
    return new Promise((resolve, reject) => {
        s3.upload(
            {
                Bucket: S3_BUCKET,
                Key: title,
                ACL: "public-read",
                ContentEncoding: "base64",
                Body: buff,
                ContentType: fileType,
            },
            async (error, data) => {
                if (error) {
                    reject(error);
                }
                resolve(data);
            }
        );
    });
};

module.exports = (imagePath, title, fileType = "application/pdf") => {
    return new Promise(async (resolve, reject) => {
        try {
            const blob = fs.readFileSync(imagePath);
            const urlFile = await uploadToS3(title, blob, fileType);
            resolve(urlFile);
        } catch (err) {
            reject(err);
        }
    });
};
