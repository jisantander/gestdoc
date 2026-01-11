const Odoo = require("odoo-xmlrpc");
const downloadBase64 = require("./downloadBase64");

const getConnection = (odooData) => {
    return new Promise(async (resolve, reject) => {
        try {
            const odoo = new Odoo({
                ...odooData,
            });
            odoo.connect(function (err) {
                if (err) reject(err);
                resolve(odoo);
            });
        } catch (err) {
            reject(err);
        }
    });
};

module.exports = {
    getRut: (odooData, rut) => {
        return new Promise(async (resolve, reject) => {
            try {
                const odoo = await getConnection({
                    url: odooData.url,
                    port: odooData.port,
                    db: odooData.database,
                    username: odooData.username,
                    password: odooData.password,
                });
                var inParams = [];
                inParams.push([["identification_id", "=", rut]]);
                //inParams.push(['name', 'country_id', 'comment']); //fields
                var params = [];
                params.push(inParams);
                odoo.execute_kw("hr.employee", "search_read", params, function (err, [value]) {
                    if (err) {
                        return console.log(err);
                    }
                    resolve(value);
                });
            } catch (err) {
                reject(err);
            }
        });
    },
    uploadPdf: (odooData, awsUrl, resId) => {
        return new Promise(async (resolve, reject) => {
            try {
                const odoo = await getConnection({
                    url: odooData.url,
                    port: odooData.port,
                    db: odooData.database,
                    username: odooData.username,
                    password: odooData.password,
                });
                const bodyFile = await downloadBase64(awsUrl);
                const fileContent = await bodyFile.toString("base64");
                var inParams = [];
                inParams.push(resId);
                inParams.push(fileContent);
                var params = [];
                params.push(inParams);
                odoo.execute_kw("documents.document", "ecert_upd_pdf", params, (err, value) => {
                    if (err) {
                        return reject(err);
                    }
                    resolve(value);
                });
            } catch (err) {
                reject(err);
            }
        });
    },
};
