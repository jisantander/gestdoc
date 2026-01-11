const fs = require("fs");
const path = require("path");
const axios = require("axios");
const FormData = require("form-data");

const { updateDocumento } = require("../../models/procedures");

module.exports = (app) => {
    app.get("/api/claveunica/continue", async (req, res) => {
        try {
            const { state, code } = req.query;
            const stateChunks = state.split("-");
            const transaction = stateChunks[0];
            const current = stateChunks[1];
            const form = new FormData();
            form.append("state", state);
            form.append("code", code);
            form.append("client_id", process.env.CLAVEUNICA_ID);
            form.append("client_secret", process.env.CLAVEUNICA_SECRET);
            form.append("grant_type", "authorization_code");
            form.append("redirect_uri", "https://gestdoc-express.herokuapp.com/api/claveunica/continue");
            const {
                data: { access_token, id_token },
            } = await axios.post("https://accounts.claveunica.gob.cl/openid/token/", form, {
                headers: form.getHeaders(),
            });
            const { data } = await axios({
                url: "https://www.claveunica.gob.cl/openid/userinfo/",
                method: "POST",
                headers: {
                    Authorization: `Bearer ${access_token}`,
                },
            });
            await updateDocumento(transaction, current, {
                type: "signature",
                token: id_token,
                data,
            });
            await insertSignature(transaction, {
                id_token,
                data,
            });
            fs.readFile(path.join(__dirname, "../../templates/redirect_clave.html"), "utf8", function (err, html) {
                if (err) {
                    console.error(err);
                    return res.status(500).end();
                }
                template = html;
                template = template.replace("{{REACT_URL}}", process.env.REACT_URL);
                template = template.replace("{{TRANSACTION}}", transaction);
                res.send(template);
            });
        } catch (err) {
            console.error(err);
            res.status(500).json({ message: "Hubo un error" });
        }
    });

    app.use((err, req, res, next) => {
        console.error(err);
        res.status(500).json({ message: err });
    });
};
