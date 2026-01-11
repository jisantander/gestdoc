const modelBpmn = require("../models/bpmnModel");
const modelForm = require("../models/formsModel");
const modelDoc = require("../models/themedocModel");
const modelHtml = require("../models/htmlsModel");
const xml2js = require("./xml2js");
const asyncForEach = require("./asyncForEach");

const DEFAULT_TOTAL = 10000;

/**
 * Obtener BPMN de ejemplo con participantes y formularios en JSON
 * @param {Documento} id
 */
module.exports = (id, method = "start", currentStage = false) => {
	return new Promise(async (resolve, reject) => {
		try {
			const {
				_doc: { _bpmnModeler, _requirements, _valor, ...documento },
			} = await modelBpmn.findById(id);
			const xmlBpmn = await xml2js(_bpmnModeler);
			const participants = [];
			const docs = {};
			/* Guardamos una variable temporal para devolucion de next */
			let participantId = false;
			let nextStage = false;
			let nextStage2 = false;
			let hasGateway = false;
			let hasEnded = false;
			/* Recorremos cada participante */
			await asyncForEach(xmlBpmn["bpmn:definitions"]["bpmn:collaboration"][0]["bpmn:participant"], async (it) => {
				try {
					const partiData = it["$"];
					/* Encontramos su proceso */
					const processNode = xmlBpmn["bpmn:definitions"]["bpmn:process"].find((itp) => {
						return itp["$"].id === partiData.processRef;
					});
					/* Encontramos su proceso inicial */
					partiData.start = processNode["bpmn:startEvent"][0]["bpmn:outgoing"][0];
					partiData.previous = false;

					/* Encontramos su siguiente tarea
						- A menos que se indique una tarea, se tomará en cuenta la inicial */
					let nextId = processNode["bpmn:sequenceFlow"].find((itsf) => {
						return itsf["$"].id === partiData.start;
					})["$"].targetRef;
					let nodeToLook;
					let nodePrevious;

					/* Se buscan posibles documentos de descarga */
					processNode["bpmn:task"].forEach((itt) => {
						if (itt["$"]["custom:doc"]) {
							docs[itt["$"]["custom:doc"]] = true;
						}
					});
					/* En caso se desee, solamente preguntamos por el estado actual del documento */
					if (method == "next" && currentStage && !nextStage) {
						nextPossible = processNode["bpmn:sequenceFlow"].find((itsf) => {
							return itsf["$"].id === currentStage;
						});
						if (nextPossible) {
							participantId = partiData.id;
							nextStage = nextPossible["$"].targetRef;
							nextStage = processNode["bpmn:task"].find((itt) => {
								return itt["$"].id === nextStage;
							});
							const nextPossible2 = processNode["bpmn:sequenceFlow"].find((itsf) => {
								return itsf["$"].id === nextStage["bpmn:outgoing"][0];
							});
							let nextStage2Id = nextPossible2["$"].targetRef;
							nextStage2 = processNode["bpmn:task"].find((itt) => {
								return itt["$"].id === nextStage2Id;
							});
							if (nextStage2) {
								nextStage2 = nextStage2["$"];
							} else {
								let hasFound = false;
								if (processNode["bpmn:exclusiveGateway"]) {
									let nextStage2Opt = processNode["bpmn:exclusiveGateway"].find((itt) => {
										return itt["$"].id === nextStage2Id;
									});
									if (nextStage2Opt) {
										hasGateway = true;
										hasFound = true;
										nextStage2Opt = nextStage2Opt["bpmn:outgoing"];
										nextStage2 = nextStage2Opt.map((nso2) => {
											return processNode["bpmn:sequenceFlow"].find((itsf) => {
												return itsf["$"].id === nso2;
											})["$"];
										});
										nextStage2 = nextStage2.map((nso2) => {
											const next = processNode["bpmn:task"].find((itt) => {
												return itt["$"].id === nso2.targetRef;
											});
											return {
												...nso2,
												next,
											};
										});
									}
								}
								if (!hasFound) {
									let nextStage2Opt = processNode["bpmn:endEvent"].find((itt) => {
										return itt["$"].id === nextStage2Id;
									});
									if (nextStage2Opt) {
										hasEnded = true;
									}
								}
							}
						}
					} else if (method == "current" && currentStage) {
						const participantStage = currentStage.find((itcs) => {
							return itcs.id === partiData.id;
						});
						if (participantStage.current !== "HAS_ENDED") {
							const nodeToLookBefore = processNode["bpmn:sequenceFlow"].find((itsf) => {
								return itsf["$"].id === participantStage.current;
							});
							if (!nodeToLookBefore) throw "El BPMN ya no es compatible con el procedimiento!";
							nodeToLook = nodeToLookBefore["$"];
							nextId = nodeToLook.targetRef;
							prevId = nodeToLook.sourceRef;
							partiData.next = processNode["bpmn:task"].find((itt) => {
								return itt["$"].id === nextId;
							})["$"];
							nodePrevious = processNode["bpmn:task"].find((itt) => {
								return itt["$"].id === prevId;
							});
							if (nodePrevious) {
								partiData.previous = nodePrevious["$"];
								partiData.previousId = nodePrevious["bpmn:incoming"][0];
							} else {
								if (processNode["bpmn:exclusiveGateway"]) {
									let nodePrevious2 = processNode["bpmn:exclusiveGateway"].find((itt) => {
										return itt["$"].id === prevId;
									});
									if (nodePrevious2) {
										prevId = nodePrevious2["bpmn:incoming"][0];
										nodeToLook2 = processNode["bpmn:sequenceFlow"].find((itsf) => {
											return itsf["$"].id === prevId;
										})["$"];
										nodePrevious = processNode["bpmn:task"].find((itt) => {
											return itt["$"].id === nodeToLook2.sourceRef;
										});
										console.log({ prevId, nodePrevious });
										if (nodePrevious) {
											partiData.previous = nodePrevious["$"];
											partiData.previousId = nodePrevious["bpmn:incoming"][0];
										}
									}
								}
							}
						} else {
							partiData.end = true;
							partiData.next = {
								"custom:functions": "END",
							};
							partiData.previous = "end";
						}
					} else {
						/* Caso contrario, se obtiene la primera tarea del usuario */
						partiData.next = processNode["bpmn:task"].find((itt) => {
							return itt["$"].id === nextId;
						})["$"];
						partiData.previous = false;
					}
					participants.push(partiData);
				} catch (err) {
					throw err;
				}
			});
			if (method == "next") {
				resolve({
					currentStage: nextStage["$"].id,
					nextFlow: nextStage["bpmn:outgoing"][0],
					nextStage: nextStage2,
					participant: participantId,
					gateway: hasGateway,
					end: hasEnded,
				});
			} else {
				/* Por si acaso, recorremos para ver si hay un formulario */
				let cont = 0;
				await asyncForEach(participants, async (it) => {
					try {
						/* Si hay un formulario, lo obtenemos de la bd */
						if (it.next["custom:functions"] == "form") {
							participants[cont]["form"] = await modelForm.findById(it.next["custom:form"]);
							if (it.next["custom:html"]) {
								participants[cont]["html"] = await modelHtml.findById(it.next["custom:html"]);
							}
						}
						cont++;
					} catch (err) {
						throw err;
					}
				});
				const findDocuments = (_ids) => {
					return new Promise((resolve, reject) => {
						modelDoc
							.find({ _id: { $in: _ids } })
							.select("_id _title")
							.then((result) => resolve(result))
							.catch((err) => {
								console.error(err);
								reject(err);
							});
					});
				};
				const documentsBulk = await findDocuments(Object.keys(docs));
				if (documentsBulk)
					asyncForEach(documentsBulk, ({ _id, _title }) => {
						docs[_id] = { id: _id, title: _title };
					});
				resolve({
					_valor: _valor || DEFAULT_TOTAL,
					participants,
					docs,
					...documento,
				});
			}
		} catch (e) {
			if (e === undefined) {
				return reject("El procedimiento y el bpmn no son compatibles!");
			}
			reject(e);
		}
	});
};
