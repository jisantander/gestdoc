import React, { useState } from "react";
import { DropzoneArea } from "material-ui-dropzone";
import axios from "../../../utils/axios";

export default function ProcedureUploadForm({ transaction, reload }) {
  const [files, setFiles] = useState([]);
  const handleChange = (filesUploaded) => {
    setFiles(filesUploaded);
  };
  const handleSubmit = (e) => {
    e.preventDefault();
    if (!files[0]) {
      alert("Por favor seleccione un documento a firmar");
    } else {
      const data = new FormData();
      data.append("file", files[0], files[0].name);
      axios.post(`api/documento/upload/${transaction}`, data).then((res) => {
        reload();
      });
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <DropzoneArea
        onChange={handleChange}
        acceptedFiles={["application/pdf"]}
        filesLimit={1}
        dropzoneText="Arraste el archivo o haga click aquí para seleccionar"
        getFileAddedMessage={(fileName) => `El archivo ${fileName} ha sido añadido`}
        getFileRemovedMessage={(fileName) => `El archivo ${fileName} ha sido eliminado de la selección`}
      />
      <div style={{ justifyContent: "center", display: "flex" }}>
        <button style={{ left: 0 }} class="ContinueForm" type="submit">
          Subir Archivo
        </button>
      </div>
    </form>
  );
}
