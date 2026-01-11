import React, { useState } from "react";
import { useParams } from "react-router-dom";
import axios from "../../../utils/axios";
import { Card, TextField, Grid, CardContent } from "@material-ui/core";
import Header from "pages/Procedure/styles-forms/Header";
import passwordStrength from "check-password-strength";
import { Formik } from "formik";

const ChangePassword = () => {
  let { slug } = useParams();
  const [response, setresponse] = useState(null);

  let content = (
    <Formik
      initialValues={{
        password: "",
        password2: "",
      }}
      validate={(values) => {
        const errors = {};
        if (!values.password) {
          errors.password = "Requerido";
          return errors;
        }

        if (passwordStrength(values.password).id === 0) {
          errors.password = "La contraseña debe ser más segura, intenta con letras, números y mayusculas";
        }
        if (!values.password2) {
          errors.password2 = "Requerido";
        }
        if (values.password2 !== values.password) {
          errors.password2 = "Las contraseñas tienen que ser iguales";
        }

        return errors;
      }}
      onSubmit={async (values, { setSubmitting }) => {
        const { data } = await axios.post("/api/reset_password", {
          password: values.password,
          _hash: slug,
        });
        if (data.message) {
          setresponse("Este Link ya se utilizó anteriormente, debes solicitar un nuevo cambio de contraseña");
        } else {
          setresponse("Puedes continuar con tu trámite.");
        }
        setSubmitting();
      }}
    >
      {({ values, errors, touched, handleChange, handleBlur, handleSubmit, isSubmitting }) => (
        <form onSubmit={handleSubmit}>
          <div className="divider-v d-none d-lg-block divider-v-md" />
          <div className="w-100 pr-0 pr-lg-5">
            <div className="text-center mb-4">
              <h1 className="display-4 mb-1 font-weight-bold" style={{ color: "#19239a" }}>
                Ingreso de nueva contraseña
              </h1>
            </div>
            <div className="mb-3">
              <p className="font-size-lg mb-0 text-black-50" style={{ color: "#19239a" }}>
                Nueva contraseña
              </p>
              <TextField
                variant="outlined"
                size="small"
                fullWidth
                placeholder="Ingresa tu nueva contraseña"
                type="password"
                name="password"
                onChange={handleChange}
                onBlur={handleBlur}
                value={values.email}
              />
              {errors.password && touched.password && errors.password}
            </div>
            <div className="mb-3">
              <p className="font-size-lg mb-0 text-black-50" style={{ color: "#19239a" }}>
                Repita la nueva contraseña
              </p>
              <TextField
                variant="outlined"
                size="small"
                fullWidth
                placeholder="Ingresa tu nueva contraseña"
                type="password"
                name="password2"
                onChange={handleChange}
                onBlur={handleBlur}
                value={values.email}
              />
              {errors.password2 && touched.password2 && errors.password2}
            </div>

            <div className="text-center mb-4">
              {!isSubmitting ? (
                <div style={{ display: "flex", placeContent: "center", marginTop: "10px" }}>
                  <button type="submit" className="ContinueForm" style={{ marginLeft: "-26px" }}>
                    {" "}
                    Enviar
                  </button>
                </div>
              ) : (
                <span>Enviando...</span>
              )}
            </div>
          </div>
        </form>
      )}
    </Formik>
  );

  return (
    <>
      {response !== null ? (
        <>
          <Header
            documento={{ _category: "Contraseña cambiada", _nameSchema: "Tu nueva contraseña está lista" }}
            position={"center"}
          />
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
                  <h2 style={{ color: "#322971" }}> {response}</h2>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        </>
      ) : null}

      {response === null && (
        <>
          <Header
            documento={{ _category: "Ingres nueva contraseña", _nameSchema: "Cambio de contraseña" }}
            position={"center"}
          />
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
                <CardContent style={{ paddingLeft: "50px", paddingRight: "50px" }}>{content}</CardContent>
              </Card>
            </Grid>
          </Grid>
        </>
      )}
    </>
  );
};

export default ChangePassword;
