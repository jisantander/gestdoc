import React, { useState, useEffect, useRef } from "react";
import { useParams } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { Grid, TextField, Button, Tooltip, Card, CardContent } from "@material-ui/core";
import GoogleLogin from "react-google-login";
import Recaptcha from "react-recaptcha";
import { Formik } from "formik";
import { setDocEmail, setNextStage } from "../../reducers/documento";
//import isEmail from "../../utils/isEmail";
import Header from "./styles-forms/Header";

import useDidMountEffect from "../../hooks/useDidMountEffect";

import { signin, authGoogle } from "../../reducers/auth";
import Signup from "pages/Signup";
import Forgot from "./Forgot";

//import illustration1 from '../../assets/images/illustrations/pack1/authentication.svg';

export default function ChooseAccount({ canGoBack, handleBack }) {
  const refSending = useRef(false);

  const dispatch = useDispatch();
  const { transaction, participant } = useParams();
  const emailDoc = useSelector(({ documento }) => documento.email);
  const isAuth = useSelector(({ auth }) => auth.token !== null);
  const emailUser = useSelector(({ auth }) => auth.email);
  const auth = useSelector(({ auth }) => auth);
  const documento = useSelector(({ documento }) => documento.documento);
  const gestores = useSelector(({ documento }) => documento.gestores);
  const { participants } = useSelector(({ documento }) => documento.documento);
  // eslint-disable-next-line
  const [email, setEmail] = useState("");
  const [verified, setVerified] = useState(false);

  const [optionView, setOptionView] = useState("login");

  /*const handleInput = (e) => {
    const value = e.target.value;
    setEmail(value);
    if (isEmail(value)) {
      dispatch(setDocEmail(value));
    } else {
      dispatch(setDocEmail(false));
    }
  };*/

  const responseGoogle = async (response) => {
    if (response.profileObj) {
      dispatch(authGoogle(response));
      //esperar el response.
      // dispatch(setDocEmail(response.profileObj.email));
      //createTransaction(response.profileObj.email);
    }
  };

  const responseGoogleFail = async (response) => {
    console.log(response);
  };

  const startDoc = (e) => {
    if (e) e.preventDefault();
    //createTransaction();
    if (!verified) executeCaptcha();
    else createTransaction();
  };

  let participantData = null;
  if (participant && documento) {
    participantData = participants.find((it) => it.id === participant);
  } else if (documento) {
    participantData = participants[0];
  }

  const createTransaction = (emailOpt = "") => {
    let participantDataCurrent = null;
    if (participant && documento) {
      participantDataCurrent = gestores.find((it) => it.id === participant);
    } else if (documento) {
      participantDataCurrent = gestores[0];
    }
    if (!refSending.current) {
      refSending.current = true;
    } else {
      return alert("Inicio de sesión en proceso");
    }
    dispatch(
      setNextStage(transaction, participantDataCurrent.current, {
        type: "sign_in",
        titleStage: participantData.next.name,
        notification: participantData.next["custom:notification"] === "true",
        value: email || emailDoc || emailUser || emailOpt,
      })
    );
  };

  // create a variable to store the component instance
  let recaptchaInstance;

  // manually trigger reCAPTCHA execution
  const executeCaptcha = function () {
    recaptchaInstance.execute();
  };

  // executed once the captcha has been verified
  // can be used to post forms, redirect, etc.
  const verifyCallback = function (response) {
    setVerified(true);
    startDoc();
  };

  useDidMountEffect(() => {
    if (isAuth) {
      createTransaction();
    }
    // eslint-disable-next-line
  }, [isAuth]);
  useDidMountEffect(() => {
    if (emailUser) {
      dispatch(setDocEmail(emailUser));
    }
    // eslint-disable-next-line
  }, [emailUser]);

  useEffect(() => {
    executeCaptcha();
    if (isAuth) {
      createTransaction();
    }
    // eslint-disable-next-line
  }, []);

  let content = (
    <Formik
      initialValues={{
        email: "",
        password: "",
      }}
      validate={(values) => {
        try {
          //set error message
          auth.error.response.data.message.message = "";
        } catch (error) {}
        const errors = {};
        if (!values.email) {
          errors.email = "Requerido";
        } else if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(values.email)) {
          errors.email = "Correo electrónico inválido";
        }
        if (!values.password) {
          errors.password = "Debe ingresar una contraseña!";
        }
        return errors;
      }}
      onSubmit={async (values, actions) => {
        try {
          dispatch(signin(values));
        } catch (errors) {
          actions.setStatus(errors);
        }
      }}
    >
      {({ values, errors, touched, handleChange, handleBlur, handleSubmit, isSubmitting }) => (
        <form onSubmit={handleSubmit}>
          <div>
            <div className="mb-3">
              <p className="font-size-lg mb-0 text-black-50" style={{ color: "rgb(25, 35, 154)" }}>
                Correo electrónico
              </p>
              <TextField
                className="input_sign"
                variant="outlined"
                size="small"
                fullWidth
                placeholder="email"
                name="email"
                onChange={handleChange}
                onBlur={handleBlur}
                value={values.email}
              />
              {errors.email && touched.email && errors.email}
            </div>
            <div className="mb-4">
              <div className="d-flex justify-content-between">
                <p className="font-size-lg mb-0 text-black-50" style={{ color: "rgb(25, 35, 154)" }}>
                  Contraseña
                </p>

                {/*<Link to="/recover">
                  Forgot password?
	  			</Link>*/}
              </div>
              <TextField
                className="input_sign"
                variant="outlined"
                size="small"
                fullWidth
                placeholder="Ingresa tu contraseña"
                name="password"
                type="password"
                onChange={handleChange}
                onBlur={handleBlur}
                value={values.password}
              />
              <div style={{ display: "grid", marginTop: "15px" }}>
                <span>{errors.password && touched.password && errors.password}</span>
                <span>
                  {!errors.password && auth.error && auth.error.response && (
                    <>{console.log(auth.error.response.data.message.message)}</>
                  )}
                </span>
              </div>
            </div>
            <div style={{ display: "flex", placeContent: "center" }}>
              <button type="submit" className="ContinueForm" style={{ marginLeft: "-26px" }}>
                {" "}
                Inicia sesión
              </button>
            </div>
          </div>
        </form>
      )}
    </Formik>
  );

  return (
    <>
      <Header documento={documento} position={"center"} />

      <Recaptcha
        ref={(e) => (recaptchaInstance = e)}
        sitekey="6Ld-B88ZAAAAAMAOXt8hzUPxeQq5qIRCy8xfmgVx"
        size="invisible"
        verifyCallback={verifyCallback}
        onloadCallback={() => console.log("carga...")}
      />

      <Grid id="center-form" container direction="row" justify="center" alignItems="center">
        <Grid item xl={4} md={6} style={{ marginTop: "-138px", position: "initial", minWidth: "50%" }}>
          <Card
            className="mb-5 card-box card-box-border-bottom border-success justForm"
            style={{ borderRadius: "25px", textAlign: "-webkit-center" }}
          >
            {optionView === "login" && (
              <CardContent style={{ paddingLeft: "50px", paddingRight: "50px" }}>
                <Grid item lg={6} className="d-flex align-items-center">
                  <div className="divider-v d-none d-lg-block divider-v-md" />
                  <div className="w-100 pr-0 pr-lg-5">
                    <div className="text-black mt-3">
                      <span className="text-center">
                        <h1 className="display-4 mb-1 font-weight-bold" style={{ color: "#19239a" }}>
                          Inicia sesión
                        </h1>
                        <p className="font-size-lg mb-0 text-black-50" style={{ color: "#19239a" }}>
                          Para continuar con tu trámite, debemos tener un correo donde enviar tu información.
                        </p>
                      </span>
                      <div className="bg-secondary rounded p-4 my-4">
                        <Grid container spacing={6}>
                          <Grid item md={12}>
                            <Tooltip title="Google" arrow>
                              <GoogleLogin
                                clientId="780265444499-oi0sa86lg23lsr1kqf43qmuqbh6sog0k.apps.googleusercontent.com"
                                buttonText="Identificarme con mi correo de Google"
                                onSuccess={responseGoogle}
                                onFailure={responseGoogleFail}
                                cookiePolicy={"single_host_origin"}
                                scope="profile"
                              />
                            </Tooltip>
                          </Grid>
                        </Grid>
                      </div>
                      <div>{content}</div>
                    </div>
                  </div>
                </Grid>
                <Grid
                  style={{
                    marginTop: "20px",
                  }}
                  item
                  lg={6}
                  className="d-none d-lg-flex align-items-center"
                >
                  <div className="text-center pt-4 text-black-50">
                    <p className="font-size-lg mb-0 text-black-50" style={{ color: "#19239a" }}>
                      ¿No tiene cuenta?{" "}
                    </p>
                    <Button
                      onClick={() => {
                        setOptionView("register");
                      }}
                      variant="outlined"
                      color="primary"
                      href="#outlined-buttons"
                    >
                      Crea tu cuenta ahora
                    </Button>
                    <Button
                      onClick={() => {
                        setOptionView("forgot");
                      }}
                      variant="outlined"
                      color="primary"
                      href="#outlined-buttons"
                    >
                      Olvide mi contraseña
                    </Button>
                  </div>
                </Grid>
              </CardContent>
            )}

            {optionView === "register" && (
              <>
                <Button
                  style={{ margin: "12px" }}
                  onClick={() => {
                    setOptionView("login");
                  }}
                  variant="outlined"
                  color="primary"
                  href="#outlined-buttons"
                >
                  Iniciar Sesión
                </Button>
                <Signup />
              </>
            )}

            {optionView === "forgot" && (
              <>
                <Button
                  style={{ margin: "12px" }}
                  onClick={() => {
                    setOptionView("login");
                  }}
                  variant="outlined"
                  color="primary"
                  href="#outlined-buttons"
                >
                  volver
                </Button>

                <Forgot />
              </>
            )}
            <div style={{ display: "flex", placeContent: "center" }}>
              {canGoBack && (
                <button type="button" className="ContinueForm" style={{ marginLeft: "-26px" }} onClick={handleBack}>
                  {" "}
                  Retroceder
                </button>
              )}
            </div>
          </Card>
        </Grid>
      </Grid>
    </>
  );
}
