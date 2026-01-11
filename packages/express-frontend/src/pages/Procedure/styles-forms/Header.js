import React from "react";
import "../ProcedureForm.css";
import { Grid } from "@material-ui/core";

export default function Header({ documento, position }) {
  const { _category, _nameSchema } = documento;
  return (
    <>
      <div className="headerFlow headerReview " style={{ flexGrow: 1, height: "350px", backgroundColor: "#1d0c8e" }}>
        <Grid
          className="titleFlow tileReview"
          style={{ height: "70%" }}
          container
          direction="row"
          justify={position ? "center" : "flex-start"}
          alignItems="center"
        >
          <Grid
            item
            style={
              position
                ? { textAlign: "center" }
                : { display: "flex", justifyContent: "center", width: "100%", margin: 10 }
            }
          >
            <h3 style={{ color: "#fff", fontSize: "22px", fontWeight: "500" }}>{_category}</h3>
            <h1 style={{ color: "#fff", fontStyle: "italic", marginTop: "-21px !important" }}>{_nameSchema}</h1>
          </Grid>
        </Grid>
      </div>
    </>
  );
}
