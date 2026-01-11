import React from "react";

import Popover from "./Popover";
import FormLabel from "@material-ui/core/FormLabel";
import FormGroup from "@material-ui/core/FormGroup";
import FormControlLabel from "@material-ui/core/FormControlLabel";

const selectValue = (value, selected, all) => {
  const at = all.indexOf(value);
  const updated = selected.slice(0, at).concat(value, selected.slice(at));

  // As inserting values at predefined index positions doesn't work with empty
  // arrays, we need to reorder the updated selection to match the initial order
  return updated.sort((a, b) => all.indexOf(a) > all.indexOf(b));
};

const deselectValue = (value, selected) => {
  return selected.filter((v) => v !== value);
};

const CheckboxesWidget = ({
  schema,
  label,
  id,
  disabled,
  options,
  value,
  autofocus,
  readonly,
  required,
  onChange,
  onBlur,
  onFocus,
}) => {
  const { enumOptions, enumDisabled, inline } = options;

  const _onChange =
    (option) =>
    ({ target: { checked } }) => {
      const all = enumOptions.map(({ value }) => value);

      if (checked) {
        onChange(selectValue(option.value, value, all));
      } else {
        onChange(deselectValue(option.value, value));
      }
    };

  const _onBlur = ({ target: { value } }) => onBlur(id, value);
  const _onFocus = ({ target: { value } }) => onFocus(id, value);

  return (
    <>
      <FormLabel required={required} htmlFor={id}>
        <div style={{ display: "inline-flex" }}>
          {label || schema.title}
          <div style={{ marginLeft: 5, marginTop: -2 }}>
            {required && <span style={{ fontSize: 13 }}>*</span>}
            {options?.help && <Popover msg={options.help} title={label} />}
          </div>
        </div>
      </FormLabel>
      <FormGroup row={!!inline}>
        {enumOptions.map((option, index) => {
          const checked = value.indexOf(option.value) !== -1;
          const itemDisabled = enumDisabled && enumDisabled.indexOf(option.value) !== -1;
          const checkbox = (
            <input
              disabled={disabled || itemDisabled || readonly}
              autoFocus={autofocus && index === 0}
              id={`${id}_${index}`}
              type="checkbox"
              name="#ejemplo-checkbox"
              checked={checked}
              onBlur={_onBlur}
              onFocus={_onFocus}
              onChange={_onChange(option)}
              onClick={() => _onChange(option)}
            />
          );
          return (
            <FormControlLabel
              style={{ display: "inline-flex", margin: "10px 0px" }}
              control={checkbox}
              key={index}
              label={option.label}
            />
          );
        })}
      </FormGroup>
    </>
  );
};

export default CheckboxesWidget;
