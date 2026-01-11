import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { Grid, TextField, Dialog, DialogActions, DialogContent, DialogTitle } from "@material-ui/core";
import Note from "../styles-forms/Note";

import axios from "../../../utils/axios";

import useCountDown from "../../../hooks/useCountDown";

import { setEcert } from "../../../reducers/documento";

import ProcedureSignatureEditUser from "./ProcedureSignatureEditUser";
import "./style.css";

export default function ProcedureSignatureReview() {
  const dispatch = useDispatch();

  const [selected, setSelected] = useState(false);
  const [counter, start, pause, reset] = useCountDown(120);

  const { transaction, participant } = useParams();

  const { ecert, documento } = useSelector(({ documento }) => documento);

  const getReviews = async () => {
    try {
      reset();
      const {
        data: { ecert: newEcert },
      } = await axios.post(`/api/ecert/reviews`, { transaction });
      if (newEcert.some((it) => !it.signed)) {
        start();
        dispatch(setEcert(newEcert));
      } else {
        window.location.reload(1);
      }
    } catch (err) {
      console.error(err);
      if (err.response?.data?.message) alert(err.response?.data?.message);
    }
  };

  const handleForceReview = () => {
    getReviews();
  };

  const handleModify = (index) => {
    pause();
    setSelected({ ...ecert[index] });
  };
  const handleClose = () => {
    start();
    setSelected(false);
  };
  const handleModifyUser = async () => {
    try {
      await axios.post(`/api/ecert/modify`, {
        transaction,
        participant: participant || documento.participants[0].id,
        data: selected,
      });
      handleClose();
      getReviews();
    } catch (err) {
      console.error(err);
      if (err.response?.data?.message) alert(err.response?.data?.message);
    }
  };

  useEffect(() => {
    getReviews();
  }, []);
  useEffect(() => {
    if (counter === 0) {
      getReviews();
    }
  }, [counter]);

  let docCurrent = false;
  if (participant && documento) {
    docCurrent = documento.participants.find((it) => it.id === participant);
  } else if (documento) {
    docCurrent = documento.participants[0];
  }

  const notNotary = ecert.every((it) => !it.last);

  return (
    <div>
      <h2 style={{ color: "#322971", textAlign: "center" }}>Esperando la firma de los siguientes participantes</h2>
      <ul id="sign_advance_ul_li">
        {ecert.map((item, index) => {
          return (
            <li key={index}>
              {item.nombre ? (
                <>
                  <div>
                    {index + 1}° - {item.email ? item.email : item.rut}
                  </div>
                  <div>
                    {item.nombre} {item.appat} {item.apmat}{" "}
                  </div>
                  <div>
                    {item.signed ? (
                      <span style={{ color: "green" }}>Ya firmó!</span>
                    ) : (
                      <span style={{ color: "red" }}>
                        Falta firmar{" "}
                        <a onClick={() => handleModify(index)} style={{ color: "blue", cursor: "pointer" }}>
                          o modifique el correo aquí
                        </a>
                      </span>
                    )}
                  </div>
                </>
              ) : (
                <>
                  <div>
                    {index + 1}° -{item.ecertName ? item.ecertName : "[Notario]"}
                  </div>
                  <div>
                    {item.signed ? (
                      <span style={{ color: "green" }}>Ya firmó!</span>
                    ) : (
                      <span style={{ color: "red" }}>Falta firmar</span>
                    )}
                  </div>
                </>
              )}
            </li>
          );
        })}
        {notNotary && docCurrent.ecert_user ? (
          <li>
            <div>{docCurrent?.ecert_user?.ecert_title_rol ? docCurrent?.ecert_user?.ecert_title_rol : "[Notario]"}</div>
            <div>
              <span style={{ color: "red" }}>Falta firmar</span>
            </div>
          </li>
        ) : null}
      </ul>
      <Grid item>
        <div style={{ marginLeft: 60, paddingRight: 20 }}>
          <p>
            Esta página se actualizará en <span style={{ color: "green" }}>{counter}</span> segundos.
          </p>
          <p>
            Si desea revisar algún cambio, de click{" "}
            <a onClick={handleForceReview} style={{ color: "blue", cursor: "pointer" }}>
              aquí
            </a>
          </p>
        </div>
        <Note
          txt={
            "El correo para firmar se enviará en el orden que aparece en pantalla y una vez el participante anterior haya firmado."
          }
        />
      </Grid>

      <Dialog
        classes={{ paper: "modal-content bg-deep-sky rounded-lg modal-dark" }}
        open={selected !== false}
        onClose={handleClose}
        aria-labelledby="form-dialog-title"
      >
        {selected !== false && (
          <>
            <DialogTitle id="form-dialog-title">
              Modificar datos de {selected.nombre} {selected.appat} {selected.apmat}
            </DialogTitle>
            <DialogContent className="p-4">
              <div style={{ marginBottom: "23px" }}>
                <TextField
                  InputLabelProps={{
                    shrink: true,
                  }}
                  className="input_sign"
                  value={selected.email}
                  onChange={(e) => setSelected({ ...selected, email: e.target.value })}
                  label="Email"
                  placeholder="nombre@gmail.com"
                  style={{ margin: "15px" }}
                />

                <TextField
                  InputLabelProps={{
                    shrink: true,
                  }}
                  className="input_sign"
                  value={selected.nombre}
                  onChange={(e) => setSelected({ ...selected, nombre: e.target.value })}
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
                  className="input_sign"
                  value={selected.appat}
                  onChange={(e) => setSelected({ ...selected, appat: e.target.value })}
                  label="Apellido Paterno"
                  placeholder="Perez"
                  style={{ margin: "15px" }}
                />

                <TextField
                  InputLabelProps={{
                    shrink: true,
                  }}
                  className="input_sign"
                  value={selected.apmat}
                  onChange={(e) => setSelected({ ...selected, apmat: e.target.value })}
                  label="Apellido Materno"
                  placeholder="Perez"
                  style={{ margin: "15px" }}
                />
              </div>
              <div>
                <TextField
                  InputLabelProps={{
                    shrink: true,
                  }}
                  className="input_sign"
                  value={selected.rut}
                  onChange={(e) => setSelected({ ...selected, rut: e.target.value })}
                  label="Rut"
                  placeholder="19.112.039-7"
                  style={{ margin: "15px" }}
                />
              </div>
              <button className="ContinueForm" onClick={handleModifyUser}>
                cambiar correo electrónico
              </button>
            </DialogContent>
          </>
        )}
      </Dialog>
    </div>
  );
}
