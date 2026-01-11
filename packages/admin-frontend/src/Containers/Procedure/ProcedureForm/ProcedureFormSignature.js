import React, { useState } from "react";
import { Button } from "@material-ui/core";

import axios from "../../../utils/axios";

export default function ProcedureFormSignature({ transaction, gestor, current, participant, close }) {
	const [emails, setEmails] = useState([""]);

	const handleSubmit = async () => {
		try {
			await axios.put(`api/procedure/${transaction}`, {
				current,
				data: {
					type: "request_signature",
					titleStage: gestor.next.name,
					emails,
				},
			});
			close();
		} catch (err) {
			console.error(err);
			close();
		}
	};

	const handleEdit = (ind) => (e) => {
		const newEmails = [...emails];
		newEmails[ind] = e.target.value;
		setEmails(newEmails);
	};
	const handleMore = () => {
		const newEmails = [...emails];
		newEmails.push("");
		setEmails(newEmails);
	};
	const handleDelete = (i) => () => {
		const newEmails = emails.filter((it, ind) => i !== ind);
		setEmails(newEmails);
	};

	const limitEmail = [];
	if (gestor.next["custom:num_sign"] === "n_participans" || gestor.next["custom:num_sign"] === "fixed") {
		let limit = gestor.next["custom:fixed_sign"];
		if (gestor.next["custom:num_sign"] === "n_participans") {
			limit = 0;
			Object.keys(participant.form).forEach((item) => {
				if (item.includes("_rut_")) {
					limit++;
				}
			});
		}
		for (let i = 0; i < parseInt(limit); i++) {
			limitEmail.push("");
		}
	}

	return (
		<div>
			<span>Se debe ingresar los correos de los firmantes:</span>
			{gestor.next["custom:num_sign"] === "user_choose" && (
				<>
					<ul>
						{emails.map((item, i) => (
							<li key={i}>
								{i + 1}: <input value={emails[i]} onChange={handleEdit(i)} />{" "}
								<button onClick={handleDelete(i)}>Eliminar</button>
							</li>
						))}
					</ul>
					<button onClick={handleMore}>Agregar correo</button>
				</>
			)}
			{(gestor.next["custom:num_sign"] === "n_participans" || gestor.next["custom:num_sign"] === "fixed") && (
				<ul>
					{limitEmail.map((item, i) => (
						<li key={i}>
							{i + 1}: <input value={emails[i]} onChange={handleEdit(i)} />
						</li>
					))}
				</ul>
			)}
			<Button onClick={handleSubmit}>Continuar</Button>
		</div>
	);
}
