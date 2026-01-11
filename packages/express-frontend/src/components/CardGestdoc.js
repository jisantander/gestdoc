import React from 'react'
import { Card, Grid, CardContent } from "@material-ui/core";

export default function CardGestdoc({children}) {
  return (
    <Grid id="center-form" container direction="column" justify="center" alignItems="center">
    <Grid
      item
      xl={4}
      md={6}
      style={{ marginBottom: "50px", marginTop: "-138px", position: "initial", minWidth: "50%" }}
    >
      <Card
        className="mb-5 card-box card-box-border-bottom border-success justForm"
        style={{ borderRadius: "25px" }}
      >
        <CardContent style={{ paddingLeft: "50px", paddingRight: "50px" }}>
          <h2 style={{ color: "#322971" }}> {children}</h2>
        </CardContent>
      </Card>
    </Grid>
  </Grid>
  )
}
