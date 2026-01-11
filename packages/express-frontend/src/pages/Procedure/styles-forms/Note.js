import React from "react";
import { Card, CardContent } from "@material-ui/core";
import tips from "../../../ic__tips.svg";

export default function Note({ txt }) {
  return (
    <Card
      className="mb-5 card-box card-box-border-bottom border-success FormSignature"
      style={{
        borderRadius: "25px",
        borderStyle: " dotted",
        borderColor: "#6e7bfc",
        marginTop: "60px",
      }}
    >
      <div
        style={{
          display: "flex",
          placeContent: "center",
        }}
      >
        <img
          style={{
            height: "39px",
            marginTop: "-20px",
            zIndex: 9,
            position: "absolute",
            backgroundColor: "#fff",
          }}
          src={tips}
          alt="Tip"
        />
      </div>
      <CardContent style={{ paddingLeft: "50px", paddingRight: "50px" }}>
        <div style={{ display: "flex", color: "#4a45a3" }}>
          {" "}
          <p style={{ fontWeight: "bold", marginRight: "5px" }}>Nota:</p>
          <p> {txt}</p>
        </div>
      </CardContent>
    </Card>
  );
}
