const AWS = require("aws-sdk");

const { S3_KEY, S3_SECRET, S3_REGION, S3_BUCKET } = process.env;

AWS.config.update({
    accessKeyId: S3_KEY,
    secretAccessKey: S3_SECRET,
    region: S3_REGION,
});
const s3 = new AWS.S3();

const downloadS3 = (filePath) => {
    return new Promise((resolve, reject) => {
        s3.getObject(
            {
                Bucket: S3_BUCKET,
                Key: filePath,
            },
            async (err, file) => {
                if (err) {
					console.error(err);
                    reject({ message: "Archivo no encontrado en S3", filePath });
                }
                /*const data = file.Body.toString("base64");
                resolve(data);*/
                resolve(file.Body);
            }
        );
    });
};

module.exports = (filePath) => {
    return new Promise(async (resolve, reject) => {
        try {
            const urlFile = await downloadS3(filePath);
            resolve(urlFile);
        } catch (err) {
            reject(err);
        }
    });
};
