import React from "react";
import { Card, CardContent } from "@material-ui/core";
import Header from "./styles-forms/Header";

import logo from "../../logoGestdoc.svg";

export default function ProcedureError() {
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
        <div></div>
      </div>
      <div style={{ backgroundColor: "#f1f4fb" }}>
        <div className="ProcedureLoading">
          <Header documento={{ _category: "", _nameSchema: "Lo sentimos mucho :(" }} position={"center"} />
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
                <h4>El procedimiento solicitado no ha sido encontrado en nuestra base de datos.</h4>
                <span>
                  Si piensas que hubo un error, comunícate con <a href="mailto:soporte@resit.cl">soporte@resit.cl</a>
                </span>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </>
  );
}
