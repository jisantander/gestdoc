import React from "react";
import Popover from "./Popover";

import TextField from "@material-ui/core/TextField";

const TextWidget = ({
  id,
  placeholder,
  required,
  readonly,
  disabled,
  type,
  label,
  value,
  onChange,
  onBlur,
  onFocus,
  autofocus,
  options,
  schema,
  uiSchema,
  rawErrors = [],
  formContext,
  registry, // pull out the registry so it doesn't end up in the textFieldProps
  ...textFieldProps
}) => {
  const _onChange = ({ target: { value } }) => onChange(value === "" ? options.emptyValue : value);
  const _onBlur = ({ target: { value } }) => onBlur(id, value);
  const _onFocus = ({ target: { value } }) => onFocus(id, value);

  const inputType = (type || schema.type) === "string" ? "text" : `${type || schema.type}`;

  return (
    <>
      <div>
        <label className="label_gestdoc" style={{ display: "inline-flex" }}>
          {" "}
          {label} {required && <span style={{ fontSize: 13 }}>*</span>}
          {options?.help && <Popover msg={options.help} title={label} />}
        </label>
      </div>
      <TextField
        className="input_date"
        id={id}
        placeholder={placeholder}
        autoFocus={autofocus}
        required={required}
        disabled={disabled || readonly}
        type={inputType}
        value={value || value === 0 ? value : ""}
        error={rawErrors.length > 0}
        onChange={_onChange}
        onBlur={_onBlur}
        onFocus={_onFocus}
        {...textFieldProps}
      />
    </>
  );
};

export default TextWidget;
