import React from "react";
import { TextField } from "@material-ui/core";

export default function InsertSite({ valueLocal, handleChange, updatePropertie }) {
	return (
		<TextField
			className="m-2"
			name="valueUrlInserSite"
			id="insert_site"
			label="Ingrese URL a embeber"
			variant="outlined"
			value={valueLocal.valueUrlInserSite}
			onChange={(e) => {
				handleChange(e);
			}}
			onBlur={() => {
				updatePropertie(valueLocal.valueUrlInserSite, "insert_site");
			}}
		/>
	);
}
