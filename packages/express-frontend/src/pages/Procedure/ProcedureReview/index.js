import React from "react";
import { useParams } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { setNextStage } from "../../../reducers/documento";

import "./index.css";

import { StyledObject } from "../styles";
import ProcedureReviewSimple from "./ProcedureReviewSimple";
import ProcedureReviewAdvanced from "./ProcedureReviewAdvanced";

export default function ProcedureReview({ canGoBack, handleBack }) {
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
  const reviewType = participantData.next["custom:doc_type"] || "simple";

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

  const urlPdf = `${window.location.origin}/api/getdocs/${transaction}/${docId}`;
  //const urlPdf = `${window.location.origin.replace("3000", "5000")}/api/previewDoc/${transaction}/${docId}`;

  const content = (
    <StyledObject data={urlPdf} type="application/pdf" style={{ height: "100vh", minWidth: "100%" }}>
      <embed src={urlPdf} type="application/pdf" />
    </StyledObject>
  );

  return (
    <div className="ProcedureReview">
      {reviewType === "simple" ? (
        <ProcedureReviewSimple docId={docId} canGoBack={canGoBack} handleBack={handleBack} handleNext={handleNext}>
          {content}
        </ProcedureReviewSimple>
      ) : (
        <ProcedureReviewAdvanced canGoBack={canGoBack} handleBack={handleBack} handleNext={handleNext}>
          {content}
        </ProcedureReviewAdvanced>
      )}
    </div>
  );
}
