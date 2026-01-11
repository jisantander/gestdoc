import React, { useState } from "react";
import { useParams } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { Card, Button, Grid, CardContent, TextField } from "@material-ui/core";
import isEmail from "../../../utils/isEmail";
import Header from "../styles-forms/Header";
import SendIcon from "@material-ui/icons/Send";
import ArrowBackIcon from "@material-ui/icons/ArrowBack";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import DialogTitle from "@material-ui/core/DialogTitle";

import axios from "../../../utils/axios";
import { getDocumento } from "../../../reducers/documento";
import useNotification from "../../../hooks/useNotification";
import "./style.css";

export default function ProcedureParticipants({ canGoBack, handleBack }) {
  const dispatch = useDispatch();
  const [openNotification, Notification] = useNotification();
  const { transaction, participant } = useParams();
  const documento = useSelector(({ documento }) => documento.documento);
  const gestores = useSelector(({ documento }) => documento.gestores);
  const { participants } = useSelector(({ documento }) => documento.documento);

  // eslint-disable-next-line
  const [emails, setEmails] = useState([""]);
  const [show, setShow] = useState(false);
  const [index, setIndex] = useState(0);
  const [form, setForm] = useState({ nombre: "", apellido: "", email: "", rut: "" });

  let participantData = null;
  if (participant && documento) {
    participantData = participants.find((it) => it.id === participant);
  } else if (documento) {
    // eslint-disable-next-line
    participantData = participants[0];
  }
  let participantDataCurrent = null;
  if (participant && documento) {
    participantDataCurrent = gestores.find((it) => it.id === participant);
  } else if (documento) {
    participantDataCurrent = gestores[0];
  }
  const stageEmail = participantDataCurrent.people;
  const signatures = participantDataCurrent.signatures || [];

  const handleEdit = (i) => () => {
    setIndex(i);
    setForm({ ...stageEmail[i] });
    setShow(true);
  };
  const handleInput = (field) => (e) => {
    setForm({ ...form, [field]: e.target.value });
  };
  const handleClose = () => {
    setShow(false);
  };
  const handleMail = async () => {
    try {
      await axios.post(`/api/documento/email/${transaction}`, {
        participant: participantDataCurrent.id,
        ...form,
        old: stageEmail[index].email,
        index,
      });
      handleClose();
      dispatch(getDocumento(transaction));
    } catch (e) {
      console.error(e);
      handleClose();
    }
  };

  const handleNext = async () => {
    const notValid = emails.find((it) => !isEmail(it));
    if (notValid) {
      return alert("Debe ingresar un correo válido");
    }

    setTimeout(() => {
      window.location.reload(1);
    }, 1000);
  };

  return (
    <>
      <Header documento={documento} position={"center"} />
      {Notification}

      <Dialog open={show} onClose={handleClose} aria-labelledby="form-dialog-title">
        <DialogTitle id="form-dialog-title">Modificar correo</DialogTitle>
        <DialogContent>
          <DialogContentText>
            El usuario elegido aún no ha firmado el documento. Podemos enviarle todavía dicha validación a otro correo.
          </DialogContentText>
          <div
            style={{
              paddingTop: "34px",
              display: "block",
              textAlign: "-webkit-center",
              borderStyle: "solid",
              borderRadius: "18px",
              borderWidth: "1px",
              marginTop: "35px",
              borderColor: "#bfbfbf",
            }}
          >
            <div className="text-center" style={{ display: "flex" }}>
              <div style={{ marginBottom: "23px" }}>
                <TextField
                  className="input_gestdocEditSign"
                  onChange={handleInput("email")}
                  value={form.email}
                  label="Email"
                  placeholder="nombre@gmail.com"
                  style={{ margin: "15px" }}
                />

                <TextField
                  className="input_gestdocEditSign"
                  InputLabelProps={{
                    shrink: true,
                  }}
                  onChange={handleInput("nombre")}
                  value={form.nombre}
                  label="Nombre"
                  placeholder="Juan"
                  style={{ margin: "15px" }}
                />
              </div>
              <div>
                <TextField
                  InputLabelProps={{
                    shrink: true,
                  }}
                  className="input_gestdocEditSign"
                  onChange={handleInput("apellido")}
                  value={form.apellido}
                  label="Apellido"
                  placeholder="Perez"
                  style={{ margin: "15px" }}
                />

                <TextField
                  InputLabelProps={{
                    shrink: true,
                  }}
                  className="input_gestdocEditSign"
                  onChange={handleInput("rut")}
                  value={form.rut}
                  label="Rut"
                  placeholder="19.112.039-7"
                  style={{ margin: "15px" }}
                />
              </div>
            </div>
          </div>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="primary">
            Cancelar
          </Button>
          <Button onClick={handleMail} color="primary">
            Modificar correo
          </Button>
        </DialogActions>
      </Dialog>

      <Grid id="center-form" container direction="column" justify="center" alignItems="center">
        <Grid item xl={4} md={6} style={{ marginTop: "-138px", position: "initial", minWidth: "50%" }}>
          <Card
            className="mb-5 card-box card-box-border-bottom border-success justForm"
            style={{ borderRadius: "25px" }}
          >
            <CardContent style={{ paddingLeft: "50px", paddingRight: "50px" }}>
              {stageEmail && (
                <div>
                  <span>
                    Hemos enviado las invitaciones para firma solicitadas. Por favor revise su correo, el tramite
                    continua desde ahí
                  </span>
                  <ul id="sign_advance_ul_li">
                    {stageEmail.map((it, i) => (
                      <li key={i}>
                        <div>
                          <div>{it.email}</div>
                          <div>
                            {it.nombre} {it.apellido}
                          </div>
                          <div>Rut: {it.rut} </div>

                          <div>
                            {signatures.findIndex((it2) => it2.run === it.rut) === -1 ? (
                              <Button
                                variant="contained"
                                color="primary"
                                style={{ display: "flex", float: "inherit" }}
                                onClick={handleEdit(i)}
                              >
                                Editar
                              </Button>
                            ) : (
                              <kbd>Ya firmo!</kbd>
                            )}
                          </div>
                        </div>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </CardContent>
          </Card>

          {stageEmail ? (
            <div className="card-footer p-4" style={{ display: "flex", justifyContent: "center" }}>
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
                style={{ marginTop: "25px", backgroundColor: "#2e67fb", borderRadius: "24px" }}
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
