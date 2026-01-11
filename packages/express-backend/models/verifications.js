const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const verificationsSchema = new Schema({
    _idUser: {
        type: String,
    },
    _hash: {
        type: String,
    },
});

const verificationsModel = mongoose.model("verifications", verificationsSchema, "verifications");

module.exports = {
    findOne: (queryData) => {
        return new Promise((resolve, reject) => {
            verificationsModel
                .find(queryData)
                .then((result) => {
                    console.log(result);
                    if (result.length > 0) {
                        resolve({ email: result[0]._idUser });
                    } else {
                        resolve({ response: "hash vencido, intentar registrar otra vez" });
                    }
                })
                .catch((err) => {
                    console.error(err);
                    reject(err);
                });
        });
    },
    createHashVerification: (data) => {
        return new Promise((resolve, reject) => {
            const hash = new verificationsModel(data);
            hash.save()
                .then(async (result) => {
                    resolve(result);
                })
                .catch((err) => reject(err));
        });
    },
    deleteHash: (hash) => {
        return new Promise((resolve, reject) => {
            verificationsModel
                .deleteOne({ _hash: hash })
                .then(function () {
                    console.log("Data deleted"); // Success
                    resolve({ message: "Data deleted" });
                })
                .catch(function (error) {
                    s;
                    console.log(error); // Failure
                    reject(error);
                });
        });
    },
};
