import React from "react";

import { Grid, Container } from "@material-ui/core";

import Header from "./Header";

import HomepageSearch from "./HomePageSearch";
import ContainerForm from "pages/Procedure/ProcedureReview/ContainerForm";

export default function LivePreviewExample() {
  return (
    <>
      <ContainerForm
        documento={{ _category: "Bienvenidos a Gestdoc", _nameSchema: "Busque su trámite" }}
        footer={<></>}
      >
        <HomepageSearch />
      </ContainerForm>
    </>
  );
}
