import React, { useEffect } from "react";
import { useParams, useHistory } from "react-router-dom";

import axios from "../utils/axios";

export default function Short() {
  const { short } = useParams();
  let history = useHistory();

  useEffect(() => {
    const loadData = async () => {
      try {
        const {
          data: { url },
        } = await axios.get(`/api/short/${short}`);
        history.push(url);
      } catch (e) {
        console.error(e);
        alert("Dirección inválida");
      }
    };
    loadData();
    // eslint-disable-next-line
  }, []);

  return <div>cargando...</div>;
}
