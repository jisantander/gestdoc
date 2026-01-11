const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const interfaceSchema = Schema(
    {
        title: {
            type: String,
            required: true,
            default: "",
        },
        type: {
            type: String,
            required: true,
            default: "ODOO",
            enum: ["ODOO"],
        },
        authJson: {
            type: String,
            trim: true,
            required: false,
        },
        company: { type: Schema.ObjectId, ref: "companies" },
    },
    { timestamps: true }
);

const interfaceModel = mongoose.model("interfaces", interfaceSchema, "interfaces");

module.exports = {
    findOne: (id) => {
        return new Promise((resolve, reject) => {
            interfaceModel.findById(id, (err, data) => {
                if (err) return reject(err);
                resolve({
                    ...data._doc,
                });
            });
        });
    },
    findAll: (filter) => {
        return new Promise((resolve, reject) => {
            interfaceModel.find(filter, "_id type title", (err, data) => {
                if (err) return reject(err);
                resolve(data);
            });
        });
    },
};
