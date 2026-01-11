const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const formSchema = new Schema({
    _title: {
        type: String,
        required: false,
        trim: true,
        unique: true,
    },
    _stringJson: {
        type: String,
    },
    _properties: {
        type: String,
    },
    _stringUiJson: {
        type: String,
    },
});

const formModel = mongoose.model("forms", formSchema);

module.exports = {
    findOne: (id) => {
        return new Promise((resolve, reject) => {
            formModel.findById(id, (err, data) => {
                if (err) return reject(err);
                if (!data) return reject("No existe el documento");
                if (!data._doc) return reject("No existe el documento");
                resolve({
                    ...data._doc,
                });
            });
        });
    },
};
