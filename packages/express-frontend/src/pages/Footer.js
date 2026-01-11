import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import Grid from "@material-ui/core/Grid";
import FacebookIcon from "@material-ui/icons/Facebook";
import InstagramIcon from "@material-ui/icons/Instagram";
import YouTubeIcon from "@material-ui/icons/YouTube";

const useStyles = makeStyles((theme) => ({
  root: {
    width: "100%",
    bottom: 0,
  },
}));

export default function Footer() {
  const classes = useStyles();

  return (
    <>
      <div id="content-wrap"></div>
      <footer id="holi" className={classes.root}>
        <div
          style={{
            padding: 40,
            maxWidth: "1400px",
            margin: "0 auto",
          }}
        >
          <Grid container direction="row" justifyContent="center" alignItems="center">
            <Grid item xs={2} justifyContent="center" alignItems="center"></Grid>
            <Grid item xs={2}>
              <div className="footer__links">
                <ul style={{ listStyleType: "none" }}>
                  <li className="footer__links__title">Ayuda</li>
                  <li className="">
                    <a href="https://gestdoc.cl/preguntas-frecuentes"> Preguntas frecuentes</a>
                  </li>
                  <li className="">
                    <a href="https://gestdoc.cl/sample-page/privacy-policy"> Políticas</a>
                  </li>
                </ul>
              </div>
            </Grid>
            <Grid item xs={8}>
              <div className={classes.paper2}>
                <div className="footer__info">
                  <p className="footer__description">contacto@gestdoc.cl</p>
                  <p className="footer__description">+56 9 8484 4444</p>
                </div>
              </div>
            </Grid>
          </Grid>
        </div>
      </footer>
    </>
  );
}
