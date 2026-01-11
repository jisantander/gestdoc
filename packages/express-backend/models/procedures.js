const mongoose = require("mongoose");
const mongoosePaginate = require("mongoose-paginate");
const AutoIncrement = require("mongoose-sequence")(mongoose);
const shortid = require("shortid");
const moment = require("moment");
const https = require("https");

const urlModel = require("./url");
const pixelModel = require("./pixel");
const userModel = require("./users");

const Schema = mongoose.Schema;

const getBpmnData = require("../lib/bpmnAnalyser");
const uploadBase64 = require("../lib/uploadBase64");
const asyncForEach = require("../lib/asyncForEach");
const { response } = require("express");

const procedureSchema = new Schema(
    {
        bpmn: {
            type: mongoose.ObjectId,
            ref: "bpmn",
            required: false,
        },
        email: {
            type: String,
            trim: true,
            lowercase: true,
            //required: true,
        },
        user: {
            type: mongoose.ObjectId,
            ref: "users",
            required: false,
        },
        gestores: [
            {
                type: Schema.Types.Mixed,
            },
        ],
        signatures: [
            {
                type: Schema.Types.Mixed,
            },
        ],
        ecert: [
            {
                type: Schema.Types.Mixed,
            },
        ],
        oldEcert: [
            {
                type: Schema.Types.Mixed,
            },
        ],
        upload: { type: String, default: "" },
        checks: [
            {
                type: String,
            },
        ],
        paid_amount: {
            type: Number,
            default: 0,
        },
        reviews: [
            {
                type: Schema.Types.Mixed,
            },
        ],
        oldReviews: [
            {
                type: Schema.Types.Mixed,
            },
        ],
        returnData: {
            type: Schema.Types.Mixed,
        },
        sequence: {
            type: Number,
            required: false,
        },
        origin: {
            type: String,
            default: "express",
        },
        short: { type: String, default: "" },
        company: {
            type: Schema.ObjectId,
            ref: "companies",
            default: process.env.OBJECTID_COMPANY,
        },
        url: { type: String, required: false },
    },
    { timestamps: true }
);
procedureSchema.plugin(mongoosePaginate);
procedureSchema.plugin(AutoIncrement, {
    id: "procedure_seq",
    inc_field: "sequence",
    reference_fields: ["company"],
});
/*procedureSchema.post("save", function (doc) {
    const shortCode = shortid();
    doc.short = shortCode;
    doc.save();
    urlModel.create({
        shortUrl: `${process.env.REACT_URL}/p/${shortCode}`,
        longUrl: `${process.env.REACT_URL}/procedure/${doc._id}`,
        urlCode: shortCode,
        clickCount: 0,
    });
});*/

const procedureModel = mongoose.model("procedures", procedureSchema);

const validateRuleCompare = (it, formData) => {
    let value2eval = formData[it.field_to_evaluate];
    if (Array.isArray(value2eval)) value2eval = value2eval.join(",");
    if (it.rule_compare) {
        if (it.rule_compare === "equal") {
            return it.expected_result.toLowerCase() === (value2eval || "").toString().trim().toLowerCase();
        } else if (it.rule_compare === "nequal") {
            return it.expected_result !== (value2eval || "").trim().toString();
        } else if (it.rule_compare === "less") {
            return parseFloat(it.expected_result) > parseFloat((value2eval || "").trim().toString());
        } else if (it.rule_compare === "lequal") {
            return parseFloat(it.expected_result) >= parseFloat((value2eval || "").trim().toString());
        } else if (it.rule_compare === "greater") {
            return parseFloat(it.expected_result) < parseFloat((value2eval || "").trim().toString());
        } else if (it.rule_compare === "gequal") {
            return parseFloat(it.expected_result) <= parseFloat((value2eval || "").trim().toString());
        }
    } else {
        return it.expected_result.toLowerCase() === (value2eval || "").toString().trim().toLowerCase();
    }
};
const validateMultipleRules = (it, formData) => {
    const optionals = JSON.parse(it.optionals);
    if (optionals.length === 0) return validateRuleCompare(it, formData);
    const first = validateRuleCompare(it, formData);
    const conditions = [first];
    optionals.forEach((item) => {
        conditions.push(item.condition === "y" ? "&&" : "||");
        conditions.push(validateRuleCompare(item, formData));
    });
    const resultConditionals = eval(conditions.join(" "));
    return resultConditionals;
};

