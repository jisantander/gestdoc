import React, { useEffect } from "react";
import { useParams } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { Button, Grid } from "@material-ui/core";

import axios from "../../utils/axios";
import { getDocumento } from "../../reducers/documento";

import { StyledObject } from "../Procedure/styles";

export default function DocumentScanned() {
  const dispatch = useDispatch();
  const { transaction } = useParams();
  const signatures = useSelector(({ documento }) => documento.signatures);

  //const urlPdf = `api/pdf/final/${transaction}`;
  const urlPdf = `${window.location.origin}/api/pdf/final/${transaction}`;

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

  useEffect(() => {
    dispatch(getDocumento(transaction));
    // eslint-disable-next-line
  }, []);

  return (
    <div className="text-center p-5">
      <h4 className="font-weight-bold mt-4">Documento validado con éxito</h4>
      <Grid container spacing={6}>
        <Grid item md={9}>
          <StyledObject data={urlPdf} type="application/pdf">
            <embed src={urlPdf} type="application/pdf" />
          </StyledObject>
        </Grid>
        <Grid item md={3}>
          <p>
            Este documento ha sido firmado con <strong>CLAVE ÚNICA</strong> por las siguientes personas:
          </p>
          {signatures ? (
            <ul>
              {signatures.map((it) => {
                return (
                  <li key={it.id_token}>
                    {it.data.name.nombres.join(" ")} {it.data.name.apellidos.join(" ")} - {it.data.RolUnico.numero}-
                    {it.data.RolUnico.DV}
                  </li>
                );
              })}
            </ul>
          ) : null}
          <Button
            onClick={handleButton}
            variant="text"
            className="btn-outline-first"
            title="Descargar Documento validado"
          >
            <span>Descargar Documento validado</span>
          </Button>
        </Grid>
      </Grid>
    </div>
  );
}
