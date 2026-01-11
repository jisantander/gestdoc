import React from "react";
import { useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import Header from "./styles-forms/Header";
import Note from "./styles-forms/Note";
import { Grid, Card, CardContent } from "@material-ui/core";
import flow from "../../flow.svg";
import webpay from "../../webpay.svg";

import axios from "../../utils/axios";

export default function ProcedureCharge({ canGoBack, handleBack }) {
  const { transaction, participant } = useParams();
  const participants = useSelector(({ documento }) => documento.documento.participants);
  const documento = useSelector(({ documento }) => documento.documento);
  const emailProc = useSelector(({ documento }) => documento.email);
  const gestores = useSelector(({ documento }) => documento.gestores);

  let participantData = null;
  if (participant && documento) {
    participantData = participants.find((it) => it.id === participant);
  } else if (documento) {
    participantData = participants[0];
  }

  let totalAmount = participantData.next["custom:charge_value"];

  if (participantData.next["custom:charge_by_sign"] && participantData.next["custom:charge_value"] !== "") {
    totalAmount =
      parseInt(totalAmount) +
      parseInt(participantData.next["custom:charge_by_sign"]) * parseInt(gestores[0].emails.length);
    if (!gestores[0].emails) {
      return (
        <div>
          <span>
            Antes de intentar realizar el cobro, se debe indicar quienes serán los firmantes (este cobro será en
            relación a cuantos firmantes haya en el documento)
          </span>
        </div>
      );
    }
  }

  const handleButton = (e) => {
    e.preventDefault();
    startPayment();
  };

  const startPayment = async () => {
    try {
      let participantDataGest = null;
      if (participant && documento) {
        participantDataGest = gestores.find((it) => it.id === participant);
      } else if (documento) {
        participantDataGest = gestores[0];
      }
      if (emailProc === undefined) {
        return alert(
          "No se ha iniciado sesión durante el procedimiento. Por favor comunicar a soporte para esta corrección."
        );
      }
      const { data } = await axios.post("/api/flow/create", {
        transaction,
        participant: participantDataGest.id,
        current: participantDataGest.current,
      });
      window.location.href = data.url + "?token=" + data.token;
    } catch (err) {
      alert(err);
    }
  };

  return (
    <>
      <Header documento={documento} position={"center-"} />

      <Grid id="center-form" container direction="row" justify="center" alignItems="center">
        <Grid item xl={4} md={6} style={{ marginTop: "-138px", position: "initial", minWidth: "50%" }}>
          <Card
            className="mb-5 card-box card-box-border-bottom border-success justForm"
            style={{ borderRadius: "25px" }}
          >
            <CardContent style={{ paddingLeft: "50px", paddingRight: "50px", display: "flex", flexFlow: "column" }}>
              <div>
                {" "}
                <h2 style={{ color: "#282053" }}>Pago</h2>{" "}
              </div>

              <div>
                {" "}
                <h3 style={{ color: "#3167fb", textAlign: "center" }}>Detalle</h3>{" "}
              </div>

              <table style={{ color: "#6c58b4" }}>
                <tr>
                  <th style={{ width: "50%" }}></th>
                  <th style={{ width: "50%" }}></th>
                </tr>
                <tr style={{ width: "50%" }}>
                  <td style={{ float: "right", marginRight: "40px" }}>Item</td>
                  <td style={{ width: "50%" }}> {documento._nameSchema}</td>
                </tr>
                {/*<tr style={{ width: "50%" }}>
                  <td style={{ float: "right", marginRight: "40px" }}>Firma</td>
                  <td style={{ width: "50%" }}>Firma Simple</td>
                </tr>*/}
                <tr style={{ width: "50%", marginTop: "10px", height: "60px" }}>
                  <td
                    style={{
                      float: "right",
                      marginRight: "40px",
                      fontWeight: " bold",
                      marginTop: "18px",
                    }}
                  >
                    Total a pagar
                  </td>
                  <td
                    style={{
                      width: "50%",
                      color: "#2e67fb",
                      fontWeight: " bold",
                      fontSize: " x-large",
                      marginTop: "13px",
                    }}
                  >
                    ${new Intl.NumberFormat("de-DE").format(totalAmount)}
                  </td>
                </tr>
              </table>

              <div style={{ marginBottom: "19px" }}>
                <Note
                  txt={
                    "Una vez se concrete la compra se enviará al correo de cada participantes un link para firmar el documento"
                  }
                />
              </div>
            </CardContent>
            <div
              className="contentCotinue"
              style={{
                textAlign: "center",
                marginTop: "0px",
                marginLeft: "0px",
                marginBottom: "58px",
                display: "flex",
                justifyContent: "space-between",
              }}
            >
              {canGoBack && (
                <button
                  onClick={handleBack}
                  class="ContinueForm"
                  style={{ float: "initial", minWidth: "107px", marginRight: "37px" }}
                  type="button"
                >
                  Retroceder
                </button>
              )}
              <button
                onClick={handleButton}
                class="ContinueForm"
                style={{ float: "initial", minWidth: "107px", marginRight: "37px" }}
                type="submit"
              >
                Pagar
              </button>
            </div>
          </Card>
        </Grid>
      </Grid>
      <div
        style={{
          display: "flex",
          placeContent: "center",
          marginTop: "138px",
          marginBottom: "60px",
        }}
      >
        <img
          style={{
            height: "30px",
            marginLeft: "25px",
          }}
          src={flow}
          alt="Medio de pago flow"
        />
        <img
          style={{
            height: "60px",
            marginTop: "-24px",
            marginLeft: "25px",
          }}
          src={webpay}
          alt="Medio de pago WebPay"
        />
      </div>
    </>
  );
}
