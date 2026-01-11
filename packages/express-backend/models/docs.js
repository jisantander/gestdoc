const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const themeSchema = new Schema({
    _title: {
        type: String,
        required: false,
    },
    _key: {
        type: String,
    },
    _location: {
        type: String,
    },
});

const themeModel = mongoose.model("themedoc", themeSchema, "themedoc");

module.exports = {
    findOne: (id) => {
        return new Promise((resolve, reject) => {
            themeModel.findById(id, (err, data) => {
                if (err) return reject(err);
                resolve({
                    ...data._doc,
                });
            });
        });
    },
    findAll: (filter, fields = "_id _title") => {
        return new Promise(async (resolve, reject) => {
            themeModel
                .find(filter)
                .select(fields)
                .then((result) => resolve(result))
                .catch((err) => {
                    console.error(err);
                    reject(err);
                });
        });
    },
};
