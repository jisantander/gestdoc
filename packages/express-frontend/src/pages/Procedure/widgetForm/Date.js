import React from "react";
import TextWidget from "./TextWidget";

const DateWidget = (props) => {
  return (
    <TextWidget
      type="date"
      InputLabelProps={{
        shrink: true,
      }}
      {...props}
    />
  );
};

export default DateWidget;
