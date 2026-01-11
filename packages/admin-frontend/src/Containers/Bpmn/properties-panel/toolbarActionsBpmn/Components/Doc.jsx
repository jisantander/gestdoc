import React from "react";
import { TextField, MenuItem } from "@material-ui/core";
import AutocompleteControl from "utils/AutocompleteControl";

export default function Doc(props) {
	const { defaultValueAutocomplete, valueLocal, handleChangeAutocomplete, handleChange, updatePropertie, docs } =
		props;
	return (
		<>
			<AutocompleteControl
				options={docs}
				defaultValue={defaultValueAutocomplete(docs, valueLocal.valueDoc)}
				cbChange={(value) => {
					if (value) {
						handleChangeAutocomplete("valueForm", value._id);
						updatePropertie(value._id, "doc");
					}
				}}
				label={"Documento"}
			/>
			<TextField
				style={{ minWidth: 100 }}
				select
				label="Tipo de revisión"
				name="valueDocType"
				value={valueLocal.valueDocType !== "" ? valueLocal.valueDocType : "simple"}
				onChange={(e) => {
					handleChange(e);
					updatePropertie(e.target.value, "doc_type");
				}}
				helperText=""
				variant="outlined"
			>
				<MenuItem value="simple">Simple</MenuItem>
				<MenuItem value="advanced">Avanzada</MenuItem>
			</TextField>
		</>
	);
}
