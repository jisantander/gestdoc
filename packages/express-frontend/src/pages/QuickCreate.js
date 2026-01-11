import React, { useState, useEffect } from "react";
import { useParams, useHistory } from "react-router-dom";
import { Grid, Container, TextField } from "@material-ui/core";

import axios from "../utils/axios";

export default function Short() {
  const { short } = useParams();
  let history = useHistory();
  const [bpmn, setBpmn] = useState({});
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(true);
  const [loading2, setLoading2] = useState(false);

  useEffect(() => {
    const loadData = async () => {
      try {
        const {
          data: { bpmn },
        } = await axios.get(`/api/quick/${short}`);
		setLoading(false);
		setBpmn(bpmn);
		const {
		  data: { _id },
		} = await axios.post(`/api/quick/${short}`, { email: '' });
		const newUrl = `/procedure/${_id}`;
		history.push(newUrl);
      } catch (e) {
        console.error(e);
        //alert("Dirección inválida");
      }
    };
    loadData();
    // eslint-disable-next-line
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading2(true);
    try {
      const {
		data: { _id },
	  } = await axios.post(`/api/quick/${short}`, { email });
	  const newUrl = `/procedure/${_id}`;
      history.push(newUrl);
    } catch (e) {
      console.error(e);
      alert("Hubo un error al crear el procedimiento.");
    } finally {
      setLoading2(false);
    }
  };

  if(loading) return <div>Cargando...</div>;

  const content = (
	<div className="w-100 pr-0 pr-lg-5">
		<div className="text-center mb-4">
			<h1 className="display-4 mb-1 font-weight-bold" style={{ color: "#19239a" }}>
			{bpmn._nameSchema}
			</h1>
			{bpmn.company && <p className="font-size-lg mb-0 text-black-50" style={{ color: "#19239a" }}>
			{bpmn.company}
			</p>}
		<p>Necesitamos su correo electrónico para poder iniciar el procedimiento:</p>
		<form onSubmit={handleSubmit}>
			<label>
			Correo Electrónico:
			<input
				type="email"
				value={email}
				onChange={(e) => setEmail(e.target.value)}
				required
			/>
			</label>
			<div style={{ display: "flex", placeContent: "center", marginTop: "10px" }}>
				<button type="submit" className="ContinueForm" style={{ marginLeft: "-26px" }} disabled={loading2}>
				{" "}
				{loading2 ? "Enviando..." : "Iniciar Proceso"}
				</button>
			</div>
		</form>
		</div>
    </div>
  );

  return (
    <div className="app-wrapper bg-white min-vh-100">
      <div className="app-main min-vh-100">
        <div className="app-content p-0">
          <div className="app-content--inner d-flex align-items-center">
            <div className="flex-grow-1 w-100 d-flex align-items-center">
              <div className="bg-composed-wrapper--content py-5">
                <Container>
                  <Grid
                    container
                    spacing={6}
                    style={{
                      display: "flex",
                      placeContent: "center",
                    }}
                  >
                    <Grid item lg={6} className="d-flex align-items-center">
                      {content}
                    </Grid>
                  </Grid>
                </Container>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
