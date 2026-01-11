import React from "react";
import { useSelector } from "react-redux";
import { useParams } from "react-router-dom";

import Note from "../styles-forms/Note";
import ContainerForm from "./ContainerForm";

import axios from "../../../utils/axios";

export default function ProcedureReviewSimple({ canGoBack, handleBack, handleNext, children, docId }) {
  const documento = useSelector(({ documento }) => documento.documento);

  const { transaction, participant } = useParams();

  const handleDownloadWord = () => {
    axios({
      url: `/api/word/${transaction}/${docId}`,
      method: "GET",
      responseType: "blob",
    })
      .then((response) => {
        const fileNameHeader = "x-suggested-filename";
        const suggestedFileName = response.headers[fileNameHeader];
        let effectiveFileName = suggestedFileName === undefined ? `Doc${transaction}.docx` : suggestedFileName;
        const url = window.URL.createObjectURL(new Blob([response.data]));
        const link = document.createElement("a");
        link.href = url;
        if ("undefined.docx" === effectiveFileName) {
          effectiveFileName = `Doc${transaction}.docx`;
        }
        link.setAttribute("download", effectiveFileName);
        document.body.appendChild(link);
        link.click();
      })
      .catch((error) => {
        alert("Hubo un error al intentar descargar");
      });
  };

  const footer = (
    <>
      <button style={{ marginTop: "32px" }} className="ContinueForm" onClick={handleDownloadWord}>
        Descargar Word
      </button>

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

  return (
    <ContainerForm documento={documento} footer={footer}>
      {children}
    </ContainerForm>
  );
}
