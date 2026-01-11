import React, { useState, useEffect } from "react";
import { useHistory } from "react-router-dom";
import { useDispatch } from "react-redux";
import { TextField, Dialog, Button } from "@material-ui/core";
import Autocomplete from "@material-ui/lab/Autocomplete";

import axios from "../../utils/axios";
import { setDocument, setData } from "../../reducers/documento";
import "./style.css";

export default function HomepageSearch() {
  const dispatch = useDispatch();

  let history = useHistory();

  const [tramites, setTramites] = useState([]);
  const [selected, setSelected] = useState(false);
  const [open, setOpen] = useState(false);

  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handlerSelect = (e, value) => {
    setSelected(value);
    handleOpen();
  };

  const handleStep = async () => {
    try {
      handleClose();
      dispatch(setDocument(selected));
      //history.push(`/start/${selected.id}`);
      const { data: document } = await axios.post("/api/documento", {
        bpmn: selected.id,
      });
      dispatch(setData(document));
      history.push(`/procedure/${document.id}`);
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    const loadData = async () => {
      const { data } = await axios.post("/api/tramites");
      setTramites(
        data.map((it) => {
          it.id = it._id;
          return it;
        })
      );
    };
    loadData();
  }, []);

  if (tramites.length === 0) return <span>Cargando...</span>;
  return (
    <div id="homeInitial">
      <h3 style={{ textAlign: "center", color: "#fff", marginTop: "10px" }}>Encuentra el documento que necesitas:</h3>
      <Autocomplete
        id="combo-box-demo"
        className=" input_gestdoc"
        options={tramites}
        getOptionLabel={(option) => option._nameSchema}
        onChange={handlerSelect}
        style={{ width: "100%" }}
        renderInput={(params) => <TextField {...params} label="Seleccione su trámite" variant="outlined" />}
      />
      <Dialog open={open} scroll="body" maxWidth="md" onClose={handleClose} classes={{ paper: "border-0 bg-white" }}>
        <div className="m-4">
          {selected ? (
            <>
              <div>
                <Button
                  className="rounded-sm text-nowrap font-size-xs font-weight-bold text-uppercase shadow-second-sm btn-success"
                  onClick={handleStep}
                >
                  {/*<FontAwesomeIcon icon={['fas', 'faCheck']} />*/}
                  <span>Continuar</span>
                </Button>
                <Button
                  className="rounded-sm text-nowrap font-size-xs btn-icon font-weight-bold text-uppercase shadow-second-sm btn-warning"
                  onClick={handleClose}
                >
                  {/*  <FontAwesomeIcon icon={['fas', 'faSignOutAlt']} />*/}
                  <span>Cancelar</span>
                </Button>
              </div>
            </>
          ) : (
            <h4>Para continuar, debe escoger un documento.</h4>
          )}
        </div>
      </Dialog>
    </div>
  );
}
