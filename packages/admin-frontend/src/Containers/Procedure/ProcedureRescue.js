import React from "react";
import { useSelector } from "react-redux";
import { Button } from "@material-ui/core";
import NextIcon from "@material-ui/icons/NavigateNext";
import BeforeIcon from "@material-ui/icons/NavigateBefore";

import axios from "../../utils/axios";
import { StyledObject } from "./styles";

export default function ProcedureRescue({ procedure, history }) {
	const procedures = useSelector(({ procedureList }) => procedureList.procedures);

	const procedureId = procedure._id;
	const index = procedures.findIndex((it) => it._id === procedureId);
	const documentPdf = procedure.url.substring(43);
	const urlPdf = `${process.env.REACT_APP_API}api/preview/rescue/${documentPdf}`;

	const handleClick = () => {
		axios({
			url: urlPdf,
			method: "GET",
			responseType: "blob",
		})
			.then((response) => {
				const fileNameHeader = "x-suggested-filename";
				const suggestedFileName = response.headers[fileNameHeader];
				let effectiveFileName = suggestedFileName === undefined ? `Doc${procedureId}.pdf` : suggestedFileName;
				const url = window.URL.createObjectURL(new Blob([response.data]));
				const link = document.createElement("a");
				link.href = url;
				if ("undefined.pdf" === effectiveFileName) {
					effectiveFileName = `Doc${procedureId}.pdf`;
				}
				link.setAttribute("download", effectiveFileName);
				document.body.appendChild(link);
				link.click();
			})
			.catch((error) => {
				alert("Hubo un error al intentar descargar");
			});
	};
	const handleGoList = (direction) => () => {
		const index = procedures.findIndex((it) => it._id === procedureId);
		if (direction === "prev" && index === 0) {
			return alert("Es el primer item de la lista, no se puede retroceder");
		}
		if (direction === "next" && index === procedures.length - 1) {
			return alert("Es el último item de la lista, no se puede avanzar más");
		}
		let newIndex = index + 1;
		if (direction === "prev") newIndex = index - 1;
		history.push(procedures[newIndex]._id);
	};

	return (
		<div
			className="grid-container2"
			style={{
				backgroundColor: " transparent",
				padding: "54px",
				display: "flex",
				flexFlow: "column",
				alignItems: "center",
			}}
		>
			<div>
				<Button variant="contained" color="secondary" onClick={handleGoList("prev")}>
					<BeforeIcon /> Anterior
				</Button>
				<span>
					{index + 1} de {procedures.length}
				</span>
				<Button variant="contained" color="secondary" onClick={handleGoList("next")}>
					<NextIcon /> Siguiente
				</Button>
			</div>
			<h4>Procedimiento rescatado</h4>
			<StyledObject data={urlPdf} type="application/pdf" style={{ minWidth: "100%", maxWidth: "138%" }}>
				<embed src={urlPdf} type="application/pdf" />
			</StyledObject>
			<Button variant="contained" color="secondary" onClick={handleClick}>
				Descargar PDF
			</Button>
		</div>
	);
}
