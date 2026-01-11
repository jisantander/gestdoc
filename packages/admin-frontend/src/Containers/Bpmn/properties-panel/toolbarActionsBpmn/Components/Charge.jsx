import React from "react";
import { TextField } from "@material-ui/core";

export default function Charge(props) {
	const { valueLocal, handleChange, updatePropertie } = props;
	return (
		<>
			<TextField
				className="m-2"
				name="valueCharge"
				id="charge_input"
				label="Valor a cobrar"
				rowsMax="4"
				variant="outlined"
				type="number"
				value={valueLocal.valueCharge}
				onChange={(e) => {
					handleChange(e);
				}}
				onBlur={() => {
					updatePropertie(valueLocal.valueCharge, "charge_value");
				}}
			/>
			<TextField
				InputLabelProps={{
					shrink: true,
				}}
				type="number"
				style={{ width: "200px" }}
				className="m-2"
				name="valueChargeBySign"
				id="charge_input"
				label="Cobro por cada firma"
				helperText="Si llena este campo se multiplicará este valor por el número de firmantes y se añadirá al valor a cobrar"
				rowsMax="4"
				variant="outlined"
				value={valueLocal.valueChargeBySign}
				onChange={(e) => {
					handleChange(e);
				}}
				onBlur={() => {
					updatePropertie(valueLocal.valueChargeBySign, "charge_by_sign");
				}}
			/>
		</>
	);
}