module.exports = {
    getDocumento: (id, getBpmn = true) => {
        return new Promise((resolve, reject) => {
            procedureModel.findById(id, async (err, data) => {
                if (err) return reject(err);
                if (data === null) return reject("No se encontró el procedimiento");
                try {
                    let documento = false;
                    if (!data._doc.bpmn && data._doc.origin === "rescue") {
                        return resolve({
                            ...data._doc,
                            id: data._doc._id,
                            documento: null,
                        });
                    }
                    if (getBpmn) {
                        documento = await getBpmnData(
                            data._doc.bpmn,
                            "current",
                            data._doc.gestores.map((it) => {
                                return { id: it.id, current: it.current };
                            })
                        );
                    }
                    if (documento.participants) {
                        await asyncForEach(documento.participants, async (parti, ind) => {
                            let gestor = null;
                            if (
                                parti.next["custom:functions"] == "doc" ||
                                parti.next["custom:functions"] == "advanced_signature"
                            ) {
                                const tmpFiles = [];
                                gestor = data._doc.gestores.find((it) => it.id === parti.id);
                                for (var nameHistory in gestor.history) {
                                    if (gestor.history[nameHistory].type === "form") {
                                        for (var nameField in gestor.history[nameHistory].properties) {
                                            if (gestor.history[nameHistory].properties[nameField].format)
                                                if (
                                                    gestor.history[nameHistory].properties[nameField].format ===
                                                    "data-url"
                                                )
                                                    tmpFiles.push(nameField);
                                        }
                                    }
                                }
                                if (tmpFiles.length > 0) parti.files = tmpFiles;
                            }
                            const files = [];
                            if (parti.files) {
                                if (!gestor) gestor = data._doc.gestores.find((it) => it.id === parti.id);
                                if (gestor.form) {
                                    parti.files.forEach((file) => {
                                        if (gestor.form[file]) {
                                            files.push({ name: file, path: gestor.form[file] });
                                        }
                                    });
                                }
                            }
                            if (files.length > 0) {
                                const readFile = (url) => {
                                    return new Promise((resolve, reject) => {
                                        https
                                            .get(url, (resp) => {
                                                resp.setEncoding("base64");
                                                body = "data:" + resp.headers["content-type"] + ";base64,";
                                                resp.on("data", (data) => {
                                                    body += data;
                                                });
                                                resp.on("end", () => {
                                                    resolve(body);
                                                });
                                            })
                                            .on("error", (e) => {
                                                reject(`Got error: ${e.message}`);
                                            });
                                    });
                                };
                                await asyncForEach(files, async (file, indf) => {
                                    files[indf].value = await readFile(file.path);
                                });
                                documento.participants[ind].files = files;
                            }
                            if (parti.next["custom:functions"] === "advanced_signature") {
                                if (parti.next["ecert_user"]) {
                                    documento.participants[ind].ecert_user = await userModel.findOne(
                                        parti.next["ecert_user"]
                                    );
                                }
                            }
                        });
                    }
                    resolve({
                        ...data._doc,
                        id: data._doc._id,
                        documento: documento,
                    });
                } catch (e) {
                    reject(e);
                }
            });
        });
    },
    createDocumento: (data) => {
        return new Promise(async (resolve, reject) => {
            try {
                const documento = await getBpmnData(data.bpmn);
                let shortCode = shortid();
				shortCode = `F${moment().format('yyyyMM')}${shortCode}`;
                const procedure = new procedureModel({
                    short: shortCode,
                    gestores: documento.participants.map((item) => {
                        const gestorData = {
                            id: item.id,
                            name: item.name,
                            processRef: item.processRef,
                            start: item.start,
                            current: item.start,
                            history: {},
                        };
                        if (item.next) {
                            if (item.next.name) gestorData.current_name = item.next.name;
                            if (item.next["custom:days"]) {
                                gestorData.vence = parseFloat(item.next["custom:days"]);
                                gestorData.due_date = moment().add(gestorData.vence, "days").toDate();
                            }
                        }
                        return gestorData;
                    }),
                    ...data,
                });
                procedure
                    .save()
                    .then((result) => {
                        urlModel.create({
                            shortUrl: `${process.env.REACT_URL}/p/${shortCode}`,
                            longUrl: `${process.env.REACT_URL}/procedure/${result._id}`,
                            rxsUrl: `/procedure/${result._id}`,
                            urlCode: shortCode,
                            clickCount: 0,
                        });
                        resolve({ ...result._doc, id: result._id, documento });
                    })
                    .catch((err) => {
                        console.error(err);
                        reject(err);
                    });
            } catch (err) {
                reject(err);
            }
        });
    },
    updateDocumento: (id, currentStage, dataProcedure) => {
        return new Promise(async (resolve, reject) => {
            procedureModel.findById(id, async (err, data) => {
                if (err) return reject(err);
                if (!data) return reject("No existe el procedimiento");
                const { _doc } = data;
                try {
                    let nextStageData = false;
                    const {
                        participant,
                        nextFlow,
                        nextStage,
                        currentStage: currentStageId,
                        gateway,
                        end,
                    } = await getBpmnData(_doc.bpmn, "next", currentStage);
                    let writingObject = {
                        [`gestores.$.history.${currentStageId}`]: {
                            writeAt: new Date(),
                            ...dataProcedure,
                        },
                        [`gestores.$.current`]: nextFlow,
                    };
                    if (nextStage) {
                        writingObject[`gestores.$.current_name`] = nextStage.name;
                    }
                    if (dataProcedure.type === "signature" && !dataProcedure.emails) {
                        writingObject = {
                            [`gestores.$.current`]: nextFlow,
                        };
                        if (nextStage) {
                            writingObject[`gestores.$.current_name`] = nextStage.name;
                        }
                    }
                    /** Si es un formulario, agregarlo al array de formularios */
                    if (dataProcedure.type === "form") {
                        for (const [key, value] of Object.entries(dataProcedure.form)) {
                            writingObject[`gestores.$.form.${key}`] = value;
                            let isFile = false;
                            if (dataProcedure.form_types[key] === "data-url") isFile = true;
                            if (typeof value === "string") {
                                if (value.substring(0, 26) === "data:application/pdf;name=") isFile = true;
                                else if (value.substring(0, 20) === "data:image/png;name=") isFile = true;
                                else if (value.substring(0, 20) === "data:image/jpg;name=") isFile = true;
                                else if (value.substring(0, 20) === "data:image/gif;name=") isFile = true;
                                else if (value.substring(0, 21) === "data:image/jpeg;name=") isFile = true;
                            }
                            if (isFile) {
                                /*const base64Data = new Buffer.from(value.replace(/^data:\/\w+;base64,/, ""), "base64");
                                const type = value.split(";")[0].split(":")[1];*/
                                const url = await uploadBase64(value, id, key);
                                writingObject[`gestores.$.form.${key}`] = url;
                                writingObject[`gestores.$.history.${currentStageId}`].form[key] = url;
                                writingObject[`gestores.$.history.${currentStageId}`].form_types[key] = "";
                                //writingObject[`gestores.$.base64`] = true;
                            }
                        }

                        for (const [key, value] of Object.entries(dataProcedure.form_names)) {
                            writingObject[`gestores.$.form_names.${key}`] = value;
                        }
                        for (const [key, value] of Object.entries(dataProcedure.form_types)) {
                            writingObject[`gestores.$.form_types.${key}`] = value;
                        }
                        if (!dataProcedure.properties)
                            writingObject[`gestores.$.history.${currentStageId}`].properties = [];
                    }
                    /** Si es un cobro, agregarlo al array de pagos */
                    if (dataProcedure.type === "charge") {
                        writingObject["paid_amount"] = (_doc.paid_amount || 0) + dataProcedure.amount;
                    }
                    /** Si es un formulario, agregarlo al array de formularios */
                    if (dataProcedure.type === "sign_in") {
                        writingObject[`email`] = dataProcedure.value;
                        writingObject[`user`] = dataProcedure.user;
                    }
                    /** Si es una revision, las reviews se setean a 0 */
                    if (dataProcedure.type === "doc") {
                        writingObject[`reviews`] = [];
                    }
                    nextStageData = nextStage;
                    /** Si es un gateway, proceder a preguntar siguiente etapa */
                    if (gateway) {
                        const gestorData = _doc.gestores.find((it) => it.id === participant);
                        let formData = gestorData.form;
                        if (dataProcedure.type === "form") {
                            formData = {
                                ...gestorData.form,
                                ...dataProcedure.form,
                            };
                        }
                        let defaultClause = null;
                        const founded = nextStage.find((it) => {
                            if (it.default_clause === "true") defaultClause = it;
                            if (it.optionals) {
                                return validateMultipleRules(it, formData);
                            } else {
                                return validateRuleCompare(it, formData);
                            }
                        });
                        nextStageData = founded;
                        if (!founded || founded === undefined) {
                            nextStageData = defaultClause;
                        }
                        if (!nextStageData) {
                            console.log("No se encontró coincidencia", gestorData.form, dataProcedure.form);
                        }
                        writingObject["gestores.$.current"] = nextStageData.id;
                        writingObject["gestores.$.current_name"] = nextStageData.next["$"].name;
                    }
                    if (end) {
                        writingObject["gestores.$.current"] = "HAS_ENDED";
                        writingObject["gestores.$.current_name"] = "Finalizado";
                    }
                    if (dataProcedure.type === "request_signature") {
                        writingObject["gestores.$.emails"] = dataProcedure.emails;
                        writingObject["gestores.$.people"] = dataProcedure.people;
                    }
                    /** Si es una firma, quitamos siguiente stage si no envia firma */
                    if (dataProcedure.type === "signature") {
                        if (dataProcedure.emails) {
                            delete writingObject["gestores.$.current"];
                            delete writingObject["gestores.$.current_name"];
                        } else {
                            const gestorData = _doc.gestores.find((it) => it.id === participant);
                            if (gestorData.signatures) {
                                writingObject["gestores.$.signatures"] = [
                                    ...gestorData.signatures,
                                    dataProcedure.value,
                                ];
                            } else {
                                writingObject["gestores.$.signatures"] = [dataProcedure.value];
                            }
                            /** Solamente continua si las firmas son todas */
                            if (gestorData.signatures) {
                                if (gestorData.signatures.length + 1 !== gestorData.emails.length) {
                                    delete writingObject["gestores.$.current"];
                                    delete writingObject["gestores.$.current_name"];
                                }
                            } else {
                                if (gestorData.emails.length > 1) {
                                    delete writingObject["gestores.$.current"];
                                    delete writingObject["gestores.$.current_name"];
                                }
                            }
                        }
                    }

                    if (nextStage) {
                        if (nextStage["custom:functions"] === "signature") {
                            const gestorData = _doc.gestores.find((it) => it.id === participant);
                            nextStageData.emails = gestorData.emails;
                            if (dataProcedure.emails) {
                                nextStageData.emails = dataProcedure.emails;
                            }
                        }
                    }
                    if (nextStage) {
                        if (nextStage["custom:functions"] === "doc") {
                            writingObject[`reviews`] = [];
                        }
                    }

                    if (nextStageData) {
                        if (nextStageData["custom:days"]) {
                            writingObject["gestores.$.vence"] = parseInt(nextStageData["custom:days"]);
                            writingObject["gestores.$.due_date"] = moment()
                                .add(parseInt(nextStageData["custom:days"]), "days")
                                .toDate();
                        }
                    }

                    procedureModel
                        .update(
                            { _id: id, "gestores.id": participant },
                            {
                                $set: writingObject,
                            }
                        )
                        .exec()
                        .then(() => {
                            resolve(nextStageData);
                        })
                        .catch((err) => {
                            console.error(err);
                            reject(err);
                        });
                } catch (e) {
                    reject(e);
                }
            });
        });
    },
    /**
     * Actualización de formulario de gestor
     * - Se validará que el gestor no haya llenado ya información
     * - Se validará que todos hayan llenado información, sino se bloqueará
     */
    gestorDocumento: (id, data) => {
        return new Promise((resolve, reject) => {
            procedureModel.findById(id, async (err, procedure) => {
                if (err) return reject(err);
                if (procedure.step === 3) {
                    if (procedure.gestores) {
                        if (procedure.gestores.findIndex((it) => it.gestor === data.gestor) !== -1) {
                            return reject("Este gestor ya ingresó su información!");
                        }
                    }
                    const documento = await getBpmnData(procedure._doc.bpmn);
                    procedureModel
                        .update({ _id: id }, { $push: { gestores: data } })
                        .exec()
                        .then(() => {
                            if (procedure.gestores) {
                                if (documento.participants.length === procedure.gestores.length + 1) {
                                    procedureModel
                                        .update({ _id: id }, { $set: { step: 4 } })
                                        .exec()
                                        .then(() => {
                                            resolve({ step: 4 });
                                        })
                                        .catch((err) => {
                                            console.error(err);
                                            reject(err);
                                        });
                                } else {
                                    resolve({ step: 3 });
                                }
                            } else {
                                resolve({ step: 3 });
                            }
                        })
                        .catch((err) => {
                            console.error(err);
                            reject(err);
                        });
                } else {
                    reject("No se encuentra en el paso de llenar los datos!");
                }
            });
        });
    },
    /**
     * Se guarda confirmacion de data de formulario
     */
    insertCheck: (id, participant) => {
        return new Promise((resolve, reject) => {
            procedureModel
                .update({ _id: id }, { $push: { checks: participant } })
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
    /**
     * Se guarda firma de clave única en array signatures
     */
    insertSignature: (id, data) => {
        return new Promise((resolve, reject) => {
            procedureModel
                .update({ _id: id }, { $push: { signatures: data } })
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
    find: (filter = {}, page = 1, limit = 10) => {
        return new Promise(function (resolve, reject) {
            procedureModel.paginate(
                filter,
                {
                    sort: { _id: -1 },
                    populate: "bpmn",
                    page,
                    limit,
                },
                (err, items) => {
                    if (err) reject(err);
                    resolve(items);
                }
            );
        });
    },
    findAll: (filter = {}) => {
        return new Promise(function (resolve, reject) {
            procedureModel.find(filter, (err, items) => {
                if (err) reject(err);
                resolve(items);
            });
        });
    },
    backwardDocumento: (id, currentStage, activity, participant, currentStageName = "", currentDue = 0) => {
        return new Promise(async (resolve, reject) => {
            try {
                procedureModel
                    .findById(id, async (err, { _doc }) => {
                        if (err) return reject(err);
                        const toUpdate = {
                            "gestores.$.current": currentStage,
                            "gestores.$.current_name": currentStageName,
                        };
                        if (currentDue > 0) {
                            if (isNaN(currentDue)) {
                                toUpdate["gestores.$.vence"] = currentDue;
                                toUpdate["gestores.$.due_date"] = moment().add(currentDue, "days").toDate();
                            }
                        }
                        procedureModel
                            .update(
                                { _id: id, "gestores.id": participant },
                                {
                                    $set: toUpdate,
                                    $unset: { [`gestores.$.history.${activity}`]: "" },
                                }
                            )
                            .exec()
                            .then(() => {
                                const gestor = _doc.gestores.find((it) => it.id === participant);
                                resolve(gestor.history[activity]);
                            })
                            .catch((err) => {
                                console.error(err);
                                reject(err);
                            });
                    })
                    .catch((err) => {
                        console.error(err);
                        reject(err);
                    });
            } catch (e) {
                reject(e);
            }
        });
    },
    emailDocumento: (id, participant, index, info, old) => {
        return new Promise(async (resolve, reject) => {
            try {
                procedureModel
                    .update(
                        { _id: id, "gestores.id": participant },
                        {
                            $set: {
                                [`gestores.$.emails.${index}`]: info.email,
                                [`gestores.$.people.${index}`]: info,
                            },
                        }
                    )
                    .exec()
                    .then(async () => {
                        const pixel = await pixelModel.removePixel(id, old, info);
                        resolve(pixel);
                    })
                    .catch((err) => {
                        console.error(err);
                        reject(err);
                    });
            } catch (e) {
                reject(e);
            }
        });
    },
    reviewInitDocumento: (id, reviewArray) => {
        return new Promise((resolve, reject) => {
            procedureModel
                .findById(id, async (err, { _doc: procedure }) => {
                    if (err) reject(err);
                    procedureModel
                        .updateOne(
                            { _id: id },
                            {
                                $set: {
                                    reviews: reviewArray,
                                },
                                $push: {
                                    oldReviews: { $each: [...procedure.reviews] },
                                },
                            }
                        )
                        .exec()
                        .then(() => {
                            resolve(true);
                        })
                        .catch((err) => {
                            reject(err);
                        });
                })
                .catch((err) => {
                    reject(err);
                });
        });
    },
    reviewUpdDocumento: (id, uid, approved, comment) => {
        return new Promise((resolve, reject) => {
            try {
                procedureModel
                    .updateOne(
                        { _id: id, "reviews.uid": uid },
                        {
                            $set: {
                                [`reviews.$.comment`]: comment,
                                [`reviews.$.approved`]: approved,
                                [`reviews.$.reviewed`]: true,
                                [`reviews.$.review_at`]: new Date(),
                            },
                        }
                    )
                    .exec()
                    .then(() => {
                        resolve(true);
                    })
                    .catch((err) => {
                        reject(err);
                    });
            } catch (e) {
                reject(e);
            }
        });
    },
    reviewFixDocumento: (id, participant, reviewArray, formToSet, oldReviews) => {
        return new Promise((resolve, reject) => {
            procedureModel
                .updateOne(
                    { _id: id, "gestores.id": participant },
                    {
                        $set: {
                            reviews: reviewArray,
                            ...formToSet,
                        },
                        $push: {
                            oldReviews: { $each: [...oldReviews] },
                        },
                    }
                )
                .exec()
                .then(() => {
                    resolve(true);
                })
                .catch((err) => {
                    reject(err);
                });
        });
    },
    ecertFixDocumento: (id, participant, formToSet, oldReviews) => {
        return new Promise((resolve, reject) => {
            procedureModel
                .updateOne(
                    { _id: id, "gestores.id": participant },
                    {
                        $set: {
                            ecert: [],
                            ...formToSet,
                        },
                        $push: {
                            oldEcert: { $each: [...oldReviews] },
                        },
                    }
                )
                .exec()
                .then(() => {
                    resolve(true);
                })
                .catch((err) => {
                    reject(err);
                });
        });
    },
    findOne: (id) => {
        return new Promise((resolve, reject) => {
            procedureModel
                .findById(id, async (err, { _doc: procedure }) => {
                    if (err) reject(err);
                    resolve(procedure);
                })
                .catch((err) => {
                    reject(err);
                });
        });
    },
    findByFilter: (filter, getBpmn = false) => {
        return new Promise((resolve, reject) => {
            procedureModel
                .findOne(filter, async (err, response) => {
					const procedure = response._doc;
                    if (err) reject(err);
					if(response == null) reject("No se encontro el documento")
                    if (getBpmn) {
                        const documento = await getBpmnData(
                            procedure.bpmn,
                            "current",
                            procedure.gestores.map((it) => {
                                return { id: it.id, current: it.current };
                            })
                        );
                        procedure.documento = documento;
                    }
                    resolve(procedure);
                })
                .catch((err) => {
                    reject(err);
                });
        });
    },
    updateOne: (filter, data) => {
        return new Promise(async (resolve, reject) => {
            try {
                procedureModel
                    .update(filter, data)
                    .exec()
                    .then(async (response) => {
                        resolve(response);
                    })
                    .catch((err) => {
                        console.error(err);
                        reject(err);
                    });
            } catch (e) {
                reject(e);
            }
        });
    },
    createMany: (data) => {
        return new Promise((resolve, reject) => {
            procedureModel.insertMany(data, (err, items) => {
                if (err) reject(err);
                resolve(items);
            });
        });
    },
};
