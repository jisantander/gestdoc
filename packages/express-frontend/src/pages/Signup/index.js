import React, { useEffect } from "react";
import { useHistory, useLocation } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import queryString from "query-string";
import { Formik } from "formik";
import { Grid, Container, TextField } from "@material-ui/core";

import { getDocumento } from "../../reducers/documento";
import { signup } from "../../reducers/auth";

//import illustration1 from '../../assets/images/illustrations/pack1/handshake.svg';

export default function Signup({ cbCreate = null }) {
  const history = useHistory();
  const location = useLocation();
  const dispatch = useDispatch();
  const isAuth = useSelector(({ auth }) => !!auth.token);
  const emailDocument = useSelector(({ documento }) => documento.email);
  //const [response, setResponse] = useState('')

  const auth = useSelector(({ auth }) => auth);

  const parsed = queryString.parse(location.search);

  useEffect(() => {
    if (parsed.bpmn) {
      dispatch(getDocumento(parsed.bpmn));
    }
    if (isAuth) {
      history.push("/orders");
    }
    // eslint-disable-next-line
  }, [isAuth]);
  const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
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
        if (!values.password) {
          errors.password = "Debe ingresar una contraseña!";
        }
        if (!values.name) {
          errors.name = "Debe ingresar sus nombres!";
        }
        if (!values.surname) {
          errors.surname = "Debe ingresar sus apellidos!";
        }
        return errors;
      }}
      onSubmit={async (values, { setSubmitting }) => {
        dispatch(signup(values));
        await delay(2000);
        //setSubmitting();
      }}
    >
      {({ values, errors, touched, handleChange, handleBlur, handleSubmit, isSubmitting }) => (
        <form onSubmit={handleSubmit}>
          <div className="divider-v d-none d-lg-block divider-v-md" />
          <div className="w-100 pr-0 pr-lg-5">
            <div className="text-center mb-4">
              <h1 className="display-4 mb-1 font-weight-bold" style={{ color: "#19239a" }}>
                Crea tu cuenta
              </h1>
              <p className="font-size-lg mb-0 text-black-50" style={{ color: "#19239a" }}>
                Comienza a administrar tus trámites con GestDoc
              </p>
            </div>
            <div className="mb-3">
              <p className="font-size-lg mb-0 text-black-50" style={{ color: "#19239a" }}>
                Correo Electrónico
              </p>
              <div>
                <TextField
                  className="input_sign"
                  variant="outlined"
                  size="small"
                  fullWidth
                  placeholder="Ingresa tu correo electrónico"
                  name="email"
                  onChange={handleChange}
                  onBlur={handleBlur}
                  value={values.email}
                />
              </div>
              {errors.email && touched.email && errors.email}
            </div>
            <div className="mb-3">
              <div className="d-flex justify-content-between">
                <p className="font-size-lg mb-0 text-black-50" style={{ color: "#19239a" }}>
                  Contraseña
                </p>
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
              {errors.password && touched.password && errors.password}
            </div>
            <Grid container spacing={6}>
              <Grid item md={6}>
                <div>
                  <p className="font-size-lg mb-0 text-black-50" style={{ color: "#19239a" }}>
                    Nombres
                  </p>
                  <TextField
                    className="input_sign"
                    variant="outlined"
                    size="small"
                    fullWidth
                    placeholder="Ingresa tus nombres"
                    name="name"
                    onChange={handleChange}
                    onBlur={handleBlur}
                    value={values.name}
                  />
                  {errors.name && touched.name && errors.name}
                </div>
              </Grid>
              <Grid item md={6}>
                <div>
                  <p className="font-size-lg mb-0 text-black-50" style={{ color: "#19239a" }}>
                    Apellidos
                  </p>
                  <TextField
                    className="input_sign"
                    variant="outlined"
                    size="small"
                    fullWidth
                    placeholder="Ingresa tus apellidos"
                    name="surname"
                    onChange={handleChange}
                    onBlur={handleBlur}
                    value={values.surname}
                  />
                  {errors.surname && touched.surname && errors.surname}
                </div>
              </Grid>
            </Grid>

            <div style={{ margin: "20px" }}> {auth.error ? auth.error.response.data.message.message : ""}</div>
            {/*  
                  <div className="my-4">
              Al hacer click en <strong>Crear cuenta</strong> aceptas nuestros
              términos y condiciones.
            </div>
            */}

            <div className="text-center mb-4">
              {!isSubmitting ? (
                <div style={{ display: "flex", placeContent: "center", marginTop: "10px" }}>
                  <button type="submit" className="ContinueForm" style={{ marginLeft: "-26px" }}>
                    {" "}
                    Crear cuenta
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
