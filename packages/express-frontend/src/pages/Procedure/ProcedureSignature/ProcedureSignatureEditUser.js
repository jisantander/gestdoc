import React from "react";
import IconButton from "@material-ui/core/IconButton";
import { TextField } from "@material-ui/core";
import Close from "@material-ui/icons/Close";
import "./style.css";

const ProcedureSignatureEditUser = ({
  emails,
  nombres,
  appats,
  apmats,
  ruts,
  handleEmail,
  handleNombres,
  handleAppat,
  handleApmat,
  handleRuts,
  handleRemove = false,
}) => {
  return (
    <tbody>
      {emails.map((it, i) => {
        return (
          <tr
            key={i}
            style={{
              paddingTop: "34px",
              display: "block",
              textAlign: "-webkit-center",
              borderStyle: "solid",
              borderRadius: "18px",
              borderWidth: "1px",
              marginTop: "35px",
              borderColor: "#bfbfbf",
            }}
          >
            {typeof handleRemove !== "boolean" && (
              <IconButton
                style={{ backgroundColor: "#28388e", marginTop: "-60px", color: "white", marginRight: "-22px" }}
                aria-label="delete"
                onClick={handleRemove(i)}
              >
                <Close />
              </IconButton>
            )}
            <td className="text-center" style={{ display: "flex" }}>
              <div style={{ marginBottom: "23px" }}>
                <TextField
                  InputLabelProps={{
                    shrink: true,
                  }}
                  className="input_sign"
                  value={emails[i]}
                  onChange={handleEmail(i)}
                  label="Email"
                  placeholder="nombre@gmail.com"
                  style={{ margin: "15px" }}
                />

                <TextField
                  InputLabelProps={{
                    shrink: true,
                  }}
                  className="input_sign"
                  value={nombres[i]}
                  onChange={handleNombres(i)}
                  label="Nombre"
                  placeholder="Juan"
                  style={{ margin: "15px" }}
                />
              </div>
              <div>
                <TextField
                  InputLabelProps={{
                    shrink: true,
                  }}
                  className="input_sign"
                  value={appats[i]}
                  onChange={handleAppat(i)}
                  label="Apellido Paterno"
                  placeholder="Perez"
                  style={{ margin: "15px" }}
                />

                <TextField
                  InputLabelProps={{
                    shrink: true,
                  }}
                  className="input_sign"
                  value={apmats[i]}
                  onChange={handleApmat(i)}
                  label="Apellido Materno"
                  placeholder="Perez"
                  style={{ margin: "15px" }}
                />
              </div>
              <div>
                <TextField
                  InputLabelProps={{
                    shrink: true,
                  }}
                  className="input_sign"
                  value={ruts[i]}
                  onChange={handleRuts(i)}
                  label="Rut"
                  placeholder="19.112.039-7"
                  style={{ margin: "15px" }}
                />
              </div>
            </td>
          </tr>
        );
      })}
    </tbody>
  );
};

export default ProcedureSignatureEditUser;
