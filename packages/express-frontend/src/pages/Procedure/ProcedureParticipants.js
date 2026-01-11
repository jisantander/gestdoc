import React, { useState } from "react";
import { useParams } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
//import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  Table,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  InputAdornment,
  Card,
  Button,
  TextField,
} from "@material-ui/core";

import EmailTwoToneIcon from "@material-ui/icons/EmailTwoTone";
import WhatsAppIcon from "@material-ui/icons/WhatsApp";
import DialogContentText from "@material-ui/core/DialogContentText";

import axios from "../../utils/axios";
import isEmail from "../../utils/isEmail";

import useNotification from "../../hooks/useNotification";
import { setNextStage } from "../../reducers/documento";

export default function ProcedureParticipants() {
  const dispatch = useDispatch();
  const { transaction, participant } = useParams();
  const documento = useSelector(({ documento }) => documento.documento);
  const gestores = useSelector(({ documento }) => documento.gestores);
  const { participants } = useSelector(({ documento }) => documento.documento);

  const [open, setOpen] = useState(false);
  const [medium, setMedium] = useState(false);
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [gestorSel, setGestor] = useState(null);

  const [openNotification, Notification] = useNotification();

  let participantData = null;
  if (participant && documento) {
    participantData = participants.find((it) => it.id === participant);
  } else if (documento) {
    participantData = participants[0];
  }

  const handleOpen = (gestorS, mediumShare) => () => {
    setMedium(mediumShare);
    setGestor(gestorS);
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  let urlParti = "";
  const handleMediumWhatsapp = () => {
    if (phone === "" || phone.length < 8) {
      return openNotification({
        text: "Debe ingresar un teléfono válido!",
        style: "danger",
      });
    }
    const urlWht = `https://web.whatsapp.com/send?phone=+56${phone}&text=${urlParti}`;
    window.open(urlWht, "_blank");
  };
  const handleMediumEmail = async () => {
    try {
      if (email === "" || isEmail(email)) {
        return openNotification({
          text: "Debe ingresar un email válido!",
          style: "danger",
        });
      }
      await axios.post("/api/email", { transaction, gestor: gestorSel.id });
      openNotification({
        text: "El correo ha sido enviado con éxito.",
        style: "success",
      });
    } catch (err) {
      let texto = "Hubo un error al enviar la información";
      if (err.response) if (err.response.data) if (err.response.data.message) texto = err.response.data.message;
      openNotification({
        text: texto,
        style: "danger",
      });
    }
  };
  const handlePhone = (e) => {
    setPhone(e.target.value);
  };
  const handleEmail = (e) => {
    setEmail(e.target.value);
  };
  if (gestorSel) {
    urlParti = `${window.location.protocol}//${window.location.hostname}${
      window.location.port !== "80" ? ":" + window.location.port : ""
    }/procedure/${transaction}/${gestorSel.id}`;
  }

  const handleShare = () => {
    if (medium === "whatsapp") {
      handleMediumWhatsapp();
    }
    if (medium === "email") {
      handleMediumEmail();
    }
  };

  const handleNext = () => {
    let participantDataCurrent = null;
    if (participant && documento) {
      participantDataCurrent = gestores.find((it) => it.id === participant);
    } else if (documento) {
      participantDataCurrent = gestores[0];
    }
    dispatch(
      setNextStage(transaction, participantDataCurrent.current, {
        type: "view_collaborations",
        titleStage: participantData.next.name,
        notification: participantData.next["custom:notification"] === "true",
        value: "true",
      })
    );
  };

  return (
    <>
      {Notification}
      <Card>
        <div className="card-header d-flex align-items-center justify-content-between card-header-alt p-4">
          <div>
            <h6 className="font-weight-bold font-size-lg mb-0 text-black">Participantes de {documento._nameSchema}</h6>
          </div>
        </div>
        <div className="divider" />
        <Table className="table table-striped table-borderless text-nowrap mb-0">
          <thead className="bg-white font-size-sm text-uppercase">
            <tr>
              <th className="bg-white text-left px-4">Participante</th>
              <th className="bg-white text-center">Whatsapp</th>
              <th className="bg-white text-center">Correo</th>
              <th className="bg-white text-center">Enlace</th>
            </tr>
          </thead>
          <tbody>
            {participants &&
              participants.map((it) => {
                const urlGestor = `${window.location.protocol}//${window.location.hostname}${
                  window.location.port !== "80" ? ":" + window.location.port : ""
                }/procedure/${transaction}/${it.id}`;
                return (
                  <tr key={it.id}>
                    <td className="px-4">
                      <div className="d-flex align-items-center">
                        <div className="font-weight-bold">{it.name}</div>
                      </div>
                    </td>
                    <td className="text-center">
                      <div
                        className="d-30 text-white d-flex align-items-center justify-content-center rounded-pill mr-3 bg-second"
                        style={{ cursor: "pointer" }}
                        onClick={handleOpen(it, "whatsapp")}
                      >
                        {/*<FontAwesomeIcon icon={['fab', 'whatsapp']} /> */}
                      </div>
                    </td>
                    <td className="text-center">
                      <div
                        className="d-30 text-white d-flex align-items-center justify-content-center rounded-pill mr-3 bg-second"
                        style={{ cursor: "pointer" }}
                        onClick={handleOpen(it, "email")}
                      >
                        {/*<FontAwesomeIcon icon={['fa', 'envelope-open']} /> */}
                      </div>
                    </td>
                    <td className="text-center">
                      <div className="px-4 py-1 h-auto text-success border-1 border-success badge-neutral-success">
                        <a href={urlGestor} target="_blank" rel="noopener noreferrer">
                          {urlGestor}
                        </a>
                      </div>
                    </td>
                  </tr>
                );
              })}
          </tbody>
        </Table>
        <div className="divider" />
        <div className="card-footer p-4 d-flex justify-content-center">
          <Button variant="contained" color="primary" onClick={handleNext}>
            Seguir con el Trámite
          </Button>
        </div>
      </Card>
      <Dialog
        classes={{ paper: "modal-content bg-deep-sky rounded-lg modal-dark" }}
        open={open}
        onClose={handleClose}
        aria-labelledby="form-dialog-title"
      >
        {gestorSel ? (
          <>
            <DialogTitle id="form-dialog-title">Vamos a compartir el enlace de {gestorSel.name}</DialogTitle>
            <DialogContent className="p-4">
              {medium === "whatsapp" && (
                <>
                  <DialogContentText>
                    Ingresa el número de Whatsapp del participante para enviarle un enlace.
                  </DialogContentText>
                  <DialogContentText className="mb-0">
                    <TextField
                      className="text-white-50"
                      variant="outlined"
                      size="small"
                      autoFocus
                      margin="dense"
                      id="input-with-icon-textfield134"
                      label="Número de Whatsapp"
                      type="text"
                      fullWidth
                      onChange={handlePhone}
                      value={phone}
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            <WhatsAppIcon />
                          </InputAdornment>
                        ),
                      }}
                    />
                  </DialogContentText>
                </>
              )}
              {medium === "email" && (
                <>
                  <DialogContentText>
                    Ingresa el número de Whatsapp del participante para enviarle un enlace.
                  </DialogContentText>
                  <DialogContentText className="mb-0">
                    <TextField
                      className="text-white-50"
                      variant="outlined"
                      size="small"
                      autoFocus
                      margin="dense"
                      id="input-with-icon-textfield134"
                      label="Correo Electrónico"
                      type="email"
                      fullWidth
                      onChange={handleEmail}
                      value={email}
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            <EmailTwoToneIcon />
                          </InputAdornment>
                        ),
                      }}
                    />
                  </DialogContentText>
                </>
              )}
            </DialogContent>
            <DialogActions className="p-4">
              <Button onClick={handleClose} variant="text" className="bg-white-10 text-white mr-3 shadow-none">
                Cancelar
              </Button>
              <Button onClick={handleShare} className="btn-success shadow-none">
                Compartir
              </Button>
            </DialogActions>
          </>
        ) : null}
      </Dialog>
    </>
  );
}
