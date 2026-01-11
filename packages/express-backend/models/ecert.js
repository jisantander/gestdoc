const mongoose = require("mongoose");
const Schema = mongoose.Schema;
var ObjectId = require("mongoose").Types.ObjectId;

const ecertSchema = new Schema(
    {
        DoctoId: {
            type: String,
        },
        Firmado: {
            type: Boolean,
        },
        RazonRechazo: {
            type: String,
        },
        DoctoBase64: {
            data: Buffer,
            contentType: String,
        },
        valid: {
            type: Boolean,
            default: false,
        },
    },
    { timestamps: true }
);

const ecertModel = mongoose.model("ecert", ecertSchema);

module.exports = {
    createEcert: (data) => {
        return new Promise((resolve, reject) => {
            const newData = { ...data };
            newData["DoctoBase64"] = new Buffer(data["DoctoBase64"], "base64");
            const ecertTemp = new ecertModel(newData);
            ecertTemp
                .save()
                .then(async (result) => {
                    resolve(result._doc._id);
                })
                .catch((err) => reject(err));
        });
    },
    updateEcert: (id, data) => {
        return new Promise((resolve, reject) => {
            ecertModel
                .update({ _id: id }, { $set: data })
                .exec()
                .then((result) => {
                    resolve(result);
                })
                .catch((err) => {
                    console.error(err);
                    reject(err);
                });
        });
    },
    removeEcert: (id) => {
        return new Promise((resolve, reject) => {
            ecertModel
                .findById(id)
                .then((result) => {
                    ecertModel.deleteOne({ _id: id }, (err, resultDel) => {
                        if (err) return reject(err);
                        resolve(resultDel);
                    });
                })
                .catch((err) => {
                    console.error(err);
                    reject(err);
                });
        });
    },
    findAll: (filter = {}) => {
        return new Promise(function (resolve, reject) {
            ecertModel.find(filter, (err, items) => {
                if (err) reject(err);
                resolve(items);
            });
        });
    },
};
