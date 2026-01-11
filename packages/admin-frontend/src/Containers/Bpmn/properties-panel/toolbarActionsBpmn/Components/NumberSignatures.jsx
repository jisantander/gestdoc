import React from "react";
import { TextField, MenuItem } from "@material-ui/core";

export default function NumberSignatures(props) {
	const { valueLocal, handleChange, updatePropertie } = props;
	return (
		<>
			<TextField
				className="m-2"
				id="standard-select-request_signature"
				name="valueNumSign"
				select
				label="Cantidad solicitada"
				value={valueLocal.valueNumSign}
				onChange={(e) => {
					handleChange(e);
					updatePropertie(e.target.value, "num_sign");
				}}
				helperText="Defina cuantas personas van a firmar"
				variant="outlined"
			>
				{[
					{
						_id: "n_participans",
						_title: "Según cantidad de participantes",
					},
					{
						_id: "user_choose",
						_title: "El usuario elije cuantos firman",
					},
					{ _id: "fixed", _title: "Definir un número fijo" },
				].map((option) => (
					<MenuItem key={option._id} value={option._id}>
						{option._title}
					</MenuItem>
				))}
			</TextField>
			{valueLocal.valueNumSign === "fixed" && (
				<TextField
					className="m-2"
					id="outlined-multiline-fixed"
					label="Número de firmantes"
					name="valueFixedSign"
					multiline
					rowsMax="4"
					variant="outlined"
					value={valueLocal.valueFixedSign || ""}
					onChange={(e) => {
						handleChange(e);
					}}
					onBlur={() => {
						updatePropertie(valueLocal.valueFixedSign, "fixed_sign");
					}}
				/>
			)}
		</>
	);
}
