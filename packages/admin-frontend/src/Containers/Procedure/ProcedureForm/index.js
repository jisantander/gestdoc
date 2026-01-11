import React, { useState } from "react";

import ArrowBackIcon from "@material-ui/icons/ArrowBack";

import ProcedureFormForm from "./ProcedureFormForm";
import ProcedureFormReview from "./ProcedureFormReview";
import ProcedureFormSignature from "./ProcedureFormSignature";
//import ProcedureFormCharge from './ProcedureFormCharge';
import ProcedureFormInvalid from "./ProcedureFormInvalid";
import ProcedureFormInterface from "./ProcedureFormInterface";
import ProcedureBack from "./ProcedureBack";

export default function ProcedureForm({ gestor, current, close, transaction, participant, defaultData = null }) {
	const [show, setShow] = useState(false);

	const handleClose = () => {
		setShow(false);
	};

	const handleBack = () => {
		setShow(true);
	};
	let formData = null;
	if (defaultData !== null) {
		formData = defaultData.form;
	}

	let currentContent = null;

	switch (gestor.next["custom:functions"]) {
		case "form":
			currentContent = (
				<ProcedureFormForm
					gestor={gestor}
					current={current}
					close={close}
					transaction={transaction}
					form={formData}
				/>
			);
			break;
		case "sign_in":
			currentContent = (
				<ProcedureFormInvalid
					gestor={gestor}
					current={current}
					close={close}
					transaction={transaction}
					type="sign_in"
				/>
			);
			break;
		case "get_Info_odoo":
			currentContent = (
				<ProcedureFormInvalid
					gestor={gestor}
					current={current}
					close={close}
					transaction={transaction}
					type="get_Info_odoo"
				/>
			);
			break;
		case "doc":
			currentContent = (
				<ProcedureFormReview gestor={gestor} current={current} close={close} transaction={transaction} />
			);
			break;
		case "charge":
			currentContent = (
				<ProcedureFormInvalid
					gestor={gestor}
					current={current}
					close={close}
					transaction={transaction}
					type="charge"
				/>
			);
			break;
		case "request_signature":
			currentContent = (
				<ProcedureFormSignature
					gestor={gestor}
					participant={participant}
					current={current}
					close={close}
					transaction={transaction}
				/>
			);
			break;
		case "interface":
			currentContent = (
				<ProcedureFormInterface
					gestor={gestor}
					participant={participant}
					current={current}
					close={close}
					transaction={transaction}
				/>
			);
			break;
		/*case 'email':
			currentContent = <ProcedureMail />;
			break;
		case 'advance_signature':
			currentContent = <ProcedureSignature />;
			break;
		case 'view_collaborations':
			currentContent = <ProcedureParticipants />;
			break;*/
		case "END":
			//currentContent = <ProcedureEnd />;
			currentContent = null;
			break;
		default:
			currentContent = <span>Falta información</span>;
			break;
	}
	return (
		<>
			{currentContent}
			{gestor.next["custom:back"] === "true" && (
				<>
					<button
						className="MuiButtonBase-root MuiButton-root MuiButton-contained MuiButton-containedPrimary"
						onClick={handleBack}
					>
						<ArrowBackIcon />
						Retroceder Procedimiento
					</button>
					<ProcedureBack
						open={show}
						handleClose={handleClose}
						transaction={transaction}
						gestor={gestor}
						current={current}
						close={close}
					/>
				</>
			)}
		</>
	);
}
