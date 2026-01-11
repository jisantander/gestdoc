const xml2js = require("./xml2js");
const asyncForEach = require("./asyncForEach");
const formsModel = require("../models/formsModel");

exports.getStepsProcedure = (bpmnXml, getForms = false) => {
	return new Promise(async (resolve, reject) => {
		try {
			const xmlBpmn = await xml2js(bpmnXml);
			const participants = [];
			const formsToFind = [];
			const findForms = (_idsToFind) => {
				const _ids = _idsToFind.map((it) => it[0]);
				return new Promise((resolve, reject) => {
					formsModel
						.find({ _id: { $in: _ids } })
						.then((result) => {
							const response = result.map((it) => {
								const formItem = _idsToFind.find((i) => i[0] == it._id);
								if (formItem[1]) return { ...it._doc, to: formItem[1] };
								return { ...it._doc };
							});
							resolve(response);
						})
						.catch((err) => {
							console.error(err);
							reject(err);
						});
				});
			};
			/* Recorremos cada participante */
			await asyncForEach(xmlBpmn["bpmn:definitions"]["bpmn:collaboration"][0]["bpmn:participant"], async (it) => {
				const steps = [];
				//const forms = [];
				const partiData = it["$"];
				/* Encontramos su proceso */
				const processNode = xmlBpmn["bpmn:definitions"]["bpmn:process"].find((itp) => {
					return itp["$"].id === partiData.processRef;
				});
				/* Hallamos su tarea inicial */
				partiData.start = processNode["bpmn:startEvent"][0]["bpmn:outgoing"][0];
				let nextId = processNode["bpmn:sequenceFlow"].find((itsf) => {
					return itsf["$"].id === partiData.start;
				})["$"].targetRef;
				const firstTaskNode = processNode["bpmn:task"].find((itt) => {
					return itt["$"].id === nextId;
				});
				const firstTask = firstTaskNode["$"];
				firstTask.first = true;
				firstTask.from = partiData.start;
				if (getForms && firstTask["custom:functions"] === "form") {
					/*const dataForm = await formsModel.findById(
						firstTask['custom:form']
					);
					forms.push({
						...dataForm._doc,
						to: firstTaskNode['bpmn:outgoing'][0],
					});*/
					formsToFind.push([firstTask["custom:form"], firstTaskNode["bpmn:outgoing"][0]]);
				}
				steps.push(firstTask);
				await asyncForEach(processNode["bpmn:task"], async (itt) => {
					if (itt["$"].id !== nextId) {
						const dataStep = itt["$"];
						dataStep.from = itt["bpmn:incoming"][0];
						if (getForms && dataStep["custom:functions"] === "form") {
							/*let dataForm = await formsModel.findById(
									dataStep['custom:form']
								);
								if (itt['bpmn:outgoing'])
									forms.push({ ...dataForm._doc, to: itt['bpmn:outgoing'][0] });
								else forms.push(dataForm);*/
							formsToFind.push([
								dataStep["custom:form"],
								itt["bpmn:outgoing"] ? itt["bpmn:outgoing"][0] : false,
							]);
						}
						steps.push(dataStep);
					}
				});
				const forms = await findForms(formsToFind);
				participants.push({ ...partiData, steps, forms });
			});
			resolve(participants);
		} catch (e) {
			reject(e);
		}
	});
};

exports.getCurrentFlow = async (bpmnXml, activity) => {
	const xmlBpmn = await xml2js(bpmnXml);
	const participants = [];
	let currentFlow = false;
	let isFirst = false;
	/* Recorremos cada participante */
	await asyncForEach(xmlBpmn["bpmn:definitions"]["bpmn:collaboration"][0]["bpmn:participant"], async (it) => {
		const steps = [];
		const partiData = it["$"];
		/* Encontramos su proceso */
		const processNode = xmlBpmn["bpmn:definitions"]["bpmn:process"].find((itp) => {
			return itp["$"].id === partiData.processRef;
		});
		const currenTask = processNode["bpmn:task"].find((itt) => {
			return itt["$"].id === activity;
		});
		if (currenTask) {
			currentFlow = currenTask["bpmn:incoming"][0];
			/* Hallamos su tarea inicial */
			partiData.start = processNode["bpmn:startEvent"][0]["bpmn:outgoing"][0];
			if (currentFlow === partiData.start) isFirst = true;
		}
	});
	return [currentFlow, isFirst];
};

