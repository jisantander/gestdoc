import React from "react";
import Popover from "./Popover";
const Select = (props) => {
  const [value, setValue] = React.useState(props?.value ? props.value : "");

  const handleChange = (event) => {
    setValue(event.target.value);
    props.onChange(event.target.value);
  };

  const { id, required, options, placeholder, label } = props;

  return (
    <>
      <label style={{ display: "inline-flex" }}>
        {label} {required && <span style={{ fontSize: 13 }}>*</span>}
        {options?.help && <Popover msg={options.help} title={label} />}
      </label>
      <select
        id={id}
        required={required}
        onChange={handleChange}
        value={value}
        className={value ? "" : "no-selected-yet"}
      >
        <option readOnly="true" value="" hidden disabled selected>
          {placeholder ? placeholder : ""}
        </option>
        {options.enumOptions.map((option) => {
          return (
            <option style={{ color: "black" }} key={option.value} value={option.value}>
              {option.label}
            </option>
          );
        })}
      </select>
    </>
  );
};

export default Select;
