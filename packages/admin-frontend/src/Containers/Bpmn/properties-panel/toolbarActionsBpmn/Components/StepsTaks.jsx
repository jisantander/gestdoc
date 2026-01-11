import React from "react";
import { TextField, MenuItem } from "@material-ui/core";

export default function StepsTaks(props) {
	const { valueLocal, handleChange, updatePropertie, listStages } = props;
	return (
		<TextField
			className="m-2"
			id="standard-select-form"
			name="stage"
			select
			label="Etapa"
			value={valueLocal.stage}
			onChange={(e) => {
				handleChange(e);
				updatePropertie(e.target.value, "stage");
			}}
			helperText="Puede adjuntar su tarea a una etapa"
			variant="outlined"
		>
			{listStages.map((option) => (
				<MenuItem key={option.id} value={option.name}>
					{option.name}
				</MenuItem>
			))}
		</TextField>
	);
}
