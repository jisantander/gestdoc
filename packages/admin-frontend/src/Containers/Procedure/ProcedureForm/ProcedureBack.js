import React from "react";
import { Dialog } from "@material-ui/core";
import ArrowBackIcon from "@material-ui/icons/ArrowBack";

import axios from "../../../utils/axios";

export default function ProcedureBack({ handleClose, open, transaction, gestor, current, close }) {
	const handleBack = async () => {
		if (!gestor.previousId) {
			return alert("No se puede retroceder!");
		}
		const params = {
			current: gestor.previousId,
			current_name: gestor.previous.name,
			activity: gestor.previous.id,
			participant: gestor.id,
		};
		if (gestor.previous["custom:days"]) {
			params.vence = parseInt(gestor.previous["custom:days"]);
		}
		const {
			data: { data },
		} = await axios({
			url: `api/procedure/back/${transaction}`,
			method: "PUT",
			data: params,
		});
		close(data);
	};

	return (
		<Dialog
			onClose={handleClose}
			aria-labelledby="simple-dialog-title"
			open={open}
			classes={{ paper: "modal-content rounded-lg" }}
		>
			<div className="text-center p-5">
				<h4>Retroceder Procedimiento</h4>
				<p>
					Se va a intentar retroceder el procedimiento hacia el paso denominado{" "}
					<strong>{gestor.previous.name}</strong>
				</p>
				<button
					className="MuiButtonBase-root MuiButton-root MuiButton-contained MuiButton-containedPrimary"
					onClick={handleBack}
				>
					<ArrowBackIcon />
					Retroceder Procedimiento
				</button>
			</div>
		</Dialog>
	);
}
