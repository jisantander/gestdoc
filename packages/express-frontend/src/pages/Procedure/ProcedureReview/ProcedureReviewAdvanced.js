import React, { useEffect, useState, useRef } from "react";
import { useParams, useLocation } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { Table, TableHead, TableBody, TableRow, TableCell, TextField } from "@material-ui/core";
import Form from "@rjsf/material-ui";
import { rutValidate } from "rut-helpers";

import axios from "../../../utils/axios";
import isEmail from "../../../utils/isEmail";
import ContainerForm from "./ContainerForm";

import useCountDown from "../../../hooks/useCountDown";

import FileWidget from "../widgetForm/FileWidget";
import Input from "../widgetForm/Input";
import Select from "../widgetForm/Select";
import ValidInput from "../widgetForm/ValidInput";
import CustomCheckbox from "../widgetForm/ CustomCheckbox";
import WidgetAdress from "../widgetForm/WidgetAdress";
import Checkboxes from "../widgetForm/Checkboxes";

import { setReviews, resetReviews } from "../../../reducers/documento";

import { findNestedObj, transformErrors } from "../styles-forms/utils";
import { RESERVED_EMAIL_FIELD } from "../../../utils/constants";
import Header from "../styles-forms/Header";
import CardGestdoc from "components/CardGestdoc";

const RJSF_PREFIX = "rjsf_prefix";

const findDuplicates = (arr) => arr.filter((item, index) => arr.indexOf(item) != index);

