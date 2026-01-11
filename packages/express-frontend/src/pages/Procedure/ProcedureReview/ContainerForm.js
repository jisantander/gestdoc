import React from "react";
import { TextField, Card, CardContent } from "@material-ui/core";

import Header from "../styles-forms/Header";

const ContainerForm = ({ children, documento, footer = null }) => {
  return (
    <>
      <Header documento={documento} position={"center"} />
      <div
        class="grid-container2"
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
            overflow: "auto",
          }}
          className="mb-5 card-box card-box-border-bottom border-danger sectionDoc left-card container2"
        >
          <CardContent
            style={{
              minWidth: "918px !important",
            }}
          >
            {children}
          </CardContent>
        </Card>
        {footer}
      </div>
    </>
  );
};

export default ContainerForm;
