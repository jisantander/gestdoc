import React, { useState, useEffect } from "react";
import Form from "@rjsf/material-ui";
import ArrowForwardIcon from "@material-ui/icons/ArrowForward";
import Box from "@material-ui/core/Box";
import CircularProgress from "@material-ui/core/CircularProgress";

import axios from "../../../utils/axios";
import WidgetAdress from "../../FormBuilder/widgets/WidgetAdress";
import ValidInput from "../../FormBuilder/widgets/ValidInput";
import FileWidget from "../../FormBuilder/widgets/FileWidget";
import { Rut, findNestedObj } from "./utils";

const RJSF_PREFIX = "rjsf_prefix";

export default function ProcedureForm({ gestor, current, close, transaction, form = null }) {
	const [loading, setLoading] = useState(false);
	const [formData, setFormData] = useState(form);

	const jsonSchema = JSON.parse(gestor.form._stringJson);
	const uiSchema = gestor.form._stringUiJson ? JSON.parse(gestor.form._stringUiJson) : {};

	const log = (type) => console.log.bind(console, type);

	const handleSubmit = async () => {
		let form_names = {};
		let form_types = {};

		for (const key in jsonSchema.properties) {
			if (jsonSchema.properties.hasOwnProperty(key)) {
				form_names[key] = jsonSchema.properties[key].title;
				form_types[key] = jsonSchema.properties[key].format;
			}
		}

		try {
			setLoading(true);
			await axios.put(`api/procedure/${transaction}`, {
				current,
				data: {
					type: "form",
					titleStage: gestor.next.name,
					form: formData,
					form_names,
					form_types,
				},
			});
			setLoading(false);
			close();
		} catch (err) {
			//
		}
	};

	useEffect(() => {
		setFormData(form);
	}, [form]);

	function validate(formData, errors) {
		const ArrayProp = Object.keys(formData);

		ArrayProp.forEach((item) => {
			let inputJson = findNestedObj(jsonSchema, item);
			if (inputJson.validar === "Rut") {
				let valueForm = formData[item] ? formData[item].replaceAll(".", "") : "";
				if (!Rut.validaRut(valueForm)) errors[item].addError("Rut no válido");
			}
		});
		return errors;
	}

	const transformErrors = (errors) => {
		return errors.map((error) => {
			if (error.name === "required") {
				error.message = "Campo obligatorio, se debe completar";
			}
			return error;
		});
	};

	return (
		<Form
			widgets={{ WidgetAdress, FileWidget, ValidInput }}
			schema={jsonSchema}
			uiSchema={uiSchema}
			onSubmit={handleSubmit}
			onError={log("errors")}
			validate={validate}
			formData={formData}
			transformErrors={transformErrors}
			ErrorList={() => <></>}
			onChange={(e) => setFormData(e.formData)}
			idPrefix={RJSF_PREFIX}
		>
			{loading ? (
				<Box sx={{ display: "flex" }}>
					<CircularProgress />
				</Box>
			) : (
				<button className="MuiButtonBase-root MuiButton-root MuiButton-contained MuiButton-containedPrimary">
					<ArrowForwardIcon />
					Ir al Procedimiento
				</button>
			)}
		</Form>
	);
}
