import React from "react";
import TextField from "@material-ui/core/TextField";

const applyUpperCase = (sentence) => {
	return sentence
		.split(" ")
		.map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
		.join(" ");
};

const ValidInput = (props) => {
	console.log("propspropsprops", props);
	const [value, setValue] = React.useState("");

	const handleChange = (event) => {
		//revisar reglas a aplicar de formateo.
		const value = event.target.value;
		switch (props.schema.validar) {
			case "Solo Numeros":
				const finalValue = value.replace(/[^0-9.,]+/g, "");
				setValue(finalValue);
				props.onChange(finalValue);
				break;
			default:
				setValue(value);
				props.onChange(value);
				break;
		}
	};

	const handleBlur = (event) => {
		console.log("on Blur", event);
		//verificar aplicar de formateo
		switch (props.schema.validar) {
			case "Primeras en Mayuscula":
				//cambiar primeras palabras a mayusculas
				setValue(applyUpperCase(event.target.value));
				props.onChange(applyUpperCase(event.target.value));
				break;
			/*case 'Rut':
				setValue(rutFormat(event.target.value));
				props.onChange(rutFormat(event.target.value));
				break;*/
			case "Solo Numeros":
				const finalValue = event.target.value.replace(/[^0-9.,]+/g, "");
				setValue(finalValue);
				props.onChange(finalValue);
				break;
			default:
				break;
		}
	};

	const {
		id,
		/*readonly,
        multiple,
        disabled,
        autofocus,
        options,*/
		label,
	} = props;

	return (
		<>
			<TextField
				id={id}
				label={label}
				variant="standard"
				value={value}
				required={props.required}
				onChange={handleChange}
				onBlur={handleBlur}
				type="text"
			/>
		</>
	);
};

export default ValidInput;
