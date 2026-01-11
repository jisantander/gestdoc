import React from "react";
import "./FormSignature.css";
import { Grid, Card, CardContent } from "@material-ui/core";
import Header from "./Header";
import Note from "./Note";

export default function FormSignature({ documento, onResult, canGoBack, handleBack }) {
  return (
    <>
      <Header documento={documento} position={"center"} />
      <Grid id="center-form" container direction="row" justify="center" alignItems="center">
        <Grid
          item
          xl={5}
          md={6}
          style={{ marginTop: "-138px", position: "initial", minWidth: "50%", marginBottom: "50px" }}
        >
          <Card className="" style={{ borderRadius: "25px" }}>
            <CardContent style={{ paddingLeft: "50px", paddingRight: "50px" }}>
              <h2 style={{ color: "#241d50" }}>Tipo de Firma</h2>
              <p style={{ color: "#241d50" }}>Seleccione una de las dos maneras de firmar su documento.</p>
              <Grid container direction="row" justify="center" alignItems="center">
                <Grid item xl={5} md={6}>
                  <Card style={{ borderRadius: "25px", marginRight: "15px" }}>
                    <CardContent
                      style={{ paddingLeft: "50px", paddingRight: "50px", display: " flex", flexDirection: "column" }}
                    >
                      <h2 className="title">Firma Simple</h2>
                      <p>Su costo es un poco menor al de la firma avanzada.</p>
                      <p>La firma electrónica adquiere la misma validez legal que la firma en papel.</p>
                      <p>Implementada por nuestros sistemas.</p>
                      <p>No es necesario contar con Clave Única.</p>
                      <button onClick={() => onResult("firma_simple")} className="ContinueSignature" type="submit">
                        Seleccionar
                      </button>
                    </CardContent>
                  </Card>
                </Grid>
                <Grid item xl={5} md={6}>
                  <Card style={{ borderRadius: "25px", marginLeft: "15px" }}>
                    <CardContent
                      style={{ paddingLeft: "50px", paddingRight: "50px", display: " flex", flexDirection: "column" }}
                    >
                      <h2 className="title">Firma Avanzada</h2>
                      <p>Utilizada principalmente en documentos sensibles.</p>
                      <p>Acreditada por una entidad certificada del Ministerio de Economía.</p>
                      <p>Los firmantes no pueden desconocer la firma del documento electrónico.</p>
                      <p>Debe contar con Clave Única.</p>
                      <button onClick={() => onResult("firma_avanzada")} className="ContinueSignature" type="submit">
                        Seleccionar
                      </button>
                    </CardContent>
                  </Card>
                </Grid>
                <Grid item xl={8} md={12}>
                  <Note txt={"Una vez seleccionada el tipo de firma no será posible modificarla posteriormente."} />
                </Grid>
                <Grid
                  item
                  xl={8}
                  md={12}
                  style={{
                    display: "flex",
                    justifyContent: "center",
                  }}
                >
                  {canGoBack && (
                    <button onClick={handleBack} className="ContinueSignature" type="button">
                      Retroceder
                    </button>
                  )}
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </>
  );
}
