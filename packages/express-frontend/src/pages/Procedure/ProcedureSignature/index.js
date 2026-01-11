import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { Card, Button, Grid, CardContent } from "@material-ui/core";
import { setNextStage } from "../../../reducers/documento";
import Header from "../styles-forms/Header";
import SendIcon from "@material-ui/icons/Send";
import ArrowBackIcon from "@material-ui/icons/ArrowBack";

import ProcedureSignatureEdit from "./ProcedureSignatureEdit";
import ProcedureSignatureReview from "./ProcedureSignatureReview";
import ProcedureSignatureDone from "./ProcedureSignatureDone";

import { rutFormat } from "rut-helpers";

import axios from "../../../utils/axios";
import useNotification from "../../../hooks/useNotification";

// eslint-disable-next-line
const findDuplicates = (arr) => arr.filter((item, index) => arr.indexOf(item) != index);

export default function ProcedureSignature({ canGoBack, handleBack }) {
  const dispatch = useDispatch();
  const [openNotification, Notification] = useNotification();

  const { transaction, participant } = useParams();
  const { documento, gestores, ecert } = useSelector(({ documento }) => documento);
  const { participants } = useSelector(({ documento }) => documento.documento);

  const [loading, setLoading] = useState(false);

  let participantData = null;
  if (participant && documento) {
    participantData = participants.find((it) => it.id === participant);
  } else if (documento) {
    participantData = participants[0];
  }
  let participantDataCurrent = null;
  //var docCurrent = null;
  if (participant && documento) {
    //docCurrent = documento.participants.find((it) => it.id === participant);
    participantDataCurrent = gestores.find((it) => it.id === participant);
  } else if (documento) {
    participantDataCurrent = gestores[0];
    //docCurrent = documento.participants[0];
  }

  const handleNext = async () => {
    dispatch(
      setNextStage(transaction, participantDataCurrent.current, {
        type: "advanced_signature",
        titleStage: participantData.next.name,
        notification: participantData.next["custom:notification"] === "true",
      })
    );
  };

  useEffect(() => {
    const savePeople = async () => {
      const people = participantDataCurrent.people.map((it) => {
        return {
          email: it.email,
          nombre: it.nombre,
          appat: it.apellido,
          apmat: it.apmat,
          rut: rutFormat(it.rut).replaceAll(".", ""),
        };
      });
      const hasDuplicates = findDuplicates(people.map((it) => it.email));
      if (hasDuplicates.length > 0) {
        return alert(`Existen correos repetidos: ${hasDuplicates.join(", ")}`);
      }

      setLoading(true);
      await axios.post("/api/ecert/request", {
        requests: people,
        transaction,
        participant: participantDataCurrent.id,
      });
      setLoading(false);
      window.location.reload(1);
    };
    const saveOnlyRol = async () => {
      await axios.post("/api/ecert/request", {
        requests: [],
        transaction,
        participant: participantDataCurrent.id,
      });
      window.location.reload(1);
    };
    if (
      participantData.next["custom:ecert_restrict"] !== "" &&
      participantData.next["custom:ecert_restrict"] !== undefined &&
      ecert.length === 0
    ) {
      return saveOnlyRol();
    }
    if (participantDataCurrent.people && ecert.length === 0) {
      savePeople();
    }
    // eslint-disable-next-line
  }, []);

  let canContinue = false;
  let content = null;
  if (ecert.length > 0) {
    const isCompleted = ecert.every((item) => item.signed);
    if (isCompleted) {
      canContinue = ecert.every((item) => item.accepted);
      content = <ProcedureSignatureDone />;
    } else {
      content = <ProcedureSignatureReview />;
    }
  } else if (
    (ecert.length === 0 && participantData.next["custom:ecert_restrict"] === "") ||
    participantData.next["custom:ecert_restrict"] === undefined
  ) {
    content = <ProcedureSignatureEdit />;
  } else if (participantData.next["custom:ecert_restrict"] !== "") {
    content = <span>Procesando firmas de usuario enrolados...</span>;
  }
  if (loading) {
    content = (
      <div>
        <span>Generando firma para:</span>
        <ul>
          {participantDataCurrent.people.map((it) => (
            <li>
              [{it.email}] - {it.nombre} {it.apellido} {it.apmat}
            </li>
          ))}
        </ul>
        <span>Espere un momento por favor...</span>
      </div>
    );
  }

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
            <CardContent style={{ paddingLeft: "50px", paddingRight: "50px" }}>{content}</CardContent>
          </Card>

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
            {canContinue && (
              <Button
                style={{ marginTop: "25px", backgroundColor: "#2e67fb", borderRadius: "24px", padding: "20px" }}
                endIcon={<SendIcon />}
                variant="contained"
                color="primary"
                onClick={handleNext}
              >
                Continuar
              </Button>
            )}
          </div>
        </Grid>
      </Grid>
    </>
  );
}
