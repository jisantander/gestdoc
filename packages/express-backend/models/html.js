const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const htmlSchema = new Schema({
    _title: {
        type: String,
        required: false,
    },
    _body: {
        type: String,
    },
});

const htmlModel = mongoose.model("htmls", htmlSchema);

module.exports = {
    findOne: (id) => {
        return new Promise((resolve, reject) => {
            htmlModel.findById(id, (err, data) => {
                if (err) return reject(err);
                if (data === null) return resolve(false);
                if (data === undefined) return resolve(false);
                if (!data) return resolve(false);
                if (!data._doc) return resolve(false);
                resolve({
                    ...data._doc,
                });
            });
        });
    },
};
