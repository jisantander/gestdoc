import React from "react";
import { TextField } from "@material-ui/core";
export default function NameTask({ element, updateName }) {
	return (
		<TextField
			className="m-2"
			id="outlined-multiline-flexible"
			label="Nombre tarea"
			multiline
			rowsMax="4"
			variant="outlined"
			value={element.businessObject?.name || ""}
			onChange={(event) => {
				updateName(event.target.value);
			}}
		/>
	);
}
