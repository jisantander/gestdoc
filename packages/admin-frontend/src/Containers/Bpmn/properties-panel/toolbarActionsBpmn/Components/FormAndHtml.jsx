import React from "react";
import { TextField, MenuItem } from "@material-ui/core";
//import AutocompleteControl from 'utils/AutocompleteControl';
import FormSelector from "../../../../../layout-components/FormSelector/index";

export default function FormAndHtml(props) {
	const {
		form,
		defaultValueAutocomplete,
		valueLocal,
		handleChangeAutocomplete,
		updatePropertie,
		handleChange,
		htmls,
	} = props;
	if (form === undefined || htmls === undefined) {
		return null;
	}
	return (
		<>
			{/*<AutocompleteControl
				options={form}
				defaultValue={defaultValueAutocomplete(form, valueLocal.valueForm)}
				cbChange={(value) => {
					if (value) {
						handleChangeAutocomplete('valueForm', value._id);
						updatePropertie(value._id, 'form');
					}
				}}
				label={'Formulario'}
			/>*/}

			{form.forms && (
				<FormSelector
					formsData={form}
					value={defaultValueAutocomplete(form.forms, valueLocal.valueForm)}
					onChange={(value) => {
						handleChangeAutocomplete("valueForm", value);
						updatePropertie(value, "form");
					}}
				/>
			)}

			{htmls.length > 0 && (
				<TextField
					className="m-2"
					id="standard-select-form"
					name="valueHtmls"
					select
					label="Plantilla HTML"
					value={valueLocal.valueHtmls}
					onChange={(e) => {
						handleChange(e);
						updatePropertie(e.target.value, "html");
					}}
					helperText="Adjunte un formulario a la tarea"
					variant="outlined"
				>
					{props.htmls.map((option) => (
						<MenuItem key={option._id} value={option._id}>
							{option._title}
						</MenuItem>
					))}
				</TextField>
			)}
		</>
	);
}
