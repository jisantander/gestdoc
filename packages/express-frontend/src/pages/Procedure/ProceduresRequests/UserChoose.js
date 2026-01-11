import React from "react";
import IconButton from "@material-ui/core/IconButton";
import { TextField } from "@material-ui/core";
import Close from "@material-ui/icons/Close";

const UserChoose = ({
  emails,
  nombres,
  apellidos,
  apmats,
  ruts,
  handleEmail,
  handleNombres,
  handleApellidos,
  handleApmats,
  handleRuts,
  handleRemove,
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
            <IconButton
              style={{ backgroundColor: "#28388e", marginTop: "-60px", color: "white", marginRight: "-22px" }}
              aria-label="delete"
              className="closeUserSign"
              onClick={handleRemove(i)}
            >
              <Close />
            </IconButton>
            <td className="text-center card-signer-users">
              <div style={{ marginBottom: "23px" }}>
                <TextField
                  className="input_sign"
                  InputLabelProps={{
                    shrink: true,
                  }}
                  value={nombres[i]}
                  onChange={handleNombres(i)}
                  label="Nombre"
                  placeholder="Juan"
                  style={{ margin: "15px" }}
                />
                <TextField
                  className="input_sign"
                  InputLabelProps={{
                    shrink: true,
                  }}
                  value={apellidos[i]}
                  onChange={handleApellidos(i)}
                  label={handleApmats ? "Apellido Paterno" : "Apellido"}
                  placeholder="Perez"
                  style={{ margin: "15px" }}
                />

                {handleApmats && (
                  <TextField
                    InputLabelProps={{
                      shrink: true,
                    }}
                    className="input_sign"
                    value={apmats[i]}
                    onChange={handleApmats(i)}
                    label="Apellido Materno"
                    placeholder="Perez"
                    style={{ margin: "15px" }}
                  />
                )}

                <TextField
                  className="input_sign"
                  InputLabelProps={{
                    shrink: true,
                  }}
                  value={ruts[i]}
                  onChange={handleRuts(i)}
                  label="Rut"
                  placeholder="19.112.039-7"
                  style={{ margin: "15px" }}
                />
                <TextField
                  className="input_sign"
                  InputLabelProps={{
                    shrink: true,
                  }}
                  value={emails[i]}
                  onChange={handleEmail(i)}
                  label="Email"
                  placeholder="nombre@gmail.com"
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

export default UserChoose;
