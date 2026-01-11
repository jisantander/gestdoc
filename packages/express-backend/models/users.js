const mongoose = require("mongoose");
const mongoosePaginate = require("mongoose-paginate");
const bcrypt = require("bcrypt-nodejs");
const jwt = require("../lib/jwt");
const makeString = require("../lib/makeString");
const verificationsModel = require("./verifications.js");
const crypto = require("crypto");
const mail = require("../lib/mail");

const Schema = mongoose.Schema;
const SALT_WORK_FACTOR = 10;
const PUBLIC_FIELDS =
    "name email status surname picture role company ecert_rut ecert_nombre ecert_appat ecert_apmat ecert_title_rol";

const userSchema = new Schema(
    {
        email: {
            type: String,
            required: true,
            trim: true,
            unique: true,
            lowercase: true,
            default: "VISITOR",
        },
        status: {
            type: Boolean,
            default: false,
            required: true,
        },
        password: {
            type: String,
            required: false,
            trim: true,
            match: [/.{6,}/, "Mínimo 6 caracteres"],
        },
        name: {
            type: String,
            required: true,
            trim: true,
        },
        surname: {
            type: String,
            required: true,
            trim: true,
        },
        picture: {
            type: String,
            required: false,
        },
        routes: {
            type: Array,
            default: ["/Procedure"],
        },
        role: {
            type: String,
            required: true,
            default: "VISITOR",
            enum: ["ROLE_ADMIN", "VISITOR", "BIZ_MANAGER", "BIZ_USER"],
        },
        company: { type: Schema.ObjectId, ref: "companies", default: process.env.OBJECTID_COMPANY },
        ecert_rut: {
            type: String,
            required: false,
        },
        ecert_nombre: {
            type: String,
            required: false,
        },
        ecert_appat: {
            type: String,
            required: false,
        },
        ecert_apmat: {
            type: String,
            required: false,
        },
        ecert_title_rol: {
            type: String,
            required: false,
        },
    },
    { timestamps: true }
);
userSchema.plugin(mongoosePaginate);

userSchema.pre("save", function (next) {
    var user = this;

    if (!user.isModified("password")) return next();

    bcrypt.genSalt(SALT_WORK_FACTOR, function (err, salt) {
        if (err) return next(err);

        bcrypt.hash(user.password, salt, null, function (err, hash) {
            if (err) return next(err);
            user.password = hash;
            next();
        });
    });
});

userSchema.methods.comparePassword = function (candidatePassword) {
    return new Promise((resolve, reject) => {
        bcrypt.compare(candidatePassword, this.password, (err, isMatch) => {
            if (err)
                reject({
                    error: true,
                    message: "Necesitamos la contraseña!",
                });
            resolve(isMatch);
        });
    });
};

const userModel = mongoose.model("users", userSchema);

