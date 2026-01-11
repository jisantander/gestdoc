const mongoose = require("mongoose");
const Schema = mongoose.Schema;
var ObjectId = require("mongoose").Types.ObjectId;
const notificationSchema = new Schema(
    {
        procedure: {
            type: mongoose.ObjectId,
            ref: "procedures",
            required: true,
        },
        delivered: {
            type: Boolean,
            default: false,
        },
        deliver_at: {
            type: Date,
        },
        current: {
            type: String,
            required: true,
        },
        data: {
            type: Schema.Types.Mixed,
        },
        mailgun: {
            type: Schema.Types.Mixed,
        },
        emails: [{ type: Schema.Types.Mixed }],
    },
    { timestamps: true }
);

const notificationModel = mongoose.model("notification", notificationSchema);

module.exports = {
    findPixel: (id) => {
        return new Promise((resolve, reject) => {
            notificationModel.findById(id, (err, data) => {
                if (err) return reject(err);
                if (!data) return reject("No existe el documento");
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
            notificationModel
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
    findPending: () => {
        return new Promise((resolve, reject) => {
            notificationModel
                .find({ delivered: false })
                .then((result) => resolve(result))
                .catch((err) => {
                    console.error(err);
                    reject(err);
                });
        });
    },
    createNotification: (data) => {
        return new Promise((resolve, reject) => {
            const pixel = new notificationModel(data);
            pixel
                .save()
                .then(async (result) => {
                    resolve(result._doc._id);
                })
                .catch((err) => reject(err));
        });
    },
    readNotification: (id, data, emails = []) => {
        return new Promise((resolve, reject) => {
            notificationModel
                .update(
                    { _id: id },
                    { $set: { delivered: true, deliver_at: new Date(), mailgun: data, emails: emails } }
                )
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
    updateNotification: (id, data) => {
        return new Promise((resolve, reject) => {
            notificationModel
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
};
