import React from "react";
import Popover from "./Popover";

const Input = (props) => {
  const [value, setValue] = React.useState(props?.value ? props.value : "");

  const handleChange = (event) => {
    setValue(event.target.value);
    props.onChange(event.target.value);
  };

  const { id, required, options, placeholder, label } = props;

  return (
    <>
      <label className={"label_gestdoc"}>
        <div style={{ display: "inline-flex" }}>
          {label} {required && <span style={{ fontSize: 13 }}>*</span>}
          {options?.help && <Popover msg={options.help} title={label} />}
        </div>
        <input
          placeholder={placeholder}
          className="input_gestdoc"
          id={id}
          label={label}
          variant="standard"
          value={value}
          required={props.required}
          onChange={handleChange}
          type="text"
        />
      </label>
    </>
  );
};

export default Input;
