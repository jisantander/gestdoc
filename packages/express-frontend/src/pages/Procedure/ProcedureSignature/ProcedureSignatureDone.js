import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import Form from "@rjsf/material-ui";
import { rutValidate } from "rut-helpers";
import { Grid } from "@material-ui/core";
import Note from "../styles-forms/Note";

import axios from "../../../utils/axios";

import FileWidget from "../widgetForm/FileWidget";
import Input from "../widgetForm/Input";
import Select from "../widgetForm/Select";
import ValidInput from "../widgetForm/ValidInput";
import CustomCheckbox from "../widgetForm/ CustomCheckbox";
import WidgetAdress from "../widgetForm/WidgetAdress";
import Checkboxes from "../widgetForm/Checkboxes";

import { findNestedObj, transformErrors } from "../styles-forms/utils";

const RJSF_PREFIX = "rjsf_prefix";

export default function ProcedureSignatureDone() {
  const { ecert } = useSelector(({ documento }) => documento);
  const { transaction, participant } = useParams();
  const {
    documento: { participants },
  } = useSelector(({ documento }) => documento);
  const { gestores } = useSelector(({ documento }) => documento);
  const [loading, setLoading] = useState(false);
  const [fixform, setFixform] = useState(false);
  const [formData, setFormData] = useState(null);

  let participantData = null;
  let gestorData = null;
  if (participant && participants) {
    participantData = participants.find((it) => it.id === participant);
    gestorData = gestores.find((it) => it.id === participant);
  } else if (participants) {
    participantData = participants[0];
    gestorData = gestores[0];
  }

  useEffect(() => {
    const formToUse = gestorData.form;
    if (participantData.files) {
      participantData.files.forEach((file) => {
        if (formToUse[file.name]) {
          formToUse[file.name] = file.value;
        }
      });
    }
    setFormData(formToUse);
  }, [participantData]);

  const handleSubmit = async () => {
    try {
      setLoading(true);
      await axios.post(`/api/ecert/fixreview`, {
        transaction,
        form: formData,
        activity: participantData.next.id,
        participant: participantData.id,
      });
      setLoading(false);
      window.location.reload();
    } catch (err) {
      setLoading(false);
      console.error(err);
      if (err.response?.data?.message) alert(err.response?.data?.message);
    }
  };

  let properties = {};
  const jsonSchema = {
    title: "Corregir datos",
    properties: {},
  };
  if (fixform) {
    for (var keyH in gestorData.history) {
      if (gestorData.history[keyH].properties) {
        const filterFormHist = gestorData.history[keyH].properties;
        const tmpProperties = { ...properties, ...filterFormHist };
        for (var tmpK in tmpProperties) {
          if (gestorData.form[tmpK]) {
            properties[tmpK] = tmpProperties[tmpK];
          }
        }
      }
    }
    jsonSchema.properties = properties;
  }
  const log = (type) => console.log.bind(console, type);

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

  if (!ecert) return null;
  return (
    <div>
      <h2 style={{ color: "#322971", textAlign: "center" }}>Todos los participantes han firmado con éxito</h2>
      <ul>
        {ecert.map((item, index) => {
          return (
            <li>
              {index + 1}° - {item.email} - {item.nombre} {item.appat} {item.apmat}:{" "}
              {item.accepted ? (
                <span style={{ color: "green" }}>Ya firmó!</span>
              ) : (
                <span style={{ color: "red" }}>Motivo de rechazo: {item.reason}</span>
              )}
            </li>
          );
        })}
      </ul>
      {ecert.some((it) => !it.accepted) && (
        <>
          {fixform ? (
            <div className="justForm">
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
                formData={formData}
                onError={log("errors")}
                validate={validate}
                transformErrors={transformErrors}
                ErrorList={() => <></>}
                idPrefix={RJSF_PREFIX}
                onSubmit={handleSubmit}
                onChange={(e) => {
                  setFormData(e.formData);
                }}
              >
                <br />
                {loading ? (
                  <span>cargando...</span>
                ) : (
                  <button className="ContinueForm" type="submit">
                    Corregir datos
                  </button>
                )}
              </Form>
            </div>
          ) : (
            <button className="ContinueForm" onClick={() => setFixform(true)}>
              Corregir datos de formulario
            </button>
          )}
        </>
      )}
      <Grid item>
        <Note
          txt={
            "El correo para firmar se enviará en el orden que aparece en pantalla y una vez el participante anterior haya firmado."
          }
        />
      </Grid>
    </div>
  );
}
