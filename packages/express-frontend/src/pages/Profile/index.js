import React from "react";
import { Grid, Button, Card, TextField, Divider, CircularProgress } from "@material-ui/core";
import { Formik } from "formik";
import { useSelector } from "react-redux";

import axios from "../../utils/axios";

export default function Profile() {
  const isAuth = useSelector(({ auth }) => auth.token !== null);
  const { name, surname } = useSelector(({ auth }) => auth);

  return (
    <>
      <Grid container spacing={4}>
        <Grid item xs={12} lg={12}>
          <Card className="p-4 mb-4">
            <div className="font-size-lg font-weight-bold">Modifica tus datos</div>
            <Divider className="my-4" />
            {!isAuth ? (
              <CircularProgress color="secondary" />
            ) : (
              <Formik
                initialValues={{
                  name,
                  surname,
                }}
                validate={(values) => {
                  const errors = {};
                  if (!values.name) {
                    errors.name = "Debe ingresar un nombre!";
                  }
                  if (!values.surname) {
                    errors.surname = "Debe ingresar un apellido!";
                  }
                  return errors;
                }}
                onSubmit={async (values, { setSubmitting }) => {
                  setSubmitting(true);
                  await axios.put("/api/profile", { ...values });
                  setSubmitting(false);
                }}
              >
                {({ values, errors, touched, handleChange, handleBlur, handleSubmit, isSubmitting }) => (
                  <form onSubmit={handleSubmit}>
                    <Grid container spacing={4}>
                      <Grid item xs={12} lg={6}>
                        <div className="p-3">
                          <TextField
                            fullWidth
                            className="m-2"
                            id="standard-basic"
                            label="Nombres"
                            name="name"
                            onChange={handleChange}
                            onBlur={handleBlur}
                            value={values.name}
                          />
                          {errors.name && touched.name && errors.name}
                        </div>
                      </Grid>
                      <Grid item xs={12} lg={6}>
                        <div className="p-3">
                          <TextField
                            fullWidth
                            className="m-2"
                            id="standard-basic"
                            label="Apellidos"
                            name="surname"
                            onChange={handleChange}
                            onBlur={handleBlur}
                            value={values.surname}
                          />
                          {errors.surname && touched.surname && errors.surname}
                        </div>
                      </Grid>
                      {isSubmitting ? (
                        <CircularProgress color="secondary" />
                      ) : (
                        <Button
                          size="large"
                          fullWidth
                          type="submit"
                          className="text-uppercase font-weight-bold font-size-sm btn-primary"
                        >
                          Modificar datos
                        </Button>
                      )}
                    </Grid>
                  </form>
                )}
              </Formik>
            )}
          </Card>
        </Grid>
      </Grid>
    </>
  );
}
