import React, { useState } from "react";
import { useParams } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { setNextStage } from "../../../reducers/documento";
import { jsonSchema, uiSchema } from "./staticData";

import "../ProcedureReview/index.css";
import JustForm from "../styles-forms/JustForm";

const RJSF_PREFIX = "rjsf_prefix";

export default function ProcedureOdoo({ canGoBack, handleBack }) {
  const dispatch = useDispatch();
  const [formData, setFormData] = useState(null);
  const { transaction, participant } = useParams();
  const documento = useSelector(({ documento }) => documento.documento);
  const gestores = useSelector(({ documento }) => documento.gestores);
  const { participants } = useSelector(({ documento }) => documento.documento);

  let participantData = null;
  if (participant && documento) {
    participantData = participants.find((it) => it.id === participant);
  } else if (documento) {
    participantData = participants[0];
  }
  const docId = participantData.next["custom:doc"];

  const handleNext = async () => {
    let participantDataCurrent = null;
    if (participant && documento) {
      participantDataCurrent = gestores.find((it) => it.id === participant);
    } else if (documento) {
      participantDataCurrent = gestores[0];
    }
    dispatch(
      setNextStage(transaction, participantDataCurrent.current, {
        type: "doc",
        titleStage: participantData.next.name,
        notification: participantData.next["custom:notification"] === "true",
        value: docId,
      })
    );
  };

  const handleSubmit = async () => {
    try {
      let participantDataCurrent = null;
      if (participant && documento) {
        participantDataCurrent = gestores.find((it) => it.id === participant);
      } else if (documento) {
        participantDataCurrent = gestores[0];
      }

      let form_names = {};
      const form_types = {};

      for (const key in jsonSchema.properties) {
        if (jsonSchema.properties.hasOwnProperty(key)) {
          form_names[key] = jsonSchema.properties[key].title;
          form_types[key] = jsonSchema.properties[key].format;
        }
      }

      dispatch(
        setNextStage(transaction, participantDataCurrent.current, {
          type: "get_Info_odoo",
          titleStage: participantData.next.name,
          notification: participantData.next["custom:notification"] === "true",
          form: formData,
          form_names,
          form_types,
          properties: jsonSchema.properties,
        })
      );
    } catch (err) {
      /** */
      console.error("err", err);
    }
  };

  const log = (type) => console.log.bind(console, type);

  return (
    <>
      <JustForm
        documento={documento}
        jsonSchema={jsonSchema}
        uiSchema={uiSchema}
        handleSubmit={handleSubmit}
        formData={formData}
        setFormData={setFormData}
        log={log}
        RJSF_PREFIX={RJSF_PREFIX}
        handleBack={handleBack}
        canGoBack={canGoBack}
      />
    </>
  );
}
