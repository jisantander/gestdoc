import React from "react";
import { Link } from "react-router-dom";
import moment from "moment";

import ProcedureEnd from "./ProcedureEnd";

import { StyledObject } from "./styles";
import { PROCEDURE_HAS_ENDED } from "utils/global";

const getTypeStage = (stage) => {
	switch (stage) {
		case "form":
			return "Formulario de datos";
		case "charge":
			return "Pago con Flow";
		case "signature":
			return "Firma Clave Unica";
		case "email":
			return "Envio de Correos";
		case "doc":
			return "Vista Previa de Documento";
		case "view_collaborations":
			return "Ver colaboradores";
		case "interface":
			return "Conexión con interfaz";
		case "upload":
			return "Subida personalizada";
		case "request_signature":
			return "Solicitar firmas";
		case "advanced_signature":
			return "Firmar con e-cert";
		case "sign_in":
			return "Solicitar inicio de sesión";
		case PROCEDURE_HAS_ENDED:
			return "Documento Finalizado";
		default:
			return "Desconocido";
	}
};

const imgStyle = { objectFit: "cover", width: "100%" };

const ProcedureForm = ({ data, form_names }) => {
	const items = Object.keys(data);

	return (
		<ul className="MuiList-root list-group-bordered py-0 MuiList-padding">
			{items.map((item) => {
				let displayValue = data[item];
				if (typeof displayValue === "string") {
					if (displayValue.substr(0, 15) === "data:image/png;") {
						displayValue = <img style={imgStyle} src={displayValue} alt="Imagen" />;
					} else if (displayValue.substr(0, 16) === "data:image/jpeg;") {
						displayValue = <img style={imgStyle} src={displayValue} alt="Imagen" />;
					} else if (displayValue.substr(0, 21) === "data:application/pdf;") {
						displayValue = (
							<object
								data={displayValue}
								type="application/pdf"
								style={{ width: "100%", height: "60vh" }}
							>
								<embed src={displayValue} type="application/pdf" />
							</object>
						);
					} else if (displayValue.substr(0, 5) === "https") {
						if (
							displayValue.slice(-4) === ".png" ||
							displayValue.slice(-4) === ".jpg" ||
							displayValue.slice(-4) === "jpeg" ||
							displayValue.slice(-4) === ".gif"
						) {
							displayValue = <img src={displayValue} alt="Imagen" style={imgStyle} />;
						} else if (displayValue.slice(-4) === ".pdf") {
							displayValue = (
								<object
									data={displayValue}
									type="application/pdf"
									style={{ width: "100%", height: "60vh" }}
								>
									<embed src={displayValue} type="application/pdf" />
								</object>
							);
						}
					}
				}
				return (
					<li
						key={item}
						className="MuiListItem-root d-flex justify-content-between align-items-center py-3 MuiListItem-gutters"
					>
						<div style={{ width: "100%" }}>
							<p className="font-weight-bold" style={{ margin: "0px" }}>
								{form_names[item]}{" "}
							</p>
							<p style={{ margin: "0px" }}>{displayValue}</p>
						</div>
					</li>
				);
			})}
		</ul>
	);
};

const ProcedurePreview = ({ docId, procedure }) => {
	const urlPdf = `${process.env.REACT_APP_API}api/preview/${procedure}/${docId}`;

	return (
		<StyledObject data={urlPdf} type="application/pdf" style={{ minWidth: "100%", maxWidth: "138%" }}>
			<embed src={urlPdf} type="application/pdf" />
		</StyledObject>
	);
};

const ProcedureParticipants = ({ gestores }) => {
	return (
		<>
			<p>Durante este paso, se mostraron los links para los distintos participantes.</p>
			<ul>
				{gestores.map((item, i) => (
					<li key={i}>{item.name}</li>
				))}
			</ul>
		</>
	);
};

const ProcedureEmail = ({ name, _id }) => {
	return (
		<>
			<p>
				Durante este paso, se envio un correo electrónico correspondiente a la plantilla <kbd>{name}</kbd>.
			</p>
			<p>
				Puedes visitar la plantilla de dicho correo{" "}
				<Link to={`/EmailBuilder/${_id}`}>
					<kbd>aquí</kbd>
				</Link>
			</p>
		</>
	);
};

const ProcedureCharge = ({ data }) => {
	return (
		<>
			<p>
				Se pagó la transacción <strong>{data.token}</strong> por el valor de <kbd>${data.amount}</kbd>
			</p>
		</>
	);
};

const ProcedureInterface = ({ data }) => {
	return (
		<>
			<p>Conexión con interfaz</p>
		</>
	);
};

const ProcedureSignin = ({ email }) => {
	return (
		<>
			<p>
				Se inicia sesión con el usuario <kbd>{email}</kbd>
			</p>
		</>
	);
};

const ProcedureUpload = ({ upload }) => {
	const urlPdf = `${upload}`;

	return (
		<StyledObject data={urlPdf} type="application/pdf" style={{ width: "138%" }}>
			<embed src={urlPdf} type="application/pdf" />
		</StyledObject>
	);
};

const ProcedureRequestSignature = ({ people }) => {
	if (people.length === 0) return <span>Todavia no se solicitan las firmas</span>;
	return (
		<>
			<span>Se solicitará la firma de los siguientes participantes:</span>
			<ul>
				{people.map((item) => (
					<li key={item.email}>
						[{item.email}] {item.rut}: {item.nombre} {item.apellido} {item.apmat}
					</li>
				))}
			</ul>
		</>
	);
};

const ProcedureEcert = ({ ecert }) => {
	return (
		<>
			<span>Se solicita firma validada por e-cert a las siguientes personas:</span>
			{ecert.length === 0 ? (
				<span>Todavía se están ingresando los participantes</span>
			) : (
				<ul>
					{ecert.map((item, index) => {
						if (!item.nombre)
							return (
								<li key={index}>
									Usuario enrolado - {item.signed ? <span>Ya firmó</span> : <span>Falta firmar</span>}
								</li>
							);
						return (
							<li key={index}>
								{item.email} {item.signed ? <span>Ya firmó</span> : <span>Falta firmar</span>}
							</li>
						);
					})}
				</ul>
			)}
		</>
	);
};

export default function ProcedureContent({ data, procedure, gestores, ecert, history, documentData }) {
	if (!data) {
		return <></>;
	}
	return (
		<>
			<h4>{getTypeStage(data.type)}</h4>
			<span style={{ fontSize: "smaller", fontStyle: "italic" }}>
				Realizado el {moment(data.writeAt).format("DD/MM/YYYY HH:mm:ss")}
			</span>
			<hr />
			{data.type === "form" && <ProcedureForm data={data.form} form_names={data.form_names} />}
			{data.type === "doc" && <ProcedurePreview docId={data.value} procedure={procedure} />}
			{data.type === "view_collaborations" && <ProcedureParticipants gestores={gestores} />}
			{data.type === "email" && <ProcedureEmail name={data.name} _id={data.value} />}
			{data.type === "charge" && <ProcedureCharge data={data} />}
			{data.type === "interface" && <ProcedureInterface data={data} />}
			{data.type === "upload" && <ProcedureUpload upload={data.upload} />}
			{data.type === "request_signature" && <ProcedureRequestSignature people={data.people} />}
			{data.type === "advanced_signature" && <ProcedureEcert ecert={ecert} />}
			{data.type === "sign_in" && <ProcedureSignin email={procedure.email} />}
			{data.type === PROCEDURE_HAS_ENDED && (
				<ProcedureEnd history={history} procedure={procedure} documentData={documentData} />
			)}
		</>
	);
}
