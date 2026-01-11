import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
//import ArrowBackIcon from "@material-ui/icons/ArrowBack";

import ProcedureRequest from "./ProcedureRequest";
import { getDocumento } from "../../reducers/documento";

import ProcedureCharge from "./ProcedureCharge";
import ProcedureSignature from "./ProcedureSignature";
import ProcedurePixel from "./ProcedurePixel";
import ProcedureForm from "./ProcedureForm";
import ProcedureMail from "./ProcedureMail";
import ProcedureParticipants from "./ProcedureParticipants";
import ProcedureReview from "./ProcedureReview";
import ProcedureLogin from "./ProcedureLogin";
import ProcedureSiteEmbebed from "./ProcedureSiteEmbebed";
import ProcedureEnd from "./ProcedureEnd";
import ProcedureOdoo from "./ProcedureOdoo";
import ProcedureUpload from "./ProcedureUpload";
import ProcedureRescue from "./ProcedureRescue";

import logo from "../../logoGestdoc.svg"; // Tell webpack this JS file uses this image
import Profile from "./Profile";

import ProcedureLoading from "./ProcedureLoading";
import ProcedureBack from "./ProcedureBack";
import ProcedureError from "./ProcedureError";

export default function Procedure() {
  const dispatch = useDispatch();
  const { transaction, participant } = useParams();
  const { documento, loading, error, updated, origin, url } = useSelector(({ documento }) => documento);
  const [intervalApiPixel, setIntervalApiPixel] = useState();
  const [show, setShow] = useState(false);

  const isAuth = useSelector(({ auth }) => auth.token !== null);

  let participantData = null;
  if (participant && documento) {
    participantData = documento.participants.find((it) => it.id === participant);
  } else if (documento) {
    participantData = documento.participants[0];
  }

  useEffect(() => {
    dispatch(getDocumento(transaction));
    // eslint-disable-next-line
    if (participantData) {
      if (participantData.next["custom:functions"] === "signature") {
        setIntervalApiPixel(true);
      }
    }
    // eslint-disable-next-line
  }, [transaction, updated]);

  useEffect(() => {
    function getAlerts() {
      dispatch(getDocumento(transaction));
    }
    if (intervalApiPixel) {
      getAlerts();
      const interval = setInterval(() => getAlerts(), 20 * 1000);
      // TODO: la idea es que esto llegue a  case 'END': en el caso de   switch (participantData.next['custom:functions']) {
      return () => {
        clearInterval(interval);
      };
    }
    // eslint-disable-next-line
  }, [intervalApiPixel]);

  if (origin) {
    if (origin === "rescue") {
      return <ProcedureRescue />;
    }
  }

  const handleClose = () => {
    setShow(false);
  };
  const handleBack = () => {
    setShow(true);
  };

  let currentContent = <span>cargando...</span>;
  if (participantData) {
    switch (participantData.next["custom:functions"]) {
      case "charge":
        currentContent = <ProcedureCharge handleBack={handleBack} canGoBack={participantData.previous} />;
        break;
      case "form":
        currentContent = <ProcedureForm handleBack={handleBack} canGoBack={participantData.previous} />;
        break;
      case "email":
        currentContent = <ProcedureMail handleBack={handleBack} canGoBack={participantData.previous} />;
        break;
      case "doc":
        currentContent = <ProcedureReview handleBack={handleBack} canGoBack={participantData.previous} />;
        break;
      case "advanced_signature":
        currentContent = <ProcedureSignature handleBack={handleBack} canGoBack={participantData.previous} />;
        break;
      case "request_signature":
        currentContent = <ProcedureRequest handleBack={handleBack} canGoBack={participantData.previous} />;
        break;
      case "signature":
        currentContent = <ProcedurePixel handleBack={handleBack} canGoBack={participantData.previous} />;
        break;
      case "view_collaborations":
        currentContent = <ProcedureParticipants />;
        break;
      case "sign_in":
        currentContent = <ProcedureLogin handleBack={handleBack} canGoBack={participantData.previous} />;
        break;
      case "get_Info_odoo":
        currentContent = <ProcedureOdoo handleBack={handleBack} canGoBack={participantData.previous} />;
        break;
      case "insert_site":
        currentContent = <ProcedureSiteEmbebed handleBack={handleBack} canGoBack={participantData.previous} />;
        break;
      case "upload":
        currentContent = <ProcedureUpload handleBack={handleBack} canGoBack={participantData.previous} />;
        break;
      case "END":
        currentContent = <ProcedureEnd />;
        break;
      default:
        currentContent = <span>Falta información</span>;
        break;
    }
  }

  if (error) {
    return <ProcedureError />;
  }
  if (!documento || loading) {
    return (
      <>
        <div
          style={{
            height: "50px",
            backgroundColor: "#1d0c8e",
            display: "flex",
            justifyContent: "space-between",
          }}
        >
          <div>
            <img
              style={{
                height: "33px",
                padding: "30px",
                paddingLeft: "65px",
              }}
              src={logo}
              alt="Logo Gestdoc"
            />
          </div>
          <div>{isAuth && <Profile />}</div>
        </div>
        <div style={{ backgroundColor: "#f1f4fb" }}>
          <ProcedureLoading />
        </div>
      </>
    );
  }
  return (
    <>
      <div
        style={{
          height: "50px",
          backgroundColor: "#1d0c8e",
          display: "flex",
          justifyContent: "space-between",
        }}
      >
        <div>
          <img
            style={{
              height: "33px",
              padding: "30px",
              paddingLeft: "65px",
            }}
            src={logo}
            alt="Logo Gestdoc"
          />
        </div>
        <div>
          {participantData.previous && (
            <>
              {/*<button
                className="MuiButtonBase-root MuiButton-root MuiButton-contained MuiButton-containedPrimary"
                onClick={handleBack}
              >
                <ArrowBackIcon />
                Retroceder Procedimiento
			  </button>*/}
              <ProcedureBack open={show} handleClose={handleClose} gestor={participantData} transaction={transaction} />
            </>
          )}
          {isAuth && <Profile />}
        </div>
      </div>
      <div style={{ backgroundColor: "#f1f4fb" }}>{currentContent}</div>
    </>
  );
}
