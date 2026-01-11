import React, { useState } from "react";
import { useLocation } from "react-router-dom";
import { useSelector } from "react-redux";
import queryString from "query-string";
import { Formik } from "formik";
import { Grid, Container, TextField } from "@material-ui/core";
import axios from "../../../utils/axios";

//import illustration1 from '../../assets/images/illustrations/pack1/handshake.svg';

export default function Forgot({ cbCreate = null }) {
  const location = useLocation();
  const emailDocument = useSelector(({ documento }) => documento.email);
  const [response, setResponse] = useState("");

  const parsed = queryString.parse(location.search);

  let content = (
    <Formik
      initialValues={{
        email: emailDocument || "",
        password: "",
        name: "",
        surname: "",
      }}
      validate={(values) => {
        const errors = {};
        if (!values.email) {
          errors.email = "Requerido";
        } else if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(values.email)) {
          errors.email = "Correo electrónico inválido";
        }

        return errors;
      }}
      onSubmit={async (values, { setSubmitting }) => {
        const { data } = await axios.post("/api/auth/forgot_pass", {
          _email: values.email,
        });
        if (data.message) {
          setResponse(data.message);
        } else {
          setResponse("ocurrio un error");
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
                Ingresa tu correo para cambio de contraseña
              </h1>
              <p className="font-size-lg mb-0 text-black-50" style={{ color: "#19239a" }}>
                Te enviaremos un link con la opción de cambiar tu contraseña
              </p>
            </div>
            <div className="mb-3">
              <p className="font-size-lg mb-0 text-black-50" style={{ color: "#19239a" }}>
                Correo Electrónico
              </p>
              <TextField
                className="input_sign"
                variant="outlined"
                size="small"
                fullWidth
                placeholder="Ingresa tu correo electrónico"
                type="email"
                name="email"
                onChange={handleChange}
                onBlur={handleBlur}
                value={values.email}
              />
              {errors.email && touched.email && errors.email}
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
  if (parsed.bpmn) {
    if (!emailDocument) content = <span>cargando...</span>;
  }
  return (
    <>
      <div className="app-wrapper bg-white min-vh-100">
        <div className="app-main min-vh-100">
          <div className="app-content p-0">
            <div className="app-content--inner d-flex align-items-center">
              <div className="flex-grow-1 w-100 d-flex align-items-center">
                <div className="bg-composed-wrapper--content py-5">
                  <Container>
                    <Grid
                      container
                      spacing={6}
                      style={{
                        display: "flex",
                        placeContent: "center",
                      }}
                    >
                      <Grid item lg={6} className="d-flex align-items-center">
                        {content}
                        {response}
                      </Grid>
                    </Grid>
                  </Container>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
