const mongoose = require("mongoose");
const Schema = mongoose.Schema;
var ObjectId = require("mongoose").Types.ObjectId;
const pixelSchema = new Schema(
    {
        activity: {
            type: String,
            required: true,
        },
        procedure: {
            type: mongoose.ObjectId,
            ref: "procedures",
            required: true,
        },
        open: {
            type: Boolean,
            default: false,
        },
        finalized: {
            type: Boolean,
            default: false,
        },
        email: {
            type: String,
            required: true,
        },
        data: {
            type: Schema.Types.Mixed,
        },
        lecture: {
            type: Schema.Types.Mixed,
        },
    },
    { timestamps: true }
);

const pixelModel = mongoose.model("pixels", pixelSchema);

module.exports = {
    findPixel: (id) => {
        return new Promise((resolve, reject) => {
            pixelModel.findById(id, (err, data) => {
                if (err) return reject(err);
                resolve({
                    ...data._doc,
                });
            });
        });
    },
    findPixelByProcedure: (id) => {
        var parseId = new ObjectId(id);
        var query = { procedure: parseId };
        return new Promise((resolve, reject) => {
            pixelModel
                .find(query)
                .then((result) => {
                    resolve(result);
                })
                .catch((err) => {
                    console.error(err);
                    reject(err);
                });
        });
    },
    createPixel: (data) => {
        return new Promise((resolve, reject) => {
            const pixel = new pixelModel(data);
            pixel
                .save()
                .then(async (result) => {
                    resolve(result._doc._id);
                })
                .catch((err) => reject(err));
        });
    },
    updatePixel: (id, data) => {
        return new Promise((resolve, reject) => {
            pixelModel
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
    removePixel: (transaction, old, info) => {
        return new Promise((resolve, reject) => {
            var parseId = new ObjectId(transaction);
            var query = { procedure: parseId, finalized: false, email: old };
            pixelModel
                .findOne(query)
                .then((result) => {
                    pixelModel.deleteOne(query, (err, resultDel) => {
                        if (err) return reject(err);
                        resolve(result);
                    });
                })
                .catch((err) => {
                    console.error(err);
                    reject(err);
                });
        });
    },
};
