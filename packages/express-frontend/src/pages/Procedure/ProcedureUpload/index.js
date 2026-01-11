import React from "react";
import { useParams } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { setNextStage } from "../../../reducers/documento";

import ContainerForm from "../ProcedureReview/ContainerForm";
import ProcedureUploadForm from "./ProcedureUploadForm";
import Note from "../styles-forms/Note";
import { StyledObject } from "../styles";

export default function ProcedureUpload({ canGoBack, handleBack }) {
  const dispatch = useDispatch();
  const { transaction, participant } = useParams();
  const documento = useSelector(({ documento }) => documento.documento);
  const upload = useSelector(({ documento }) => documento.upload);
  const gestores = useSelector(({ documento }) => documento.gestores);
  const { participants } = useSelector(({ documento }) => documento.documento);

  let participantData = null;
  if (participant && documento) {
    participantData = participants.find((it) => it.id === participant);
  } else if (documento) {
    participantData = participants[0];
  }

  const handleNext = async () => {
    let participantDataCurrent = null;
    if (participant && documento) {
      participantDataCurrent = gestores.find((it) => it.id === participant);
    } else if (documento) {
      participantDataCurrent = gestores[0];
    }
    dispatch(
      setNextStage(transaction, participantDataCurrent.current, {
        type: "upload",
        titleStage: participantData.next.name,
        notification: participantData.next["custom:notification"] === "true",
        upload,
      })
    );
  };

  let content = <span>cargando...</span>;
  if (documento) {
    if (upload === "") {
      const footer = (
        <>
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
          </div>
        </>
      );
      content = (
        <ContainerForm documento={documento} footer={footer}>
          <ProcedureUploadForm transaction={transaction} reload={() => window.location.reload(1)} />
        </ContainerForm>
      );
    } else {
      const footer = (
        <>
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
          <div class="notice">
            <Note
              txt={
                "Una vez todas los participantes hayan revisado muy bien el documento  Presione ¨Seguir con el Trámite¨. Después de este paso no es posible hacer correcciones "
              }
            />
          </div>
        </>
      );
      content = (
        <ContainerForm documento={documento} footer={footer}>
          <StyledObject data={upload} type="application/pdf" style={{ height: "100vh", minWidth: "100%" }}>
            <embed src={upload} type="application/pdf" />
          </StyledObject>
        </ContainerForm>
      );
    }
  }
  return <div className="ProcedureReview">{content}</div>;
}
