import React from "react";
import Popover from "./Popover";
import { rutFormat } from "rut-helpers";

const applyUpperCase = (sentence) => {
  return sentence
    .split(" ")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(" ");
};

const ValidInput = (props) => {
  const [value, setValue] = React.useState(props?.value ? props.value : "");

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
    //verificar aplicar de formateo
    switch (props.schema.validar) {
      case "Primeras en Mayuscula":
        //cambiar primeras palabras a mayusculas
        setValue(applyUpperCase(event.target.value));
        props.onChange(applyUpperCase(event.target.value));
        break;
      case "Rut":
        setValue(rutFormat(event.target.value));
        props.onChange(rutFormat(event.target.value));
        break;
      case "Solo Numeros":
        const finalValue = event.target.value.replace(/[^0-9.,]+/g, "");
        setValue(finalValue);
        props.onChange(finalValue);
        break;
      default:
        console.log("Sin formato");
        break;
    }
  };

  const { id, required, options, placeholder, label, rawErrors } = props;

  return (
    <>
      <label className={"label_gestdoc"}>
        <div style={{ display: "inline-flex" }}>
          {label} {required && <span style={{ fontSize: 13 }}>*</span>}
          {options?.help && <Popover msg={options.help} title={label} />}
        </div>
        <input
          className="input_gestdoc"
          placeholder={placeholder}
          id={id}
          label={label}
          variant="standard"
          value={value}
          required={props.required}
          onChange={handleChange}
          onBlur={handleBlur}
          type="text"
        />
        <span className="error">{rawErrors && rawErrors.join(", ").toString()}</span>
      </label>
    </>
  );
};

export default ValidInput;
