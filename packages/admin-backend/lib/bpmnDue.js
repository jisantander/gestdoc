const xml2js = require('./xml2js');
const asyncForEach = require('./asyncForEach');
const modelBpmn = require('../models/bpmnModel');

const _calculateDueDate = async (xmlBpmn, participant, current) => {
	return new Promise(async (resolve, reject) => {
		try {
			let days = 0;
			let participantId = undefined;
			let participantName = undefined;
			/* Recorremos cada participante */
			await asyncForEach(
				xmlBpmn['bpmn:definitions']['bpmn:collaboration'][0][
					'bpmn:participant'
				],
				async (it) => {
					const partiData = it['$'];
					/* Encontramos su proceso */
					if (partiData.id === participant) {
						participantId = partiData.id;
						participantName = partiData.name;
						const processNode = xmlBpmn['bpmn:definitions'][
							'bpmn:process'
						].find((itp) => {
							return itp['$'].id === partiData.processRef;
						});
						processNode['bpmn:task'].forEach((itt) => {
							if (itt['bpmn:incoming'][0] === current) {
								if (itt['$']['custom:days']) {
									days = parseFloat(itt['$']['custom:days']);
								} else {
									days = 0;
								}
							}
						});
					}
				}
			);
			resolve({
				id: participantId,
				name: participantName,
				days,
			});
		} catch (e) {
			reject(e);
		}
	});
};

const calculateDueDate = async (bpmnId, procedure, bpmnData = false) => {
	const dates = {};
	let bpmn = bpmnData;
	if (!bpmn) bpmn = await modelBpmn.findById(bpmnId);
	const xmlBpmn = await xml2js(bpmn._bpmnModeler);
	await asyncForEach(procedure.gestores, async (item) => {
		const { id, ...tmpDate } = await _calculateDueDate(
			xmlBpmn,
			item.id,
			item.current
		);
		dates[id] = tmpDate;
	});
	return dates;
};

exports.calculateDueDate = calculateDueDate;

exports.calculateDueDateMass = async (procedures) => {
	const dates = {};
	const bpmns = [];
	const bpmnInfo = [];
	await asyncForEach(procedures, async (item) => {
		let bpmnData = false;
		if (bpmns.includes(item.bpmn._id)) {
			bpmnData = bpmnInfo[bpmns.findIndex((it) => it === item.bpmn._id)];
		} else {
			bpmnData = await modelBpmn.findById(item.bpmn._id);
			bpmns.push(item.bpmn._id);
			bpmnInfo.push(bpmnData);
		}
		const date = await calculateDueDate(item.bpmn, item, bpmnData);
		dates[item._id] = date;
	});
	return dates;
};
