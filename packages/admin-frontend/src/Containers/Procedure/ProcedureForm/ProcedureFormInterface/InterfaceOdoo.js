import React, { useState } from "react";

import axios from "../../../../utils/axios";

import { Loading } from "../../../../utils/Loading";

export default function InterfaceOdoo({ odooData, handleEmployee }) {
	const [rut, setRut] = useState("");
	const [loading, setLoading] = useState(false);

	const handleRut = (e) => {
		setRut(e.target.value);
	};
	const handleSubmitOdoo = async (e) => {
		try {
			e.preventDefault();
			setLoading(true);
			const interfaceData = {
				interface: odooData._id,
				rut,
			};
			const { data: employeeData } = await axios.post(`api/interface/odoo`, interfaceData);
			handleEmployee(employeeData);
			setLoading(false);
		} catch (e) {
			console.error(e);
			setLoading(false);
			alert("Hubo un error al guardar, intente de nuevo");
		}
	};

	if (loading) return <Loading />;
	return (
		<form onSubmit={handleSubmitOdoo}>
			<div className="form-group">
				<label>RUT de trabajador</label>
				<input type="text" className="form-control" name="rut" value={rut} onChange={handleRut} />
			</div>
			<button className="btn btn-primary">Obtener información</button>
		</form>
	);
}
