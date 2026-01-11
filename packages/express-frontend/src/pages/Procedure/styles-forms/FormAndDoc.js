import React from "react";
import "../ProcedureForm.css";
import "./FromAndDoc.css";
import Form from "@rjsf/material-ui";
import { Card, CardContent } from "@material-ui/core";
import MuiAlert from "@material-ui/lab/Alert";

import FileWidget from "../widgetForm/FileWidget";
import Input from "../widgetForm/Input";
import Select from "../widgetForm/Select";
import ValidInput from "../widgetForm/ValidInput";
import CustomCheckbox from "../widgetForm/ CustomCheckbox";

import Date from "../widgetForm/Date";
import Checkboxes from "../widgetForm/Checkboxes";
import Header from "./Header";
import WidgetAdress from "../widgetForm/WidgetAdress";
import { findNestedObj, transformErrors } from "./utils";
import { rutValidate } from "rut-helpers";

import "../widgetForm/Customcss.css";
import "../widgetForm/Input.css";
import "../widgetForm/label.css";
import "../widgetForm/Popover.css";
import "../widgetForm/Select.css";

export default function FromAndDoc({
  documento,
  jsonSchema,
  uiSchema,
  handleSubmit,
  log,
  formData,
  setFormData,
  RJSF_PREFIX,
  focusHandler,
  highlightText,
  clickHandler,
  htmlForm,
  handleBack,
  canGoBack,
}) {
  function Alert(props) {
    return <MuiAlert elevation={6} variant="filled" {...props} />;
  }

  function validate(formData, errors) {
    const ArrayProp = Object.keys(formData);

    ArrayProp.forEach((item) => {
      let inputJson = findNestedObj(jsonSchema, item);
      if (inputJson?.validar === "Rut") {
        let valueForm = formData[item] ? formData[item].replaceAll(".", "") : "";
        if (!rutValidate(valueForm)) errors[item].addError("Rut no válido");
      }
    });
    return errors;
  }

  return (
    <>
      <Header documento={documento} position={"center"} />
      <div
        class="grid-container formanddoc"
        style={{
          backgroundColor: " transparent",
          padding: "54px",
          position: "relative",
          marginTop: "-180px",
        }}
      >
        <div class="form">
          <Card
            className="mb-5 card-box card-box-border-bottom border-success"
            style={{ borderRadius: "25px", backgroundColor: "#002BFF", position: "sticky", top: "0" }}
          >
            <CardContent style={{ paddingLeft: "50px", paddingRight: "50px" }}>
              <Form
                widgets={{
                  SelectWidget: Select,
                  TextWidget: Input,
                  WidgetAdress: WidgetAdress,
                  FileWidget: FileWidget,
                  CheckboxWidget: CustomCheckbox,
                  ValidInput: ValidInput,
                  CheckboxesWidget: Checkboxes,
                  DateWidget: Date,
                }}
                schema={jsonSchema}
                uiSchema={uiSchema}
                onSubmit={handleSubmit}
                onError={log("errors")}
                formData={formData}
                validate={validate}
                transformErrors={transformErrors}
                ErrorList={() => <></>}
                onChange={(e) => {
                  setFormData(e.formData);
                }}
                idPrefix={RJSF_PREFIX}
                onFocus={focusHandler}
              >
                <div>
                  <hr
                    style={{ backgroundColor: "rgb(255 255 255 / 92%)", height: "2px", marginTop: "10px" }}
                    class="MuiDivider-root"
                  ></hr>
                  <div
                    className="buttons-forms"
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                    }}
                  >
                    {canGoBack && (
                      <button className="ContinueForm" type="button" onClick={handleBack}>
                        Retroceder
                      </button>
                    )}
                    <button className="ContinueForm" type="submit">
                      Continuar
                    </button>
                  </div>
                </div>
              </Form>
            </CardContent>
          </Card>
        </div>
        <div className="text">
          <Card
            style={{
              borderRadius: "25px",
              minWidth: "918px !important",
              position: "sticky",
              top: "0",
            }}
            className="mb-5 card-box card-box-border-bottom border-danger sectionDoc left-card"
          >
            {highlightText !== "" && <Alert severity="info">{highlightText}</Alert>}
            <CardContent
              style={{
                minWidth: "918px !important",
              }}
            >
              <div
                style={{
                  minWidth: "918px !important",
                }}
                onClick={clickHandler}
                dangerouslySetInnerHTML={{ __html: htmlForm }}
              />
            </CardContent>
          </Card>
        </div>
      </div>
    </>
  );
}
