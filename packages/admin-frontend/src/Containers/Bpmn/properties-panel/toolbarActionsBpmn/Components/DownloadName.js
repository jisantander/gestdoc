import React from "react";
import { TextField } from "@material-ui/core";

export default function DownloadName(props) {
	const { valueLocal, handleChange, updatePropertie } = props;
	return (
		<>
			<TextField
				InputLabelProps={{
					shrink: true,
				}}
				type="text"
				style={{ width: "500px" }}
				className="m-2"
				name="valueDownloadName"
				id="download_name_input"
				label="Nombre de descarga"
				helperText="Este campo acepta variables de los formularios, encerradas entre llaves: {demandante_rut_id}"
				rowsMax="4"
				variant="outlined"
				value={valueLocal.valueDownloadName}
				onChange={(e) => {
					handleChange(e);
				}}
				onBlur={() => {
					updatePropertie(valueLocal.valueDownloadName, "download_name");
				}}
			/>
		</>
	);
}
