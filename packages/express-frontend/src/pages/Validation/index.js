import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import axios from "../../utils/axios";
import Header from "pages/Procedure/styles-forms/Header";
import CardGestdoc from "components/CardGestdoc";

const Validation = () => {
  //Pegarle a la API Hash. para cambiar el validate a TRUE.

  let { slug } = useParams();
  const [response, setresponse] = useState(null);

  useEffect(() => {
    axios({
      url: `/api/verification_email/${slug}/`,
      method: "GET",
    }).then((response) => {
      try {
        if (response.data.email) {
          setresponse(true);
        } else {
          setresponse(false);
        }
      } catch (error) {
        setresponse(false);
      }
    });
  }, [slug]);
  return (
    <>
      {response === true ? (
        <>
          <Header
            documento={{ _category: "Confirmación de correo", _nameSchema: "Tu correo está confirmado" }}
            position={"center"}
          />
          <CardGestdoc>
            <p>Puedes continuar con tu trámite con tu nueva cuenta.</p>
          </CardGestdoc>
        </>
      ) : null}

      {response === false && (
        <>
          <Header
            documento={{ _category: "Confirmación de correo", _nameSchema: "Link vencido" }}
            position={"center"}
          />
          <CardGestdoc>
            <p>Este link ya no está disponible</p>
          </CardGestdoc>
        </>
      )}
    </>
  );
};

export default Validation;
