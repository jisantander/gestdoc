const mongoose = require("mongoose");
const Schema = mongoose.Schema;
var ObjectId = require("mongoose").Types.ObjectId;

const bpmnSchema = new Schema({
    _nameSchema: {
        type: String,
        required: false,
    },
    _description: {
        type: String,
    },
    _link: {
        type: String,
    },
    _category: {
        type: String,
    },
    _bpmnModeler: {
        type: String,
    },
    _requirements: {
        type: Array,
    },
	quick: {
		type: Schema.ObjectId,
		ref: 'url'
	},
});

const bpmnModel = mongoose.model("bpmn", bpmnSchema, "bpmn");

module.exports = {
    getAll: () => {
        return new Promise((resolve, reject) => {
            bpmnModel.find(
                { company: new ObjectId("6244804951372e00125f2b2f") },
                "_nameSchema _description _valor _requirements _link _category",
                (err, data) => {
                    if (err) return reject(err);
                    const newData = data.map((it) => {
                        return {
                            ...it._doc,
                        };
                    });
                    resolve(newData);
                }
            );
        });
    },
    findOne: (id) => {
        return new Promise((resolve, reject) => {
            bpmnModel.findById(id, (err, data) => {
                if (err) return reject(err);
                resolve({
                    ...data._doc,
                    id: data._doc._id,
                });
            });
        });
    },
};
