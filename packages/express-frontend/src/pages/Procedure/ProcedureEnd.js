import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import { Grid, Card, CardContent } from "@material-ui/core";
import Paper from "@material-ui/core/Paper";
import Header from "./styles-forms/Header";
import axios from "../../utils/axios";
import iconPerson from "../../default.svg"; // Tell webpack this JS file uses this image
import { StyledObject } from "./styles";
import Moment from "moment";
import ContainerForm from "./ProcedureReview/ContainerForm";

export default function ProcedureEnd() {
  const { transaction, participant } = useParams();
  const { participants } = useSelector(({ documento }) => documento.documento);
  const { ecert, upload, returnData, documento, gestores } = useSelector(({ documento }) => documento);
  const originalDocs = useSelector(({ documento }) => documento.documento.docs);
  const docs = useSelector(({ documento }) => documento.documento);
  /*const pdfs = useSelector(({ documento }) => documento.documento.docs);
  const pdfsArray = Object.values(pdfs);*/
  const [selected, setSelected] = useState(0);
  const [procedureData, setProcedureData] = useState([]);

  let participantData = null;
  if (participant && documento) {
    participantData = gestores.find((it) => it.id === participant);
  } else if (documento) {
    participantData = gestores[0];
  }
  const pdfs = [];
  for (const histKey in participantData.history) {
    if (participantData.history[histKey].type === "doc") {
      let tempDoc = false;
      for (const histDoc in originalDocs) {
        if (histDoc === participantData.history[histKey].value) tempDoc = originalDocs[histDoc];
      }
      if (tempDoc) pdfs.push(tempDoc);
    }
  }
  const pdfsArray = Object.values(pdfs);

  const allHaveEnded = participants.every((item) => item.end);
  // const urlPdf = `${window.location.origin.replace('3000','5000')}/api/getdocs/${transaction}/${docId}`;

  useEffect(() => {
    const getProcedure = async () => {
      const procedure = await axios.get(`/api/pixelProcedure/${transaction}`);
      setProcedureData(procedure.data);
    };

    getProcedure();
    // eslint-disable-next-line
  }, []);
  useEffect(() => {
    if (returnData) {
      if (returnData.url) {
        setTimeout(async () => {
          try {
            await axios.post(`api/documento/return/${transaction}`);
            window.location.href = returnData.url;
          } catch (err) {
            console.error(err);
          }
        }, 3000);
      }
    }
  }, [returnData]);

  if (pdfsArray.length === 0) {
    if (upload !== "") {
      const handleButtonUpload = () => {
        axios({
          url: `/api/uploaded/${transaction}`,
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
          <ContainerForm documento={docs} footer={<></>}>
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
                <Paper className={"paper-round"}>
                  <img
                    style={{
                      height: "64px",
                      padding: "3px",
                      paddingRight: "10px",
                    }}
                    src={iconPerson}
                    alt="Logo Gestdoc"
                  />
                  <div>
                    <p style={{ marginTop: "10px", color: "#423869" }}>{procedureData.email}</p>{" "}
                    <p style={{ margin: "0px", marginTop: "-12px", color: "#4468fc" }}>
                      Firmado el {Moment(procedureData.updatedAt).format("DD/MM/YYYY HH:mm:ss")}
                    </p>
                  </div>
                  <div
                    style={{
                      marginLeft: "auto",
                    }}
                  ></div>
                </Paper>
              </div>
            </>
          </ContainerForm>
        </>
      );
    } else {
      return (
        <>
          <ContainerForm documento={docs} footer={<></>}>
            <>
              <span>Ha llegado al fin del proceso, Felicitaciones.</span>
            </>
          </ContainerForm>
        </>
      );
    }
  }

  let urlPdf = `${window.location.origin}/api/file-sign/${transaction}/${pdfsArray[selected].id}`;

  if (ecert.length > 0) {
    urlPdf = `${window.location.origin}/api/previewDoc/${transaction}/${pdfsArray[selected].id}`;
  } else {
    urlPdf = `${window.location.origin}/api/file-sign/${transaction}/${pdfsArray[selected].id}`;
  }

  const handleClick = (i) => () => {
    setSelected(i);
  };

  const handleButton = () => {
    axios({
      url: urlPdf,
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

  let content = (
    <Grid item md={9} style={{ minWidth: "100%" }}>
      <StyledObject data={urlPdf} type="application/pdf">
        <embed src={urlPdf} type="application/pdf" />
      </StyledObject>
    </Grid>
  );

  if (!allHaveEnded) {
    content = <span>Aún faltan algunas personas para completar este trámite :(</span>;
  }

  return (
    <div className="ProcedureReview">
      <Header documento={docs} position={"center"} />

      <div
        className="grid-container2"
        style={{
          backgroundColor: " transparent",
          padding: "54px",
          marginTop: "-250px",
          display: "flex",
          flexFlow: "column",
          alignItems: "center",
        }}
      >
        <Card
          style={{
            width: "50%",
            borderRadius: "25px",
            minWidth: "918px !important",
          }}
          className="mb-5 card-box card-box-border-bottom border-danger sectionDoc left-card container2"
        >
          <CardContent
            style={{
              minWidth: "918px !important",
            }}
          >
            {content}
          </CardContent>
        </Card>
        <div className="button" style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
          {pdfsArray.length === 1 ? (
            <>
              {allHaveEnded && (
                <button
                  className="ContinueForm"
                  style={{ width: "fit-content", cursor: "pointer" }}
                  onClick={handleButton}
                >
                  Descargar Documento
                </button>
              )}
              <div>
                {procedureData.length >= 1 && allHaveEnded
                  ? procedureData.map((procedure) => (
                      <Paper className={"paper-round"}>
                        <img
                          style={{
                            height: "64px",
                            padding: "3px",
                            paddingRight: "10px",
                          }}
                          src={iconPerson}
                          alt="Logo Gestdoc"
                        />
                        <div>
                          <p style={{ marginTop: "10px", color: "#423869" }}>{procedure.email}</p>{" "}
                          <p style={{ margin: "0px", marginTop: "-12px", color: "#4468fc" }}>
                            Firmado el {Moment(procedure.updatedAt).format("DD/MM/YYYY HH:mm:ss")}
                          </p>
                        </div>
                        <div
                          style={{
                            marginLeft: "auto",
                          }}
                        ></div>
                      </Paper>
                    ))
                  : null}
              </div>
            </>
          ) : (
            <>
              <p>El siguiente trámite ha sido generado y tiene asociado los siguientes documentos:</p>
              {pdfs ? (
                <ul>
                  {Object.values(pdfs).map((it, i) => {
                    return (
                      <li key={it.id} onClick={handleClick(i)}>
                        {it.title}
                      </li>
                    );
                  })}
                </ul>
              ) : null}
              {allHaveEnded && (
                <button className="ContinueForm" onClick={handleButton} style={{ cursor: "pointer" }}>
                  Descargar Documento
                </button>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}
