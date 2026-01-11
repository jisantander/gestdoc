const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const mailSchema = new Schema({
    _title: {
        type: String,
        required: false,
    },
    _body: {
        type: String,
    },
    _subject: {
        type: String,
    },
    _recipient: [
        {
            type: String,
        },
    ],
});

const mailModel = mongoose.model("emails", mailSchema);

module.exports = {
    findOne: (id) => {
        return new Promise((resolve, reject) => {
            mailModel.findById(id, (err, data) => {
                if (err) return reject(err);
                resolve({
                    ...data._doc,
                });
            });
        });
    },
};
