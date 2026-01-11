import React from "react";
import { Card, CardContent } from "@material-ui/core";
import { Facebook } from "react-content-loader";
import Header from "./styles-forms/Header";

export default function ProcedureLoading() {
  return (
    <div className="ProcedureLoading">
      <Header documento={{ _category: "", _nameSchema: "Cargando Información..." }} position={"center"} />
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
            height: "100vh",
          }}
          className="mb-5 card-box card-box-border-bottom border-danger sectionDoc left-card container2"
        >
          <CardContent
            style={{
              minWidth: "918px !important",
            }}
          >
            <Facebook />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
