import React, { useState } from "react";
import moment from "moment";
import { Button, Card, CardContent } from "@material-ui/core";
import Paper from "@material-ui/core/Paper";

import axios from "../../utils/axios";

import { StyledObject } from "./styles";

export default function ProcedureEnd({ history, procedure, documentData }) {
	const [selected, setSelected] = useState(0);
	//const [procedureData, setProcedureData] = useState([]);
	const procedureData = [];

	const { ecert, upload, documento } = documentData;
	const { participants } = documento;
	const originalDocs = documentData.documento.docs;
	const pdfs = [];
	for (const histKey in history) {
		if (history[histKey].type === "doc") {
			let tempDoc = false;
			for (const histDoc in originalDocs) {
				if (histDoc === history[histKey].value) {
					tempDoc = originalDocs[histDoc];
					if (typeof tempDoc === "boolean") tempDoc = { id: history[histKey].value };
				}
			}
			if (tempDoc) pdfs.push(tempDoc);
		}
	}
	const pdfsArray = Object.values(pdfs);

	let urlPdf = `${window.location.origin}/api/file-sign/${procedure}`;

	const handleClick = (i) => () => {
		setSelected(i);
	};

	if (pdfsArray.length === 0) {
		if (upload !== "") {
			const handleButtonUpload = () => {
				axios({
					url: `/api/preview/uploaded/${procedure}`,
					method: "GET",
					responseType: "blob",
				})
					.then((response) => {
						const fileNameHeader = "x-suggested-filename";
						const suggestedFileName = response.headers[fileNameHeader];
						let effectiveFileName =
							suggestedFileName === undefined ? `Doc${procedure}.pdf` : suggestedFileName;
						const url = window.URL.createObjectURL(new Blob([response.data]));
						const link = document.createElement("a");
						link.href = url;
						if ("undefined.pdf" === effectiveFileName) {
							effectiveFileName = `Doc${procedure}.pdf`;
						}
						link.setAttribute("download", effectiveFileName);
						document.body.appendChild(link);
						link.click();
					})
					.catch((error) => {
						alert("Hubo un error al intentar descargar");
					});
			};
			return (
				<>
					<>
						<span>Ha llegado al fin del proceso, Felicitaciones.</span>
						<Button variant="contained" color="secondary" onClick={handleButtonUpload}>
							Descargar Documento
						</Button>
						<div>
							<div>
								<p style={{ marginTop: "10px", color: "#423869" }}>{documentData.email}</p>{" "}
								<p style={{ margin: "0px", marginTop: "-12px", color: "#4468fc" }}>
									Firmado el {moment(documentData.updatedAt).format("DD/MM/YYYY HH:mm:ss")}
								</p>
							</div>
							<div
								style={{
									marginLeft: "auto",
								}}
							></div>
						</div>
					</>
				</>
			);
		} else {
			return (
				<>
					<>
						<span>Ha llegado al fin del proceso, Felicitaciones.</span>
					</>
				</>
			);
		}
	}

	if(ecert){
		if (ecert.length > 0) {
			console.log('gestdoc',{pdfsArray})
			console.log('gestdoc selected',pdfsArray[selected])
			urlPdf = `${window.location.origin}/api/preview/${procedure}/${pdfsArray[selected].id}`;
		} else {
			urlPdf = `${window.location.origin}/api/file-sign/${procedure}/${pdfsArray[selected].id}`;
		}
	}else{
		urlPdf = `${window.location.origin}/api/file-sign/${procedure}/${pdfsArray[selected].id}`;
	}
	const allHaveEnded = participants.every((item) => item.end);

	const handleButton = () => {
		axios({
			url: urlPdf,
			method: "GET",
			responseType: "blob",
		})
			.then((response) => {
				const fileNameHeader = "x-suggested-filename";
				const suggestedFileName = response.headers[fileNameHeader];
				let effectiveFileName = suggestedFileName === undefined ? `Doc${procedure}.pdf` : suggestedFileName;
				const url = window.URL.createObjectURL(new Blob([response.data]));
				const link = document.createElement("a");
				link.href = url;
				if ("undefined.pdf" === effectiveFileName) {
					effectiveFileName = `Doc${procedure}.pdf`;
				}
				link.setAttribute("download", effectiveFileName);
				document.body.appendChild(link);
				link.click();
			})
			.catch((error) => {
				alert("Hubo un error al intentar descargar");
			});
	};

	let content = (
		<StyledObject data={urlPdf} type="application/pdf">
			<embed src={urlPdf} type="application/pdf" />
		</StyledObject>
	);
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
			<Card
				style={{
					width: "50%",
					borderRadius: "25px",
					minWidth: "918px !important",
				}}
				className="mb-5 card-box card-box-border-bottom border-danger sectionDoc left-card container2"
			>
				<CardContent
					style={{
						minWidth: "918px !important",
					}}
				>
					{content}
				</CardContent>
			</Card>
			<div className="button" style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
				{pdfsArray.length === 1 ? (
					<>
						<button
							className="ContinueForm"
							style={{ width: "fit-content", cursor: "pointer" }}
							onClick={handleButton}
						>
							Descargar Documento
						</button>
						<div>
							{procedureData.length >= 1 && allHaveEnded
								? procedureData.map((procedure) => (
										<Paper className={"paper-round"}>
											<div>
												<p style={{ marginTop: "10px", color: "#423869" }}>{procedure.email}</p>{" "}
												<p style={{ margin: "0px", marginTop: "-12px", color: "#4468fc" }}>
													Firmado el{" "}
													{moment(procedure.updatedAt).format("DD/MM/YYYY HH:mm:ss")}
												</p>
											</div>
											<div
												style={{
													marginLeft: "auto",
												}}
											></div>
										</Paper>
								  ))
								: null}
						</div>
					</>
				) : (
					<>
						<p>El siguiente trámite ha sido generado y tiene asociado los siguientes documentos:</p>
						{pdfs ? (
							<ul>
								{Object.values(pdfs).map((it, i) => {
									return (
										<li key={it.id} onClick={handleClick(i)}>
											{it.title}
										</li>
									);
								})}
							</ul>
						) : null}
						{allHaveEnded && (
							<button className="ContinueForm" onClick={handleButton} style={{ cursor: "pointer" }}>
								Descargar Documento
							</button>
						)}
					</>
				)}
			</div>
		</div>
	);
}
