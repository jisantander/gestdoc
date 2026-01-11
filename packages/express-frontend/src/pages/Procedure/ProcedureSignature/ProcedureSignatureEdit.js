import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import { Table, Button, /*TextField,*/ Grid /*, InputAdornment*/ } from "@material-ui/core";
import isEmail from "../../../utils/isEmail";
import Note from "../styles-forms/Note";
/*import Close from '@material-ui/icons/Close';
import IconButton from '@material-ui/core/IconButton';*/
import Add from "@material-ui/icons/Add";
import Send from "@material-ui/icons/Send";
import { rutValidate, rutFormat } from "rut-helpers";

import ProcedureSignatureEditUser from "./ProcedureSignatureEditUser";

import axios from "../../../utils/axios";
import { RESERVED_EMAIL_FIELD } from "../../../utils/constants";
import useNotification from "../../../hooks/useNotification";

const findDuplicates = (arr) => arr.filter((item, index) => arr.indexOf(item) != index);

export default function ProcedureRequest() {
  const [openNotification, Notification] = useNotification();
  const { transaction, participant } = useParams();
  const { documento, gestores } = useSelector(({ documento }) => documento);
  const { participants } = documento;

  const [loading, setLoading] = useState(false);
  const [emails, setEmails] = useState([""]);
  const [nombres, setNombres] = useState([""]);
  const [appats, setAppat] = useState([""]);
  const [apmats, setApmat] = useState([""]);
  const [ruts, setRuts] = useState([""]);

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

  useEffect(() => {
    if (participantDataCurrent) {
      const newMails = [];
      for (const property in participantDataCurrent.form) {
        if (property.includes(RESERVED_EMAIL_FIELD) || property.includes("email")) {
          newMails.push(participantDataCurrent.form[property]);
        }
      }
      if (newMails.length > 0) setEmails(newMails);
    }
    try {
      setRuts([]);
      setNombres([]);
      for (const property in participantDataCurrent.form) {
        if (property.includes("nombre_id")) {
          setNombres((oldArray) => [...oldArray, participantDataCurrent.form[property]]);
        }
        if (property.includes("rut")) {
          setRuts((oldArray) => [...oldArray, participantDataCurrent.form[property]]);
        }
      }
    } catch (error) {
      console.error(error);
    }
    // eslint-disable-next-line
  }, []);

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
  const handleAppat = (i) => (e) => {
    const newDatas = [...appats];
    newDatas[i] = e.target.value;
    setAppat(newDatas);
  };
  const handleApmat = (i) => (e) => {
    const newDatas = [...apmats];
    newDatas[i] = e.target.value;
    setApmat(newDatas);
  };
  const handleRuts = (i) => (e) => {
    const newDatas = [...ruts];
    newDatas[i] = e.target.value;
    setRuts(newDatas);
  };

  const handleNext = async () => {
    let notValid = emails.find((it) => !isEmail(it));
    if (notValid) {
      return alert("Debe ingresar un correo válido");
    }
    const hasDuplicates = findDuplicates(emails);
    if (hasDuplicates.length > 0) {
      return alert(`Existen correos repetidos: ${hasDuplicates.join(", ")}`);
    }

    let notValidRut = ruts.find((it) => {
      let resultRut = !rutValidate(it);
      return resultRut;
    });
    if (notValidRut) {
      return alert("Debe ingresar un Rut válido");
    }

    notValid = nombres.find((it) => it.trim() === "");
    if (notValid === "") {
      return alert("Debe ingresar un Nombre");
    }

    notValid = appats.find((it) => it.trim() === "");
    if (notValid === "") {
      return alert("Debe ingresar un Apellido Paterno");
    }

    notValid = apmats.find((it) => it.trim() === "");
    if (notValid === "") {
      return alert("Debe ingresar un Apellido Materno");
    }

    var people = [];
    for (let i = 0; i < emails.length; i++) {
      people.push({
        email: emails[i],
        nombre: nombres[i],
        appat: appats[i],
        apmat: apmats[i],
        rut: rutFormat(ruts[i]).replaceAll(".", ""),
      });
    }

    try {
      setLoading(true);
      await axios.post("/api/ecert/request", {
        requests: people,
        transaction,
        participant: participantDataCurrent.id,
      });
      setLoading(false);
      window.location.reload(1);
    } catch (err) {
      setLoading(false);
      if (err?.response?.data?.message) alert(err.response.data.message);
      else alert("Hubo un error al comunicarse con el servidor");
    }
  };

  return (
    <>
      {Notification}

      <h2 style={{ color: "#322971", textAlign: "center" }}>
        Ingrese la información de quienes participan en la firma
      </h2>
      <Table className="table table-striped table-borderless text-nowrap mb-0">
        <thead className="bg-white font-size-sm text-uppercase">
          <tr>
            <th
              className="bg-white text-center"
              style={{ color: "#4d7afc ", fontSize: "x-large", textAlign: "center" }}
            ></th>
          </tr>
        </thead>
        <ProcedureSignatureEditUser
          emails={emails}
          nombres={nombres}
          appats={appats}
          apmats={apmats}
          ruts={ruts}
          handleEmail={handleEmail}
          handleNombres={handleNombres}
          handleAppat={handleAppat}
          handleApmat={handleApmat}
          handleRuts={handleRuts}
          handleRemove={handleRemove}
        />
      </Table>

      <Grid container direction="column" justify="center" alignItems="center">
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

        <Grid item>
          <Note txt={"A cada correo le llegará el documento para poder firmarlo"} />
        </Grid>
        <Grid item xl={12}>
          {loading ? (
            <span>cargando...</span>
          ) : (
            <Button
              style={{
                marginTop: "28px",
                backgroundColor: "#2e67fb",
                borderRadius: "24px",
                padding: "20px",
                cursor: "pointer",
              }}
              endIcon={<Send />}
              variant="contained"
              color="primary"
              onClick={handleNext}
            >
              Enviar invitación para firma
            </Button>
          )}
        </Grid>
      </Grid>
    </>
  );
}
