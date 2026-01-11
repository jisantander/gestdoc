import React, { useEffect, useState } from "react";
import { TextField, MenuItem, Button, Dialog, DialogContent } from "@material-ui/core";
import DialogActions from "@material-ui/core/DialogActions";

const RutSelector = ({ rutValue, handleChange, users }) => {
	const [dialog, setDialog] = useState(false);

	let ruts = [];
	if (rutValue) {
		if (rutValue !== "") {
			ruts = rutValue.split(",");
		}
	}

	const handleDialog = () => {
		setDialog(true);
	};
	const handleClose = () => {
		setDialog(false);
	};

	const handleChangeCheck = ({ target }) => {
		let newRuts = [...ruts];
		if (!target.checked) {
			target.removeAttribute("checked");
			newRuts = newRuts.filter((it) => it !== target.value);
		} else {
			target.setAttribute("checked", true);
			newRuts.push(target.value);
		}
		handleChange(newRuts.join(","));
	};

	const getName = (rutNames) => {
		const ruts = rutNames.split(",");
		const names = users
			.filter((it) => ruts.includes(it._id))
			.map((it) => `${it.ecert_nombre ? it.ecert_nombre : it.name} ${it.ecert_appat} ${it.ecert_apmat}`);
		return names.join(", ");
	};

	return (
		<div style={{ width: "100%", border: "1px solid grey", borderRadius: "25px" }}>
			<span>{rutValue ? getName(rutValue) : ""}</span>
			<Button onClick={handleDialog} variant="contained">
				<span>Seleccionar usuarios enrolados a firmar</span>
			</Button>
			<Dialog
				classes={{ paper: "modal-content" }}
				fullWidth
				maxWidth="md"
				open={dialog}
				onClose={handleClose}
				aria-labelledby="form-dialog-title2"
			>
				<DialogContent className="p-0">
					<table style={{ width: "100%" }}>
						<tr>
							<td></td>
							<td>Usuario enrolado</td>
						</tr>
						{users.map((item) => {
							return (
								<tr key={item._id}>
									<td>
										<input
											type="checkbox"
											value={item._id}
											defaultChecked={ruts.some((it) => item._id === it)}
											onClick={handleChangeCheck}
										/>
									</td>
									<td>
										{item.ecert_nombre ? item.ecert_nombre : item.name} {item.ecert_appat}{" "}
										{item.ecert_apmat}
									</td>
								</tr>
							);
						})}
					</table>
				</DialogContent>
				<DialogActions>
					<Button onClick={handleClose} className="m-2 btn-primary">
						Cerrar
					</Button>
				</DialogActions>
			</Dialog>
		</div>
	);
};

export default function SignatureType(props) {
	const { element, valueLocal, handleChange, updatePropertie } = props;

	const [loading, setLoading] = useState(false);

	const handleRut = (value) => {
		handleChange({
			target: {
				value,
				name: "valueEcertUser",
			},
		});
		updatePropertie(value, "ecert_rut");
	};

	useEffect(() => {
		setLoading(true);
		setTimeout(() => {
			setLoading(false);
		}, [10]);
	}, [element.id]);

	if (loading) return <span>Cargando...</span>;
	return (
		<>
			<TextField
				className="m-2"
				select
				label="Tipo de Firma Ecert"
				name="valueEcertType"
				value={valueLocal.valueEcertType !== "" ? valueLocal.valueEcertType : "advanced"}
				onChange={(e) => {
					handleChange(e);
					updatePropertie(e.target.value, "ecert_type");
				}}
				helperText=""
				variant="outlined"
			>
				<MenuItem value="simple">Simple</MenuItem>
				<MenuItem value="advanced">Avanzada</MenuItem>
			</TextField>
			<TextField
				className="m-2"
				select
				label="Restringir Firma Ecert"
				name="valueEcertRestrict"
				value={valueLocal.valueEcertRestrict !== "" ? valueLocal.valueEcertRestrict : ""}
				onChange={(e) => {
					handleChange(e);
					updatePropertie(e.target.value, "ecert_restrict");
				}}
				helperText=""
				variant="outlined"
			>
				<MenuItem value="">No restringir</MenuItem>
				<MenuItem value="1">Restringir a sólo enrolados</MenuItem>
			</TextField>
			<RutSelector
				rutValue={valueLocal.valueEcertUser}
				handleChange={handleRut}
				users={props.users.filter((it) => it.ecert_rut)}
				id={element.id}
			/>
		</>
	);
}
