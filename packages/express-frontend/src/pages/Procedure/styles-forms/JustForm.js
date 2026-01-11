import React from "react";
import "../ProcedureForm.css";
import Form from "@rjsf/material-ui";
import { Grid, Card, CardContent } from "@material-ui/core";
import FileWidget from "../widgetForm/FileWidget";
import Input from "../widgetForm/Input";
import Select from "../widgetForm/Select";
import ValidInput from "../widgetForm/ValidInput";
import CustomCheckbox from "../widgetForm/ CustomCheckbox";

import Date from "../widgetForm/Date";
import Checkboxes from "../widgetForm/Checkboxes";
import WidgetAdress from "../widgetForm/WidgetAdress";
import Header from "./Header";
import { findNestedObj, transformErrors } from "./utils";
import { rutValidate } from "rut-helpers";

import "../widgetForm/Customcss.css";
import "../widgetForm/Input.css";
import "../widgetForm/label.css";
import "../widgetForm/Popover.css";
import "../widgetForm/Select.css";

export default function JustForm({
  documento,
  jsonSchema,
  uiSchema,
  handleSubmit,
  log,
  formData,
  setFormData,
  RJSF_PREFIX,
  focusHandler,
  handleBack,
  canGoBack,
}) {
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
      <Header documento={documento} />
      <Grid id="center-form" container direction="row" justify="center" alignItems="center">
        <Grid item xl={4} md={6} style={{ marginTop: "-138px", position: "initial", minWidth: "50%" }}>
          <Card
            className="mb-5 card-box card-box-border-bottom border-success justForm"
            style={{ borderRadius: "25px" }}
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
                validate={validate}
                uiSchema={uiSchema}
                onSubmit={handleSubmit}
                onError={log("errors")}
                formData={formData}
                onChange={(e) => setFormData(e.formData)}
                idPrefix={RJSF_PREFIX}
                onFocus={focusHandler}
                transformErrors={transformErrors}
                ErrorList={() => <></>}
              >
                <div className="contentCotinue">
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                    }}
                  >
                    {canGoBack && (
                      <button class="ContinueForm" type="button" onClick={handleBack}>
                        Retroceder
                      </button>
                    )}
                    <button class="ContinueForm" type="submit">
                      Continuar
                    </button>
                  </div>
                </div>
              </Form>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </>
  );
}
