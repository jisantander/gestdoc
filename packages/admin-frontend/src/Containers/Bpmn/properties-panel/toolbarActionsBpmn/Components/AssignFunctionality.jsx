import React from "react";
import { TextField, MenuItem } from "@material-ui/core";

export default function AssignFunctionality(props) {
	const { valueLocal, handleChange, updatePropertie, allActionsTask } = props;
	return (
		<TextField
			className="m-2"
			id="standard-select-currentAction"
			select
			name="currentAction"
			label="Funcionalidad"
			value={valueLocal.currentAction}
			onChange={(e) => {
				handleChange(e);
				updatePropertie(e.target.value, "functions");
			}}
			helperText="Asigne una funcionalidad a la tarea"
			variant="outlined"
		>
			{allActionsTask.map((option) => (
				<MenuItem key={option.value} value={option.value}>
					{option.label}
				</MenuItem>
			))}
		</TextField>
	);
}
