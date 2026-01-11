import React, { useState, useEffect } from "react";
import BpmnToolbar from "./toolbarActionsBpmn/Containers/BpmnToolbar";
import Gateway from "./gateway/Gateway";
import { is } from "bpmn-js/lib/util/ModelUtil";

export default function PropertiesHandler(props) {
	let { element, modeler } = props;

	const stages = modeler._definitions.rootElements;

	//listStage aparece en el caso que existe algún elemento "Create Group" del mismo bpmn
	var listStages = [];
	for (const iterator of stages) {
		//revisar si existe alguna categoría
		if (iterator.$type === "bpmn:Category") {
			listStages.push({
				id: iterator.id,
				name: iterator.categoryValue[0].value,
			});
		}
	}
	const currentData = element.businessObject;

	const v_back = currentData.back ? currentData.back : "";
	const v_notification = currentData.notification ? currentData.notification : "";
	const v_charge_value = currentData.charge_value ? currentData.charge_value : "";
	const v_charge_by_sign = currentData.charge_by_sign ? currentData.charge_by_sign : "";
	const v_doc = currentData.doc ? currentData.doc : "";
	const v_doc_type = currentData.doc_type ? currentData.doc_type : "";
	const v_ecert_type = currentData.ecert_type ? currentData.ecert_type : "";
	const v_ecert_rut = currentData.ecert_rut ? currentData.ecert_rut : "";
	const v_ecert_restrict = currentData.ecert_restrict ? currentData.ecert_restrict : "";
	const v_download_name = currentData.download_name ? currentData.download_name : "";
	const v_form = currentData.form ? currentData.form : "";
	const v_days = currentData.days ? currentData.days : "";
	const v_action = currentData.functions ? currentData.functions : "";
	const v_stage = currentData.stage ? currentData.stage : "";
	const v_outgoing = element.outgoing;
	const v_email = currentData.email ? currentData.email : "";
	const v_html = currentData.html ? currentData.html : "";
	const v_num_sign = currentData.num_sign ? currentData.num_sign : "";
	const v_fixed_sign = currentData.fixed_sign && v_num_sign === "fixed" ? currentData.fixed_sign : "";
	const v_url_insert_site = currentData.insert_site ? currentData.insert_site : "";

	/*v_outgoing.forEach((item, key) => {
        console.log("item", item);
        console.log("ley", key);
    });*/

	const [valueLocal, setValueLocal] = useState({
		valueEmail: v_email,
		valueHtmls: v_html,
		valueFixedSign: v_fixed_sign,
		valueNumSign: v_num_sign,
		valueForm: v_form,
		valueDoc: v_doc,
		currentAction: v_action,
		stage: v_stage,
		valueCharge: v_charge_value,
		valueUrlInserSite: v_url_insert_site,
		valueChargeBySign: v_charge_by_sign,
		deadLine: v_days,
		back: v_back,
		notification: v_notification,
		valueOptionsIfs: v_outgoing,
		valueDocType: v_doc_type,
		valueEcertType: v_ecert_type,
		valueEcertUser: v_ecert_rut,
		valueEcertRestrict: v_ecert_restrict,
		valueDownloadName: v_download_name,
	});

	useEffect(() => {
		setValueLocal({
			valueEmail: v_email,
			valueHtmls: v_html,
			valueNumSign: v_num_sign,
			valueFixedSign: v_fixed_sign,
			valueForm: v_form,
			valueDoc: v_doc,
			currentAction: v_action,
			stage: v_stage,
			back: v_back,
			notification: v_notification,
			valueCharge: v_charge_value,
			valueUrlInserSite: v_url_insert_site,
			valueChargeBySign: v_charge_by_sign,
			valueDownloadName: v_download_name,
			deadLine: v_days,
			valueOptionsIfs: v_outgoing,
			valueDocType: v_doc_type,
			valueEcertType: v_ecert_type,
			valueEcertUser: v_ecert_rut,
			valueEcertRestrict: v_ecert_restrict,
		});
	}, [
		v_fixed_sign,
		v_num_sign,
		v_doc,
		v_form,
		v_action,
		v_stage,
		v_charge_value,
		v_charge_by_sign,
		v_days,
		v_email,
		v_outgoing,
		v_html,
		v_back,
		v_notification,
		v_url_insert_site,
		v_doc_type,
		v_ecert_type,
		v_ecert_rut,
		v_ecert_restrict,
		v_download_name,
	]);

	const handleChange = (event) => {
		if (event.target.name === "currentAction") {
			setValueLocal({
				currentAction: event.target.value,
				valueOptionsIfs: v_outgoing,
				valueEmail: "",
				valueHtmls: "",
				valueFixedSign: "",
				valueNumSign: "",
				valueForm: "",
				valueDoc: "",
				stage: "",
				valueCharge: "",
				valueUrlInserSite: "",
				valueChargeBySign: "",
				valueDownloadName: "",
				deadLine: "",
				back: "",
				notification: "",
				valueDocType: "",
				valueEcertType: "",
				valueEcertUser: "",
				valueEcertRestrict: "",
			});
		} else {
			setValueLocal({
				...valueLocal,
				[event.target.name]: event.target.value,
			});
		}
	};

	const handleChangeAutocomplete = (name, value) => {
		setValueLocal({
			...valueLocal,
			[name]: value,
		});
	};

	if (element.labelTarget) {
		element = element.labelTarget;
	}

	function updateName(name) {
		const modeling = modeler.get("modeling");
		modeling.updateLabel(element, name);
	}

	function updatePropertie(propertie, name) {
		const modeling = modeler.get("modeling");
		var obj = {};
		obj[name] = propertie;
		if (name === "functions") {
			modeling.updateProperties(element, {
				doc: undefined,
				email: undefined,
				form: undefined,
				stage: undefined,
				html: undefined,
				fixed_sign: undefined,
				num_sign: undefined,
				charge_value: undefined,
				download_name: undefined,
				insert_site: undefined,
				charge_by_sign: undefined,
				days: undefined,
				back: undefined,
				notification: undefined,
				doc_type: undefined,
				ecert_type: undefined,
				ecert_rut: undefined,
				ecert_restrict: undefined,
			});
		}
		modeling.updateProperties(element, obj);
	}

	function updatePropertieGateWay(propertie, name, id) {
		const modeling = modeler.get("modeling");
		var obj = {};
		obj[name] = propertie;
		const index = element.outgoing
			.map(function (e) {
				return e.id;
			})
			.indexOf(id);
		modeling.updateProperties(element.outgoing[index], obj);
	}

	const defaultValueAutocomplete = (forms, valForm) => {
		try {
			return forms.filter((e) => e._id === valForm)[0];
		} catch (error) {
			return "";
		}
	};

	return (
		<div className="element-properties" key={element.id}>
			{is(element, "bpmn:ExclusiveGateway") && (
				<Gateway
					modeler={modeler}
					valueLocal={valueLocal}
					handleChange={handleChange}
					updatePropertieGateWay={updatePropertieGateWay}
					form={props.form}
				/>
			)}

			{is(element, "bpmn:Task") && (
				<BpmnToolbar
					handleChange={handleChange}
					updatePropertie={updatePropertie}
					valueLocal={valueLocal}
					listStages={listStages}
					htmls={props.htmls}
					form={props.form}
					emails={props.emails}
					docs={props.docs}
					users={props.users}
					element={element}
					defaultValueAutocomplete={defaultValueAutocomplete}
					handleChangeAutocomplete={handleChangeAutocomplete}
					updateName={updateName}
				/>
			)}
		</div>
	);
}
