import React from "react";
import { Button } from "@material-ui/core";

import axios from "../../../utils/axios";

export default function ProcedureFormInvalid({ transaction, gestor, current, type, close }) {
	const handleSubmit = async () => {
		try {
			await axios.put(`api/procedure/${transaction}`, {
				current,
				data: {
					type,
					titleStage: gestor.next.name,
				},
			});
			close();
		} catch (err) {
			//
		}
	};

	return (
		<div>
			<p>
				Este es un procedimiento válido sólo para la versión Express. Si desea continuar, haga click en el botón{" "}
				<strong>Continuar</strong>
			</p>
			<Button
				className="MuiButtonBase-root MuiButton-root MuiButton-contained MuiButton-containedPrimary"
				onClick={handleSubmit}
			>
				Continuar
			</Button>
		</div>
	);
}
