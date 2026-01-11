import React from "react";
import { useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import { Grid } from "@material-ui/core";
import axios from "../../utils/axios";
import { StyledObject } from "./styles";
import ContainerForm from "./ProcedureReview/ContainerForm";

export default function ProcedureRescue() {
  const { transaction } = useParams();
  const { url: originalUrlPdf } = useSelector(({ documento }) => documento);

  const urlPdf = originalUrlPdf.substring(43);

  const handleButtonUpload = () => {
    axios({
      url: `/api/rescue/${urlPdf}`,
      method: "GET",
      responseType: "blob",
    })
      .then((response) => {
        const fileNameHeader = "x-suggested-filename";
        const suggestedFileName = response.headers[fileNameHeader];
        let effectiveFileName = suggestedFileName === undefined ? `Doc${transaction}.pdf` : suggestedFileName;
        const url = window.URL.createObjectURL(new Blob([response.data]));
        const link = document.createElement("a");
        link.href = url;
        if ("undefined.pdf" === effectiveFileName) {
          effectiveFileName = `Doc${transaction}.pdf`;
        }
        link.setAttribute("download", effectiveFileName);
        document.body.appendChild(link);
        link.click();
      })
      .catch((error) => {
        alert("Hubo un error al intentar descargar");
      });
  };

  return (
    <>
      <ContainerForm documento={{ _category: "", _nameSchema: "Descarga de Documento" }} footer={<></>}>
        <>
          <span>Ha llegado al fin del proceso, Felicitaciones.</span>
          <button
            className="ContinueForm"
            style={{ width: "fit-content", cursor: "pointer" }}
            onClick={handleButtonUpload}
          >
            Descargar Documento
          </button>
          <div>
            <Grid item md={9} style={{ minWidth: "100%" }}>
              <StyledObject data={`${process.env.REACT_APP_API}api/rescue/${urlPdf}`} type="application/pdf">
                <embed src={urlPdf} type="application/pdf" />
              </StyledObject>
            </Grid>
          </div>
        </>
      </ContainerForm>
    </>
  );
}
