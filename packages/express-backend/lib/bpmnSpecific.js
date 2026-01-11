const modelBpmn = require("../models/bpmn");
const modelMail = require("../models/mails");
const xml2js = require("../lib/xml2js");
const asyncForEach = require("../lib/asyncForEach");

/**
 * Obtener BPMN de ejemplo con participantes y formularios en JSON
 * @param {Documento} id
 */
module.exports = async (id, method = "docs", current = false) => {
    const { _bpmnModeler, _requirements, _valor, ...documento } = await modelBpmn.findOne(id);
    const xmlBpmn = await xml2js(_bpmnModeler);
    /* Guardamos una variable temporal para devolucion de informacion solicitada */
    let requestedData = false;
    if (method === "docs") {
        requestedData = [];
    }
    /* Recorremos cada participante */
    await asyncForEach(xmlBpmn["bpmn:definitions"]["bpmn:collaboration"][0]["bpmn:participant"], async (it) => {
        /* Encontramos su proceso */
        const processNode = xmlBpmn["bpmn:definitions"]["bpmn:process"].find((itp) => {
            return itp["$"].id === it["$"].processRef;
        });
        /* En caso se desee, solamente preguntamos por el estado actual del documento */
        if (method == "mail") {
            let mailTaskId = false;
            const mailTaskIdTemp = processNode["bpmn:sequenceFlow"].find((itsf) => {
                return itsf["$"].id === current;
            });
            if (mailTaskIdTemp) {
                mailTaskId = mailTaskIdTemp["$"].targetRef;
                mailTask = processNode["bpmn:task"].find((itt) => {
                    return itt["$"].id === mailTaskId;
                })["$"];
                requestedData = await modelMail.findOne(mailTask["custom:email"]);
            }
        } else {
            /* Caso contrario, se obtiene todos los documentos del bpmn */
            /*partiData.next = processNode['bpmn:task'].find((itt) => {
					return itt['$'].id === nextId;
				})['$'];*/
            requestedData.push(processNode);
        }
    });
    return requestedData;
};
