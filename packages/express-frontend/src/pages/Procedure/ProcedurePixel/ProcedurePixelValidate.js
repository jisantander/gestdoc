import React, { useState, useEffect } from "react";
import { useLocation, useParams } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import {
  Card,
  Button,
  Dialog,
  DialogActions,
  TextField,
  DialogContent,
  DialogTitle,
  CardContent,
} from "@material-ui/core";

import AssignmentTurnedInOutlinedIcon from "@material-ui/icons/AssignmentTurnedInOutlined";

import Header from "../styles-forms/Header";

import Paper from "@material-ui/core/Paper";
import { setNextStage } from "../../../reducers/documento";
import axios from "../../../utils/axios";

import { StyledObject } from "../styles";

import iconPerson from "../../../default.svg"; // Tell webpack this JS file uses this image

export default function ProcedurePixel({ canGoBack, handleBack }) {
  const dispatch = useDispatch();
  const { transaction, participant } = useParams();
  const location = useLocation();
  const params = new URLSearchParams(location.search);
  const pixel = params.get("p");
  const documento = useSelector(({ documento }) => documento.documento);
  const ecert = useSelector(({ documento }) => documento.ecert);
  const gestores = useSelector(({ documento }) => documento.gestores);
  const { participants } = useSelector(({ documento }) => documento.documento);

  const [valid, setValid] = useState(false);
  const [email, setEmail] = useState("");
  const [open, setOpen] = useState(false);
  const [run, setRun] = useState("");
  const [cedula, setCedula] = useState("");
  const [name, setName] = useState("");
  const [person, setPerson] = useState({});

  const [checkIdentity, setCheckIdentity] = useState(false);

  /*var docIDE = "";
  for (const property in documento.docs) {
    docIDE = property;
  }*/

  let participantData = null;
  if (participant && documento) {
    participantData = participants.find((it) => it.id === participant);
  } else if (documento) {
    participantData = participants[0];
  }
  //REvisar con FaVio
  let docId = participantData.next["custom:doc"]; //Aqui habia un Bug tremendo ya que custom:doc no venia, en cambio venia custom:functions: "signature"
  if (!docId) {
    //docId = docIDE;
    let participantDataCurrent = null;
    if (participant && documento) {
      participantDataCurrent = gestores.find((it) => it.id === participant);
    } else if (documento) {
      participantDataCurrent = gestores[0];
    }
    for (const key in participantDataCurrent.history) {
      if (participantDataCurrent.history[key].type === "doc") {
        docId = participantDataCurrent.history[key].value;
      }
    }
  }

  const handleNext = async () => {
    /*
    if (run === '') {
      return alert('Debe ingresar un RUN válido');
    }
    if (cedula === '') {
      return alert('Debe ingresar una cédula válido');
    }
    if (name === '') {
      return alert('Debe ingresar un nombre válido');
    }
    
    */

    let participantDataCurrent = null;
    if (participant && documento) {
      participantDataCurrent = gestores.find((it) => it.id === participant);
    } else if (documento) {
      participantDataCurrent = gestores[0];
    }

    dispatch(
      setNextStage(transaction, participantDataCurrent.current, {
        type: "signature",
        titleStage: participantData.next.name,
        notification: participantData.next["custom:notification"] === "true",
        value: {
          pixel,
          email,
          run: person.rut,
          name: person.nombre + " " + person.apellido,
        },
      })
    );
  };

  const handleClick = () => {
    if (checkIdentity) {
      //setOpen(true);
      handleNext();
    } else {
      alert("Debe declarar la identidad del firmante");
    }
  };
  const handleClose = () => setOpen(false);
  const handleRun = (e) => setRun(e.target.value);
  const handleCedula = (e) => setCedula(e.target.value);
  const handleName = (e) => setName(e.target.value);

  /*const reladPage = () => {

    setTimeout(function () {
      window.location.reload(1);
    }, 4000);
  }*/

  const handleChange = (event) => {
    setCheckIdentity(event.target.checked);
  };

  const getParticipantDataCurrent = () => {
    let participantDataCurrent = null;
    if (participant && documento) {
      participantDataCurrent = gestores.find((it) => it.id === participant);
    } else if (documento) {
      participantDataCurrent = gestores[0];
    }
    return participantDataCurrent;
  };

  const calculateSignatures = () => {
    //optimizar esto
    let participantDataCurrent = getParticipantDataCurrent();

    let lenghtPeople = participantDataCurrent.people.length;
    let lenghtSignature = participantDataCurrent.signatures.length;
    return ` ${lenghtSignature} / ${lenghtPeople}`;
  };

  let urlPdf = `${window.location.origin}/api/previewDoc/${transaction}/${docId}`;
  if (ecert.length === 0) {
    urlPdf = `${window.location.origin}/api/getdocs/${transaction}/${docId}`;
  }
  //const urlPdf = `${window.location.origin.replace('3000','5000')}/api/previewDoc/${transaction}/${docId}`;
  useEffect(() => {
    const getPixel = async () => {
      try {
        const { data: pixelData } = await axios.get(`/api/pixelc/${pixel}`);

        let participantDataCurrent = null;
        if (participant && documento) {
          participantDataCurrent = gestores.find((it) => it.id === participant);
        } else if (documento) {
          participantDataCurrent = gestores[0];
        }

        for (let i = 0; i < participantDataCurrent.people.length; i++) {
          let element = participantDataCurrent.people[i];
          if (pixelData.email === element.email) {
            setPerson(element);
          }
        }

        setEmail(pixelData.email);
        if (pixelData.finalized) {
          setValid(true);
          //   reladPage();
        }
      } catch (e) {
        console.error(e);
      }
    };
    getPixel();
    // eslint-disable-next-line
  }, [pixel]);

  return (
    <>
      <div className="ProcedureReview">
        <Header documento={documento} position={"center"} />
        <div
          class="grid-container2"
          style={{
            backgroundColor: " transparent",
            padding: "54px",
            marginTop: "-250px",
            width: "auto",
            display: "flex",
            flexFlow: "column",
          }}
        >
          <Card
            style={{
              minHeight: "80vh",
              maxHeight: "80vh",
              borderRadius: "25px",
              minWidth: "918px !important",
              width: "50%",
              alignSelf: "center",
            }}
            className="mb-5 card-box card-box-border-bottom border-danger sectionDoc left-card container2"
          >
            <CardContent
              style={{
                minWidth: "918px !important",
              }}
            >
              <StyledObject data={urlPdf} type="application/pdf" style={{ minWidth: "100%" }}>
                <embed src={urlPdf} type="application/pdf" />
              </StyledObject>
            </CardContent>
          </Card>
          {valid ? (
            <div class="button">
              <div className="center-pixel">
                <p style={{ color: "#251e51" }}>Firmas</p>

                <h1 style={{ color: "#2e67fb" }}> {calculateSignatures()} </h1>

                <p style={{ color: "#251e51" }}>Participantes</p>

                {gestores ? (
                  <>
                    {getParticipantDataCurrent().people.map((person) => (
                      <Paper className={"paper-round"}>
                        <img
                          style={{
                            height: "64px",
                            padding: "3px",
                            paddingRight: "10px",
                          }}
                          src={iconPerson}
                          alt="Logo Gestdoc"
                        />
                        <div>
                          <p style={{ marginTop: "10px", color: "#423869" }}>
                            {person.nombre} {person.apellido}
                          </p>{" "}
                          <p style={{ margin: "0px", marginTop: "-12px", color: "#4468fc" }}>{person.email}</p>
                        </div>
                        <div
                          style={{
                            marginLeft: "auto",
                          }}
                        >
                          {getParticipantDataCurrent().signatures.map((sig) => {
                            if (sig.email === person.email) {
                              return (
                                <div
                                  style={{
                                    marginLeft: "auto",
                                    padding: "20px",
                                  }}
                                >
                                  {" "}
                                  <AssignmentTurnedInOutlinedIcon />{" "}
                                </div>
                              );
                            }
                            return null;
                          })}
                        </div>
                      </Paper>
                    ))}
                  </>
                ) : null}
              </div>
            </div>
          ) : (
            <div class="button" style={{ display: "flex", flexFlow: "column", alignItems: "center" }}>
              {person.email ? (
                <div class="button" style={{ marginTop: "10px" }}>
                  <div class="form__element">
                    <label className="label-Check">
                      <input
                        style={{ marginBottom: "11px" }}
                        onChange={handleChange}
                        type="checkbox"
                        name="#ejemplo-checkbox"
                        value={checkIdentity}
                      />
                      {`Declaro ser ${person.nombre} ${person.apellido} Rut: ${person.rut} quien firma`}
                    </label>
                  </div>
                </div>
              ) : null}

              <div
                class="button"
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                }}
              >
                {/*canGoBack && <Button
                    style={{ marginTop: '25px', backgroundColor: '#2e67fb', borderRadius: '24px', marginRight: '21px', padding: '20px' }}
                    className="ContinueForm"
                    variant="contained"
                    color="primary"
                    onClick={handleBack}>
                    	Retroceder
				  </Button>*/}
                <Button
                  style={{
                    marginTop: "25px",
                    backgroundColor: "#2e67fb",
                    borderRadius: "24px",
                    marginRight: "21px",
                    padding: "20px",
                  }}
                  className="ContinueForm"
                  variant="contained"
                  color="primary"
                  onClick={handleClick}
                >
                  Firmar Documento
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>

      <Dialog
        classes={{ paper: "modal-content bg-deep-sky rounded-lg modal-dark  justForm " }}
        open={open}
        style={{ maxWidth: "1000px !important" }}
        onClose={handleClose}
        aria-labelledby="form-dialog-title"
      >
        <DialogTitle id="form-dialog-title">Procederemos a firmar el documento.</DialogTitle>
        <DialogContent className="p-4">
          <TextField
            InputLabelProps={{
              shrink: true,
            }}
            label="RUT"
            value={run}
            onChange={handleRun}
            style={{ marginRight: "13px" }}
          />
          <TextField
            InputLabelProps={{
              shrink: true,
            }}
            label="Cedula"
            value={cedula}
            onChange={handleCedula}
            style={{ marginRight: "13px" }}
          />
          <TextField
            InputLabelProps={{
              shrink: true,
            }}
            label="Nombres y Apellidos"
            value={name}
            onChange={handleName}
            style={{ marginRight: "13px" }}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} variant="text" className="bg-white-10 text-white mr-3 shadow-none">
            Cancelar
          </Button>
          <Button onClick={handleNext} className="btn-success shadow-none">
            Firmar Documento
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}