module.exports = {
    findOne: (id) => {
        return new Promise(function (resolve, reject) {
            userModel
                .findOne({ _id: id }, PUBLIC_FIELDS)
                .exec()
                .then(async (usuario) => {
                    resolve(usuario);
                });
        });
    },
    create: (data) => {
        return new Promise((resolve, reject) => {
            userModel
                .findOne({ email: data.email })
                .exec()
                .then(async (usuario) => {
                    if (!usuario || usuario.status == false) {
                        // si active es false deberia de eliminar al usuario mejor

                        if (usuario) {
                            if (usuario.status == false) {
                                const hola = await userModel
                                    .deleteOne({ email: data.email })
                                    .then(function () {
                                        console.log("Data deleted"); // Success
                                        return { message: "Data deleted" };
                                    })
                                    .catch(function (error) {
                                        console.log(error); // Failure
                                    });

                                console.log("hola", hola);
                            }
                        }

                        const usuarioCreate = new userModel(data);
                        usuarioCreate
                            .save()
                            .then(async (result) => {
                                //crear verfication
                                var id = crypto.randomBytes(20).toString("hex");
                                const hola = await verificationsModel.createHashVerification({
                                    _idUser: result.email,
                                    _hash: id,
                                });

                                await mail.email_verification({ email: data.email, hash: id });

                                resolve({ message: "Link de confirmación enviado" });
                            })
                            .catch((err) => reject(err));
                    } else {
                        return reject({ message: "El usuario ya existe" });
                    }
                })
                .catch((err) => reject(err));
        });
    },
    login: ({ email, password }) => {
        return new Promise((resolve, reject) => {
            userModel
                .findOne({ email: email })
                .exec()
                .then((usuario) => {
                    if (!usuario) return reject({ message: "Usuario no encontrado" });
                    usuario
                        .comparePassword(password)
                        .then(async (valid) => {
                            if (!valid) {
                                return reject({
                                    message: "Contraseña inválida",
                                });
                            }
                            resolve({
                                email: usuario.email,
                                name: usuario.name,
                                surname: usuario.surname,
                                token: await jwt.generateToken({
                                    _id: usuario._id,
                                    email: usuario.email,
                                    name: usuario.name,
                                    surname: usuario.surname,
                                }),
                            });
                        })
                        .catch((err) => reject(err));
                })
                .catch((err) => reject(err));
        });
    },
    findByEmailLogin: (email) => {
        return new Promise(function (resolve, reject) {
            userModel
                .findOne({ email: email })
                .exec()
                .then(async (usuario) => {
                    resolve({
                        email: usuario.email,
                        name: usuario.name,
                        surname: usuario.surname,
                        token: await jwt.generateToken({
                            _id: usuario._id,
                            email: usuario.email,
                            name: usuario.name,
                            surname: usuario.surname,
                        }),
                    });
                })
                .catch((err) => reject(err));
        });
    },
    findByEmail: (email) => {
        return new Promise(function (resolve, reject) {
            userModel
                .findOne({ email: email })
                .exec()
                .then((doc) => resolve(doc))
                .catch((err) => reject(err));
        });
    },
    find: (page = 1, limit = 10) => {
        return new Promise(function (resolve, reject) {
            userModel.paginate(
                {},
                {
                    sort: { name: 1 },
                    select: PUBLIC_FIELDS,
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
            userModel
                .find(filter)
                .select(PUBLIC_FIELDS)
                .then((result) => resolve(result))
                .catch((err) => {
                    console.error(err);
                    reject(err);
                });
        });
    },
    update: (id, data) => {
        return new Promise(async (resolve, reject) => {
            userModel
                .update(
                    { _id: id },
                    {
                        $set: data,
                    }
                )
                .exec()
                .then(() => {
                    resolve(true);
                })
                .catch((err) => {
                    console.error(err);
                    reject(err);
                });
        });
    },
    updateStatus: (email, data) => {
        return new Promise(async (resolve, reject) => {
            userModel
                .update(
                    { email: email },
                    {
                        $set: data,
                    }
                )
                .exec()
                .then(() => {
                    resolve(true);
                })
                .catch((err) => {
                    console.error(err);
                    reject(err);
                });
        });
    },
    upsert: (email) => {
        return new Promise(function (resolve, reject) {
            userModel
                .findOne({ email: email })
                .exec()
                .then((doc) => {
                    if (doc) {
                        resolve({ type: "exists", ...doc._doc });
                    } else {
                        const tempPwd = makeString(6);
                        const usuario = new userModel({
                            email,
                            role: "VISITOR",
                            name: email,
                            surname: "-",
                            password: tempPwd,
                        });
                        usuario
                            .save()
                            .then(async (result) => {
                                resolve({
                                    type: "new",
                                    _id: result._doc._id,
                                    email: result._doc.email,
                                    pwd: tempPwd,
                                });
                            })
                            .catch((err) => reject(err));
                    }
                })
                .catch((err) => reject(err));
        });
    },
    deleteEmail: (email, data) => {
        return new Promise(async (resolve, reject) => {
            userModel.deleteOne({ email: email }, function (err, obj) {
                if (err) throw err;
                resolve("1 document deleted");
            });
        });
    },
    updatePassword: (data) => {
        return new Promise(async (resolve, reject) => {
            userModel
                .findOne({ email: data.email })
                .exec()
                .then((user) => {
                    if (user) {
                        user.password = data.password;
                        user.save(function (err) {
                            resolve(user);
                        });
                    }
                })
                .catch((err) => reject(err));
        });
    },
    send_invitation_password: (data) => {
        return new Promise(async (resolve, reject) => {
            userModel
                .findOne({ email: data._email })
                .exec()
                .then(async (result) => {
                    if (!result) {
                        return resolve({ message: "No se encontró este usuario" });
                    }

                    if (!result.password) {
                        console.log("holaa");
                        return resolve({
                            message: "Usuario ingresado vía Google, no es posible cambiar la contraseña",
                        });
                    }

                    var id = crypto.randomBytes(20).toString("hex");
                    const hola = await verificationsModel.createHashVerification({ _idUser: result.email, _hash: id });

                    await mail.email_forgot_password({ email: result.email, hash: id });
                    console.log(hola);
                    resolve({ message: "Link de confirmación enviado" });
                })
                .catch((err) => reject(err));
        });
    },
    /**
     *
     * @param {email, name, surname,token_id, picture} data
     */
    googleLogin: (data) => {
        return new Promise(function (resolve, reject) {
            userModel
                .findOne({ email: data.email })
                .exec()
                .then(async (usuario) => {
                    if (!usuario) {
                        data.status = true;
                        const usuario = new userModel(data);
                        usuario
                            .save()
                            .then(async (result) => {
                                resolve({
                                    email: result.email,
                                    name: result.name,
                                    surname: result.surname,
                                    picture: result.picture,
                                    token: await jwt.generateToken({
                                        _id: result._id,
                                        email: result.email,
                                        name: result.name,
                                        surname: result.surname,
                                    }),
                                });
                            })
                            .catch((err) => reject(err));
                    } else {
                        console.log("holaaa");
                        userModel
                            .findOne({ email: usuario.email })
                            .exec()
                            .then(async (usuario) => {
                                resolve({
                                    email: usuario.email,
                                    name: usuario.name,
                                    surname: usuario.surname,
                                    picture: usuario.picture,
                                    token: await jwt.generateToken({
                                        _id: usuario._id,
                                        email: usuario.email,
                                        name: usuario.name,
                                        surname: usuario.surname,
                                    }),
                                });
                            })
                            .catch((err) => reject(err));
                    }
                });
        });
    },
};