exports.getParticipants = async (bpmnXml) => {
	const xmlBpmn = await xml2js(bpmnXml);
	const participants = [];
	/* Recorremos cada participante */
	await asyncForEach(xmlBpmn["bpmn:definitions"]["bpmn:collaboration"][0]["bpmn:participant"], async (it) => {
		const partiData = it["$"];
		participants.push(partiData);
	});
	return participants;
};

exports.verifyConsistency = (bpmn) => {
	return new Promise(async (resolve, reject) => {
		const xmlBpmn = await xml2js(bpmn);
		const errores = [];
		let isValid = true;
		/* Recorremos cada participante */
		await asyncForEach(xmlBpmn["bpmn:definitions"]["bpmn:collaboration"][0]["bpmn:participant"], async (it) => {
			const partiData = it["$"];
			/* Encontramos su proceso */
			const processNode = xmlBpmn["bpmn:definitions"]["bpmn:process"].find((itp) => {
				return itp["$"].id === partiData.processRef;
			});
			if (!processNode) {
				errores.push(`El participante ${partiData.name} no tiene proceso asignado.`);
				isValid = false;
			} else {
				/* Validamos inicio proceso */
				const firstTask = processNode["bpmn:startEvent"];
				if (!firstTask) {
					errores.push(`El participante ${partiData.name} no tiene proceso asignado.`);
					isValid = false;
				}
				/* Validamos fin proceso */
				const lastTask = processNode["bpmn:endEvent"];
				if (!lastTask) {
					errores.push(`El participante ${partiData.name} no tiene proceso final.`);
					isValid = false;
				}
				/* Validamos cada tarea */
				processNode["bpmn:task"].forEach((taskData) => {
					const task = taskData["$"];
					if (!taskData["bpmn:incoming"]) {
						isValid = false;
						errores.push(`La tarea ${task.name} no tiene un origen definido.`);
					}
					if (!taskData["bpmn:outgoing"]) {
						isValid = false;
						errores.push(`La tarea ${task.name} no tiene un destino definido.`);
					}
					/* Validamos el tipo seleccionado */
					if (!task["custom:functions"]) {
						isValid = false;
						errores.push(`La tarea ${task.name} no tiene una función definida.`);
					} else {
						if (task["custom:functions"] === "form") {
							if (!task["custom:form"]) {
								isValid = false;
								errores.push(`La tarea ${task.name} no tiene un formulario asignado.`);
							}
						}
						if (task["custom:functions"] === "doc") {
							if (!task["custom:doc"]) {
								isValid = false;
								errores.push(`La tarea ${task.name} no tiene un documento asignado.`);
							}
						}
						if (task["custom:functions"] === "email") {
							if (!task["custom:email"]) {
								isValid = false;
								errores.push(`La tarea ${task.name} no tiene una plantilla de correo asignada.`);
							}
						}
						if (task["custom:functions"] === "charge") {
							if (!task["custom:charge_value"]) {
								isValid = false;
								errores.push(`La tarea ${task.name} no tiene un monto a cobrar.`);
							}
						}
						if (task["custom:functions"] === "request_signature") {
							if (!task["custom:num_sign"]) {
								isValid = false;
								errores.push(`La tarea ${task.name} no tiene una cantidad especificada para firmas.`);
							}
						}
					}
				});
			}
		});
		resolve([isValid, errores]);
	});
};
