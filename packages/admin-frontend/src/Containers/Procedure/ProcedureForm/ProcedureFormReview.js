import React from "react";
import { Button } from "@material-ui/core";

import axios from "../../../utils/axios";
import ArrowForwardIcon from "@material-ui/icons/ArrowForward";
export default function ProcedureFormReview({ transaction, gestor, current, type, close }) {
	const docId = gestor.next["custom:doc"];
	const handleSubmit = async () => {
		try {
			await axios.put(`api/procedure/${transaction}`, {
				current,
				data: {
					type: "doc",
					titleStage: gestor.next.name,
					value: docId,
				},
			});
			close();
		} catch (err) {
			//
		}
	};
	const urlPdf = `${process.env.REACT_APP_API}api/preview/${transaction}/${docId}`;

	return (
		<div style={{ display: "inline-grid" }}>
			<object data={urlPdf} type="application/pdf" className="objectPdf">
				<embed src={urlPdf} type="application/pdf" />
			</object>
			<Button
				className="MuiButtonBase-root MuiButton-root MuiButton-contained MuiButton-containedPrimary"
				style={{ marginTop: "32px !important" }}
				onClick={handleSubmit}
			>
				<ArrowForwardIcon /> Ir al Procedimiento
			</Button>
		</div>
	);
}