export default function ProcedureReviewAdvanced({ canGoBack, handleBack, handleNext, children }) {
  const dispatch = useDispatch();
  const { transaction, participant } = useParams();
  const {
    reviews,
    documento: { participants },
  } = useSelector(({ documento }) => documento);
  const { documento, gestores } = useSelector(({ documento }) => documento);
  const [emails, setEmails] = useState([""]);
  const [loading, setLoading] = useState(false);
  const [reviewing, setReviewing] = useState(false);
  const fixmail = useRef(false);
  const [comment, setComment] = useState("");
  const [reviewValue, setReviewValue] = useState("1");
  const [fixform, setFixform] = useState(false);
  const [formData, setFormData] = useState(null);

  const [counter, start, pause, reset] = useCountDown(120, 1000);

  const location = useLocation();
  const params = new URLSearchParams(location.search);
  const reviewUid = params.get("r");

  let participantData = null;
  let gestorData = null;
  if (participant && participants) {
    participantData = participants.find((it) => it.id === participant);
    gestorData = gestores.find((it) => it.id === participant);
  } else if (participants) {
    participantData = participants[0];
    gestorData = gestores[0];
  }

  const handleAdd = () => {
    setEmails([...emails, ""]);
  };
  const handleRemove = (i) => () => {
    setEmails(emails.filter((it, ind) => i !== ind));
  };
  const handleEmail = (i) => (e) => {
    setEmails(
      emails.map((it, ind) => {
        if (i === ind) return e.target.value;
        else return it;
      })
    );
  };
  const handleAskReview = async () => {
    try {
      if (emails.length === 0) return alert("Debe ingresar al menos un correo.");
      if (!emails.every((it) => isEmail(it))) return alert("Debe ingresar al menos un correo válido.");
      const hasDuplicates = findDuplicates(emails);
      if (hasDuplicates.length > 0) {
        return alert(`Existen correos repetidos: ${hasDuplicates.join(", ")}`);
      }
      setLoading(true);
      await axios.post(`/api/documento/reviews/${transaction}`, { activity: participantData.next.id, emails });
      alert("Los correos de revisión han sido enviados con éxito.");
      setLoading(false);
      window.location.reload();
    } catch (err) {
      setLoading(false);
      console.error(err);
      if (err.response?.data?.message) alert(err.response?.data?.message);
    }
  };
  const handleFixReview = () => {
    setFixform(true);
  };
  const handleReviewValue = (e) => {
    setReviewValue(e.target.value);
  };
  const handleComment = (e) => {
    setComment(e.target.value);
  };
  const handleSendReview = async () => {
    try {
      if (reviewValue === "0" && comment === "")
        return alert("Debe ingresar un comentario de porque se rechaza el documento");
      setLoading(true);
      await axios.post(`/api/documento/review/${transaction}`, {
        uid: reviewUid,
        approved: reviewValue === "1",
        comment,
      });
      setLoading(false);
      window.location.reload();
    } catch (err) {
      setLoading(false);
      console.error(err);
      if (err.response?.data?.message) alert(err.response?.data?.message);
    }
  };
  const handleSubmit = async () => {
    try {
      setLoading(true);
      await axios.post(`/api/documento/fixreview/${transaction}`, {
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
  const handleForceReview = () => {
    getReviews();
  };

  const getReviews = async () => {
    try {
      reset();
      if (fixmail.current) {
        setReviewing(false);
        return false;
      }
      const {
        data: { reviews: newReviews },
      } = await axios.post(`/api/documento/getreview/${transaction}`);
      dispatch(setReviews(newReviews));
      if (newReviews.some((it) => !it.reviewed)) {
        start();
      } else {
        setReviewing(false);
      }
    } catch (err) {
      console.error(err);
      if (err.response?.data?.message) alert(err.response?.data?.message);
    }
  };

  useEffect(() => {
    if (counter === 0) {
      getReviews();
    }
  }, [counter]);
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
    const tmpEmails = [];
    if (gestorData.form) {
      for (const prop in gestorData.form) {
        if (prop.includes(RESERVED_EMAIL_FIELD) || prop.includes("email")) {
          tmpEmails.push(gestorData.form[prop]);
        }
      }
    }
    if (tmpEmails.length > 0) {
      setEmails(tmpEmails);
    }
  }, []);
  useEffect(() => {
    if (!fixmail.current) {
      if (!reviewing) {
        if (reviews.length > 0 && !reviewUid) {
          if (reviews.some((it) => !it.reviewed)) {
            setReviewing(true);
            reset();
            start();
          }
        }
      } else {
        if (reviews.length === 0) {
          fixmail.current = true;
        }
      }
    } else {
      pause();
    }
    if (reviews.length > 0) {
      setEmails(reviews.map((it) => it.email));
    }
  }, [reviews, fixmail]);

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

  let footer = (
    <div className="cardGestdoc">
      <br />
      <p className="title_general">Podrá continuar cuando los participantes hayan dado su aprobación:</p>
      <Table style={{ minWidth: "70vh" }} stripedRows>
        <TableHead>
          <TableRow>
            <TableCell>Correo electrónico</TableCell>
            <TableCell>Estado</TableCell>
            <TableCell>Comentario</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {reviews.map((item) => {
            return (
              <TableRow key={item.uid}>
                <TableCell>{item.email}</TableCell>
                <TableCell>{!item.reviewed ? "Por revisar" : item.approved ? "Aprobado" : "Rechazado"}</TableCell>
                <TableCell>{item.comment}</TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
      <br />
      {!reviews.every((it) => it.reviewed) ? (
        <div
          class="button"
          style={{
            textAlign: "center",
          }}
        >
          <div>
            <p>
              Se revisará nuevamente en <span style={{ color: "green" }}>{counter}</span> segundos.
            </p>
            <p>
              Si desea revisar ahora, de click{" "}
              <a onClick={handleForceReview} style={{ color: "blue", cursor: "pointer" }}>
                aquí
              </a>
            </p>
          </div>
          <br />
          <span style={{ color: "red", fontSize: "16px" }}>
            Si desea cambiar los correos y enviar las invitaciones nuevamente, haga click aquí:
          </span>
          <br />
          <button
            className="ContinueForm"
            style={{ cursor: "pointer" }}
            onClick={() => {
              pause();
              fixmail.current = true;
              dispatch(resetReviews());
            }}
          >
            Modificar los correos
          </button>
        </div>
      ) : (
        <>
          {!reviews.every((it) => it.approved) ? (
            <div
              class="button"
              style={{
                display: "flex",
                justifyContent: "space-between",
              }}
            >
              {fixform ? (
                <>
                  <p style={{ margin: 20 }}>Se ha habilitado la opción de corregir los campos de los formularios. </p>
                  <p style={{ margin: 20 }}>Una vez finalice la correción presione el botón Continuar para volver. </p>
                </>
              ) : (
                <button class="ContinueForm" onClick={handleFixReview}>
                  Comenzar proceso de revisión de documento
                </button>
              )}
            </div>
          ) : (
            <div
              class="button"
              style={{
                display: "flex",
                justifyContent: "space-between",
              }}
            >
              {canGoBack && (
                <button style={{ marginTop: "32px" }} className="ContinueForm" onClick={handleBack}>
                  Retroceder
                </button>
              )}
              <button style={{ marginTop: "32px" }} className="ContinueForm" onClick={handleNext}>
                Seguir con el Trámite
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );

  if (!participants) footer = null;
  if (reviews.length === 0) {
    footer = (
      <div className="cardGestdoc">
        <p>Ingrese los correos de las personas que revisarán el documento previsualizado:</p>
        <Table style={{ minWidth: "70vh" }} stripedRows>
          <TableHead>
            <TableRow>
              <TableCell>#</TableCell>
              <TableCell>Correo electrónico</TableCell>
              <TableCell>
                <button onClick={handleAdd} className="TableButtonReview">
                  Agregar
                </button>
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {emails.map((item, i) => {
              return (
                <TableRow
                  key={i}
                  style={{
                    paddingTop: "34px",
                    textAlign: "-webkit-center",
                    borderStyle: "solid",
                    borderRadius: "18px",
                    borderWidth: "1px",
                    marginTop: "35px",
                    borderColor: "#bfbfbf",
                  }}
                >
                  <TableCell>
                    <kbd>{i + 1}</kbd>
                  </TableCell>
                  <TableCell>
                    <TextField
                      value={emails[i]}
                      onChange={handleEmail(i)}
                      placeholder="nombre@gmail.com"
                      style={{ margin: "15px", width: "450px", border: "1px gray solid", borderRadius: "10px" }}
                    />
                  </TableCell>
                  <TableCell>
                    <button onClick={handleRemove(i)} className="TableButtonReview">
                      Eliminar
                    </button>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
        <div
          class="button"
          style={{
            display: "flex",
            justifyContent: "space-between",
          }}
        >
          {loading ? (
            <span>Enviando al servidor...</span>
          ) : (
            <>
              {canGoBack && (
                <button style={{ marginTop: "32px", cursor: "pointer" }} className="ContinueForm" onClick={handleBack}>
                  Retroceder
                </button>
              )}
              <button
                style={{ marginTop: "32px", cursor: "pointer" }}
                className="ContinueForm"
                onClick={handleAskReview}
              >
                Confirmar correos
              </button>
            </>
          )}
        </div>
      </div>
    );
  }
  if (reviewUid) {
    const currentReview = reviews.find((it) => it.uid === reviewUid);
    if (!currentReview) footer = <span>Revisión inválida</span>;
    else if (currentReview.reviewed)
      return (
        <>
          <Header position={"center"} documento={{ _category: "Revisión", _nameSchema: "Documento" }} />
          <CardGestdoc>
            <p>
              Muchas gracias, le notificaremos al gestor del documento. Una vez todos hayan firmado él podrá continuar
              con el flujo
            </p>
          </CardGestdoc>
        </>
      );
    else
      footer = (
        <div className="cardGestdoc">
          <span>Necesitamos su revisión</span>
          <select
            style={{
              width: "inherit",
            }}
            onChange={handleReviewValue}
            value={reviewValue}
          >
            <option value="1">Aprobar documento</option>
            <option value="0">Rechazar documento</option>
          </select>
          {reviewValue === "0" && (
            <div style={{ marginTop: 15, width: "50%" }}>
              <span>Agregue un comentario respecto a su decisión</span>
              <textarea value={comment} onChange={handleComment}></textarea>
            </div>
          )}
          {loading ? (
            <span>cargando...</span>
          ) : (
            <button class="ContinueForm" onClick={handleSendReview}>
              Enviar revisión
            </button>
          )}
        </div>
      );
  }

  return (
    <ContainerForm documento={documento} footer={footer}>
      {!fixform ? (
        children
      ) : (
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
                Continuar
              </button>
            )}
          </Form>
        </div>
      )}
    </ContainerForm>
  );
}
