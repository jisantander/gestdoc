import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { Table, Card, Button, /*TextField,*/ Grid, CardContent /*, InputAdornment*/ } from "@material-ui/core";
import { setNextStage } from "../../reducers/documento";
import isEmail from "../../utils/isEmail";
import Header from "./styles-forms/Header";
import Note from "./styles-forms/Note";
/*import Close from '@material-ui/icons/Close';
import IconButton from '@material-ui/core/IconButton';*/
import Add from "@material-ui/icons/Add";
import SendIcon from "@material-ui/icons/Send";
import { rutValidate } from "rut-helpers";
import UserChoose from "./ProceduresRequests/UserChoose";
import ArrowBackIcon from "@material-ui/icons/ArrowBack";
import { RESERVED_EMAIL_FIELD } from "../../utils/constants";
import useNotification from "../../hooks/useNotification";

export default function ProcedureRequest({ canGoBack, handleBack }) {
  const dispatch = useDispatch();
  const [openNotification, Notification] = useNotification();

  const { transaction, participant } = useParams();
  const documento = useSelector(({ documento }) => documento.documento);
  const completeReduxDoc = useSelector(({ documento }) => documento);
  const gestores = useSelector(({ documento }) => documento.gestores);
  const { participants } = useSelector(({ documento }) => documento.documento);

  const [emails, setEmails] = useState([""]);
  const [nombres, setNombres] = useState([""]);
  const [apellidos, setApellidos] = useState([""]);
  const [apmats, setApmats] = useState([""]);
  const [ruts, setRuts] = useState([""]);

  const [checkEmails, setCheckEmails] = useState(false);

  let participantData = null;
  if (participant && documento) {
    participantData = participants.find((it) => it.id === participant);
  } else if (documento) {
    participantData = participants[0];
  }
  let participantDataCurrent = null;
  var docCurrent = null;
  if (participant && documento) {
    docCurrent = documento.participants.find((it) => it.id === participant);
    participantDataCurrent = gestores.find((it) => it.id === participant);
  } else if (documento) {
    participantDataCurrent = gestores[0];
    docCurrent = documento.participants[0];
  }

  // eslint-disable-next-line
  const [stageEmail, setStageEmail] = useState(participantDataCurrent.history[participantData.next.id]);

  useEffect(() => {
    if (participantDataCurrent) {
      if (docCurrent.next["custom:num_sign"] === "user_choose") {
        const newMails = [];
        for (const property in participantDataCurrent.form) {
          if (property.includes(RESERVED_EMAIL_FIELD) || property.includes("email")) {
            newMails.push(participantDataCurrent.form[property]);
          }
        }
        setEmails(newMails);
        goOverEmails(newMails);
      }
    }
    try {
      setRuts([]);
      setNombres([]);
      setApellidos([]);
      for (const property in participantDataCurrent.form) {
        let value = participantDataCurrent.form[property];
        if (property.includes("correo")) {
          setEmails((oldArray) => [...oldArray, value]);
        }
        if (property.includes("apellido")) {
          setApellidos((oldArray) => [...oldArray, value]);
        }
        if (property.includes("nombre_id")) {
          setNombres((oldArray) => [...oldArray, value]);
        }
        if (property.includes("rut")) {
          if (value !== "true" && value !== "false") {
            setRuts((oldArray) => [...oldArray, value]);
          }
        }
      }
    } catch (error) {
      console.error(error);
    }

    try {
      if (docCurrent.next["custom:num_sign"] === "fixed") {
        setEmails([]);
        setEmails(Array.from(Array(parseInt(docCurrent.next["custom:fixed_sign"])), (_, x) => ""));
      }
    } catch (error) {
      console.error(error);
    }
    // eslint-disable-next-line
  }, []);

  const goOverEmails = (formsEmails) => {
    try {
      if (!completeReduxDoc?.oldReviews || completeReduxDoc?.oldReviews.length === 0) {
        setCheckEmails(false);
      }
      const dobleCheckEmails = completeReduxDoc.oldReviews.map((item) => item.email);
      let uniqueEmails = [...new Set(dobleCheckEmails)];

      const result = JSON.stringify(uniqueEmails.sort()) === JSON.stringify([...formsEmails].sort());
      setCheckEmails(!result);
    } catch (error) {}
  };

  const handleAdd = () => {
    const newEmails = [...emails];
    newEmails.push("");
    setEmails(newEmails);
  };

  const handleRemove = (i) => () => {
    const newEmails = emails.filter((it, ind) => i !== ind);
    setEmails(newEmails);
  };

  const handleEmail = (i) => (e) => {
    const newEmails = [...emails];
    newEmails[i] = e.target.value;
    setEmails(newEmails);
  };

  const handleNombres = (i) => (e) => {
    const newDatas = [...nombres];
    newDatas[i] = e.target.value;
    setNombres(newDatas);
  };
  const handleApellidos = (i, data, setData) => (e) => {
    const newDatas = [...apellidos];
    newDatas[i] = e.target.value;
    setApellidos(newDatas);
  };
  const handleApmats = (i, data, setData) => (e) => {
    const newDatas = [...apmats];
    newDatas[i] = e.target.value;
    setApmats(newDatas);
  };
  const handleRuts = (i, data, setData) => (e) => {
    const newDatas = [...ruts];
    newDatas[i] = e.target.value;
    setRuts(newDatas);
  };

  const handleNext = async () => {
    let notValid = emails.find((it) => !isEmail(it));
    if (notValid) {
      return alert("Debe ingresar un correo válido");
    }

    notValid = ruts.find((it) => {
      return rutValidate(it);
    });
    if (!notValid) {
      return alert("Debe ingresar un Rut válido");
    }

    notValid = nombres.find((it) => it.trim() === "");
    if (notValid === "") {
      return alert("Debe ingresar un Nombre");
    }

    notValid = apellidos.find((it) => it.trim() === "");
    if (notValid === "") {
      return alert("Debe ingresar un Apellido");
    }

    //setStageEmail(emails)

    var people = [];
    const finalEmails = [];
    for (let i = 0; i < emails.length; i++) {
      if (emails[i] !== "") {
        finalEmails.push(emails[i]);
        people.push({
          email: emails[i],
          nombre: nombres[i],
          apellido: apellidos[i],
          apmat: apmats[i],
          rut: ruts[i],
        });
      }
    }

    dispatch(
      setNextStage(transaction, participantDataCurrent.current, {
        type: "request_signature",
        titleStage: participantData.next.name,
        notification: participantData.next["custom:notification"] === "true",
        emails: finalEmails,
        people,
      })
    );
    setTimeout(() => {
      window.location.reload(1);
    }, 20000);
  };

  //const stageEmail = participantDataCurrent.history[participantData.next.id];

  return (
    <>
      <Header documento={documento} position={"center"} />
      {Notification}

      <Grid id="center-form" container direction="column" justify="center" alignItems="center">
        <Grid
          item
          xl={4}
          md={6}
          style={{ marginBottom: "50px", marginTop: "-138px", position: "initial", minWidth: "50%" }}
        >
          <Card
            className="mb-5 card-box card-box-border-bottom border-success justForm"
            style={{ borderRadius: "25px" }}
          >
            <CardContent style={{ paddingLeft: "50px", paddingRight: "50px" }}>
              {stageEmail ? (
                <div>
                  <span>
                    Hemos enviado las invitaciones para firma solicitadas. Por favor revise su correo, el tramite
                    continua desde ahí
                  </span>
                  <ul>
                    {stageEmail.emails.map((it, i) => (
                      <li key={i}>{it}</li>
                    ))}
                  </ul>
                </div>
              ) : (
                <>
                  <h2 style={{ color: "#322971" }}> Envío de documento para firma electrónica</h2>
                  <Table className="table table-striped table-borderless text-nowrap mb-0">
                    <thead className="bg-white font-size-sm text-uppercase">
                      <tr>
                        <th
                          className="bg-white text-center"
                          style={{ textAlign: "left", color: "#4d7afc ", fontSize: "x-large" }}
                        >
                          Correos de quienes participan en la firma
                        </th>
                      </tr>
                    </thead>
                    {checkEmails && (
                      <>
                        <p style={{ color: "red" }}>
                          * Hemos identificado algunas posibles diferencias entre los correos de la etapa de revisión de
                          documentos y los correos pre rellenados en esta etapa. Por favor revise bien que los correos
                          esten bien escritos.
                        </p>
                      </>
                    )}
                    <UserChoose
                      emails={emails}
                      nombres={nombres}
                      apellidos={apellidos}
                      apmats={apmats}
                      ruts={ruts}
                      handleEmail={handleEmail}
                      handleNombres={handleNombres}
                      handleApellidos={handleApellidos}
                      handleApmats={handleApmats}
                      handleRuts={handleRuts}
                      handleRemove={handleRemove}
                    />
                  </Table>

                  <Grid container direction="column" justify="center" alignItems="center">
                    {docCurrent.next["custom:num_sign"] === "user_choose" && (
                      <Grid item xl={12}>
                        <Button
                          style={{
                            marginTop: "28px",
                            backgroundColor: "#2e67fb",
                            borderRadius: "24px",
                            padding: "20px",
                          }}
                          endIcon={<Add />}
                          variant="contained"
                          color="primary"
                          onClick={handleAdd}
                        >
                          Agregar Firmante
                        </Button>
                      </Grid>
                    )}

                    <Grid item>
                      <Note txt={"A cada correo le llegará el documento para poder firmarlo"} />
                    </Grid>
                  </Grid>
                </>
              )}
            </CardContent>
          </Card>

          {stageEmail ? (
            <div className="card-footer p-4" style={{ display: "flex", justifyContent: "space-between" }}>
              {!canGoBack && (
                <Button
                  style={{ marginTop: "25px", backgroundColor: "#2e67fb", borderRadius: "24px", padding: "20px" }}
                  endIcon={<ArrowBackIcon />}
                  variant="contained"
                  color="primary"
                  onClick={handleBack}
                >
                  Retroceder
                </Button>
              )}
            </div>
          ) : (
            <div className="card-footer p-4" style={{ display: "flex", justifyContent: "space-between" }}>
              {canGoBack && (
                <Button
                  style={{ marginTop: "25px", backgroundColor: "#2e67fb", borderRadius: "24px", padding: "20px" }}
                  endIcon={<ArrowBackIcon />}
                  variant="contained"
                  color="primary"
                  onClick={handleBack}
                >
                  Retroceder
                </Button>
              )}
              <Button
                style={{ marginTop: "25px", backgroundColor: "#2e67fb", borderRadius: "24px", padding: "20px" }}
                endIcon={<SendIcon />}
                variant="contained"
                color="primary"
                onClick={handleNext}
              >
                Continuar
              </Button>
            </div>
          )}
        </Grid>
      </Grid>
    </>
  );
}
