import React from "react";
import { TextField } from "@material-ui/core";

export default function DeadLine(props) {
	function isNumber(n) {
		return /^-?[\d.]+(?:e-?\d+)?$/.test(n);
	}
	const { valueLocal, handleChange, updatePropertie } = props;
	return (
		<TextField
			className="m-2"
			id="outlined-multiline-flexible"
			label="Días que tomará esta tarea"
			name="deadLine"
			helperText="Desde lo que sera la fecha de incio"
			type="number"
			multiline
			rowsMax="4"
			variant="outlined"
			InputLabelProps={{
				shrink: true,
			}}
			value={valueLocal.deadLine || ""}
			onChange={(e) => {
				console.log("e.target.value", e.target.value);
				if (isNumber(e.target.value) || e.target.value === "") {
					handleChange(e);
				}
			}}
			onBlur={() => {
				updatePropertie(valueLocal.deadLine, "days");
			}}
		/>
	);
}
