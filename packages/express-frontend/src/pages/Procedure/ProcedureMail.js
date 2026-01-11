import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
//import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import ContainerForm from "./ProcedureReview/ContainerForm";

import { setNextStage } from "../../reducers/documento";

//import illustration1 from '../../assets/images/illustrations/pack4/modern_professional.svg';

export default function ProcedureMail() {
  const dispatch = useDispatch();
  const { transaction, participant } = useParams();
  const documento = useSelector(({ documento }) => documento.documento);
  const gestores = useSelector(({ documento }) => documento.gestores);
  const { participants } = useSelector(({ documento }) => documento.documento);

  const [cont, setCont] = useState(5);

  let participantData = null;
  if (participant && documento) {
    participantData = participants.find((it) => it.id === participant);
  } else if (documento) {
    participantData = participants[0];
  }

  useEffect(() => {
    const handleNext = async () => {
      let participantDataCurrent = null;
      if (participant && documento) {
        participantDataCurrent = gestores.find((it) => it.id === participant);
      } else if (documento) {
        participantDataCurrent = gestores[0];
      }

      dispatch(
        setNextStage(transaction, participantDataCurrent.current, {
          type: "email",
          titleStage: participantData.next.name,
          notification: participantData.next["custom:notification"] === "true",
          value: participantData.email._id,
          name: participantData.email._title,
        })
      );
    };
    if (transaction && cont === 0) {
      handleNext();
    }
    // eslint-disable-next-line
  }, [transaction, cont]);

  useEffect(() => {
    const intervalId = setInterval(() => {
      if (cont === 0) clearInterval(intervalId);
      else {
        setCont((prevCont) => {
          return prevCont - 1;
        });
      }
    }, 1000);
    return () => clearInterval(intervalId);
    // eslint-disable-next-line
  }, []);

  return (
    <ContainerForm documento={documento} footer={<></>}>
      <div className="">
        <div style={{ textAlign: "center", padding: 20 }}>
          <h3 className="font-size-xxl line-height-sm font-weight-light d-block px-3 mb-3 text-black-50">
            Estamos haciendo un envío de correo.
          </h3>
          <p>El proceso continuará en {cont} segundos</p>
        </div>
      </div>
    </ContainerForm>
  );
}
