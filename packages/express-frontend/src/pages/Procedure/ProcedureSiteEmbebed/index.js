import React from "react";
import { useParams } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { setNextStage } from "../../../reducers/documento";
import ContainerForm from "../ProcedureReview/ContainerForm";

import "../ProcedureReview/index.css";

import { StyledObject } from "../styles";

export default function ProcedureSiteEmbebed({ canGoBack, handleBack }) {
  const dispatch = useDispatch();
  const { transaction, participant } = useParams();
  const documento = useSelector(({ documento }) => documento.documento);
  const gestores = useSelector(({ documento }) => documento.gestores);
  const { participants } = useSelector(({ documento }) => documento.documento);

  let participantData = null;
  if (participant && documento) {
    participantData = participants.find((it) => it.id === participant);
  } else if (documento) {
    participantData = participants[0];
  }
  const docId = participantData.next["custom:doc"];
  const embebedSite = participantData.next["custom:insert_site"];

  const handleNext = async () => {
    let participantDataCurrent = null;
    if (participant && documento) {
      participantDataCurrent = gestores.find((it) => it.id === participant);
    } else if (documento) {
      participantDataCurrent = gestores[0];
    }
    dispatch(
      setNextStage(transaction, participantDataCurrent.current, {
        type: "doc",
        titleStage: participantData.next.name,
        notification: participantData.next["custom:notification"] === "true",
        value: docId,
      })
    );
  };

  const content = (
    <StyledObject data={embebedSite} type="application/pdf" style={{ height: "100vh", minWidth: "100%" }}>
      <iframe src={embebedSite} width="800" height="700" title="Sitio embebido"></iframe>
    </StyledObject>
  );

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
    </>
  );

  return (
    <>
      <ContainerForm documento={documento} footer={footer}>
        {content}
      </ContainerForm>
    </>
  );
}
