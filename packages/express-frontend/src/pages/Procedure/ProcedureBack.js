import React from "react";
import { useDispatch } from "react-redux";
import { Dialog } from "@material-ui/core";

import axios from "../../utils/axios";
import { returning } from "../../reducers/documento";

export default function ProcedureBack({ handleClose, open, transaction, gestor }) {
  const dispatch = useDispatch();

  const handleBack = async () => {
    if (!gestor.previousId) {
      return alert("No se puede retroceder!");
    }
    const params = {
      current: gestor.previousId,
      activity: gestor.previous.id,
      participant: gestor.id,
      current_name: gestor.previous.name,
    };
    if (gestor.previous["custom:notification"]) {
      if (gestor.previous["custom:notification"] === "true") {
        params.notification = true;
      }
    }
    if (gestor.previous["custom:days"]) {
      params.vence = parseInt(gestor.previous["custom:days"]);
    }
    const {
      data: { data },
    } = await axios({
      url: `/api/documento/back/${transaction}`,
      method: "PUT",
      data: params,
    });
    dispatch(returning(data));
    handleClose();
  };

  return (
    <Dialog
      onClose={handleClose}
      aria-labelledby="simple-dialog-title"
      open={open}
      classes={{ paper: "modal-content rounded-lg" }}
    >
      <div className="text-center p-5" style={{ padding: "10px", backgroundColor: "#fff", color: "#241d50" }}>
        <div style={{ textAlign: "center" }}>
          <h4>Retroceder Procedimiento</h4>
        </div>
        <p>
          Se va a intentar retroceder el procedimiento hacia el paso denominado <strong>{gestor.previous.name}</strong>
        </p>
        <div
          style={{
            display: "flex",
            justifyContent: "center",
          }}
        >
          <button className="ContinueForm" onClick={handleBack}>
            Retroceder
          </button>
        </div>
      </div>
    </Dialog>
  );
}
