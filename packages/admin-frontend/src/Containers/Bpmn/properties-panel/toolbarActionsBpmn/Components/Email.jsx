import React from "react";

import { TextField, MenuItem } from "@material-ui/core";
export default function Email({ valueLocal, handleChange, updatePropertie, emails }) {
	return (
		<TextField
			className="m-2"
			id="standard-select-email"
			name="valueEmail"
			select
			label="Correo"
			value={valueLocal.valueEmail}
			onChange={(e) => {
				handleChange(e);
				updatePropertie(e.target.value, "email");
			}}
			helperText="Adjunte un correo a la tarea"
			variant="outlined"
		>
			{emails.map((option) => (
				<MenuItem key={option._id} value={option._id}>
					{option._title}
				</MenuItem>
			))}
		</TextField>
	);
}
