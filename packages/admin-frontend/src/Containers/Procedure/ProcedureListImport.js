import React, { useState, useEffect, useCallback } from "react";
import { DialogTitle, Button, FormControl, InputLabel, Select, List, ListItem, MenuItem } from "@material-ui/core";
import Alert from "@material-ui/lab/Alert";
import { useDropzone } from "react-dropzone";
import CloseTwoToneIcon from "@material-ui/icons/CloseTwoTone";
import CloudUploadTwoToneIcon from "@material-ui/icons/CloudUploadTwoTone";
import CheckIcon from "@material-ui/icons/Check";

import axios from "../../utils/axios";

export default function ProcedureListImport({ bpmns }) {
	const [importable, setImportable] = useState(false);
	const [step, setStep] = useState(false);
	const [steps, setSteps] = useState([]);
	const [procedures, setProcedures] = useState([]);

	useEffect(() => {
		setImportable(bpmns[0]._id);
	}, [bpmns]);

	useEffect(() => {
		const loadSteps = async () => {
			const { data } = await axios.post(`api/bpmn/steps/${importable}`);
			setSteps(data[0].steps);
			setStep(data[0].steps[0].id);
		};
		if (importable) loadSteps();
	}, [importable]);

	useEffect(() => {
		const processUpdate = async () => {
			const newProcedures = [...procedures];
			const affected = procedures.findIndex((it) => it.status === "pending");
			const procedure = { ...procedures[affected] };
			if (affected !== -1) {
				if (procedure.id === "NEW") {
					const { data } = await axios.post("api/procedure", {
						bpmn: procedure.bpmn,
						participants: procedure.participants,
					});
					await axios.put(`api/procedure/${data._id}`, {
						current: procedure.current,
						data: procedure.data,
					});
				} else {
					await axios.put(`api/procedure/${procedure.id}`, {
						current: procedure.current,
						data: procedure.data,
					});
				}
				newProcedures[affected].status = "done";
				setProcedures(newProcedures);
			} else {
				setProcedures([]);
				alert("Procedimientos actualizados con éxito");
			}
		};
		if (procedures.length > 0) processUpdate();
	}, [procedures]);

	const handleImportProc = (e) => {
		setImportable(e.target.value);
	};
	const handleImportStep = (e) => {
		setStep(e.target.value);
	};
	const handleDownload = () => {
		const realStep = steps.find((itS) => itS.id === step);
		axios({
			method: "post",
			url: `api/bpmn/xls/${importable}/${step}`,
			responseType: "blob",
			data: {
				type: "form",
				form: realStep["custom:form"] ? realStep["custom:form"] : "5fb683e6ca0e8e0d49c45b9e",
			},
		})
			.then((response) => {
				const fileNameHeader = "x-suggested-filename";
				const suggestedFileName = response.headers[fileNameHeader];
				let effectiveFileName = suggestedFileName === undefined ? "Plantilla.xlsx" : suggestedFileName;
				effectiveFileName = effectiveFileName.substr(0, effectiveFileName.length - 5) + ".xlsx";
				const url = window.URL.createObjectURL(new Blob([response.data]));
				const link = document.createElement("a");
				link.href = url;
				link.setAttribute("download", effectiveFileName);
				document.body.appendChild(link);
				link.click();
			})
			.catch(async (error) => {
				console.log("ERROR", error);
			});
	};
	const onDrop = useCallback((acceptedFiles) => {
		// Do something with the files
		console.log("acceptedFiles", acceptedFiles);

		//send File to S3

		if (acceptedFiles[0].type === "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet") {
			const data = new FormData();
			data.append("file", acceptedFiles[0]);
			axios({
				method: "post",
				url: "api/bpmn/read",
				data,
			})
				.then(({ data }) => {
					setProcedures(data.data);
				})
				.catch((e) => {
					if (e.response.data) {
						if (e.response.data.data) {
							const rowsFail = e.response.data.data.map((i) => parseInt(i.index) + 1);
							const rowsString = e.response.data.data.map((i) => i.message || "");
							let errorMessage =
								"Hay un error en las siguientes filas: " +
								rowsFail.join(", ") +
								" - " +
								rowsString.join(", ");
							return alert(errorMessage);
						}
					}
					alert("Hubo un error al importar los procedimientos");
				});
		} else {
			alert("El formato debe ser .xlsx");
			return false;
		}
	}, []);

	const { acceptedFiles, isDragActive, isDragAccept, isDragReject, getRootProps, getInputProps } = useDropzone({
		onDrop,
		accept: ".xlsx",
	});

	const files = acceptedFiles.map((file) => (
		<ListItem
			className="font-size-sm px-3 py-2 text-primary d-flex justify-content-between align-items-center"
			key={file.path}
		>
			<span>{file.path}</span>{" "}
			<span className="badge badge-pill bg-neutral-warning text-warning">{file.size} bytes</span>
		</ListItem>
	));

	return (
		<>
			{procedures.length > 0 ? (
				<>
					<DialogTitle id="simple-dialog-title">Procesando importación</DialogTitle>
					<ul>
						{procedures.map((item, i) => {
							return (
								<li key={i}>
									Trámite {item.name}: {item.status}
								</li>
							);
						})}
					</ul>
				</>
			) : (
				<>
					<DialogTitle id="simple-dialog-title">Importar en lote</DialogTitle>
					<FormControl variant="outlined">
						<InputLabel id="demo-simple-select-outlined-label">Procedimiento</InputLabel>
						<Select
							labelId="demo-simple-select-outlined-label"
							id="demo-simple-select-outlined"
							label="Procedimiento"
							value={importable}
							onChange={handleImportProc}
						>
							{bpmns.map((item) => (
								<MenuItem value={item._id}>{item._nameSchema}</MenuItem>
							))}
						</Select>
					</FormControl>
					<FormControl variant="outlined">
						<InputLabel id="demo-simple-select-outlined-label">Paso</InputLabel>
						<Select
							labelId="demo-simple-select-outlined-label"
							id="demo-simple-select-outlined"
							label="Paso"
							value={step}
							onChange={handleImportStep}
						>
							{steps
								.filter((itS) => itS["custom:form"])
								.map((item) => (
									<MenuItem value={item.id}>{item.name}</MenuItem>
								))}
						</Select>
					</FormControl>
					{step && (
						<Button className="btn-primary btn-pill mx-1" onClick={handleDownload}>
							<span className="btn-wrapper--label">Descargar Plantilla</span>
						</Button>
					)}
					<div className="dropzone">
						<div
							{...getRootProps({
								className: "dropzone-upload-wrapper",
								onDrop: (event) => console.log(event),
							})}
						>
							<input {...getInputProps()} />
							<div className="dropzone-inner-wrapper">
								{isDragAccept && (
									<div>
										<div className="d-100 btn-icon mb-3 hover-scale-lg bg-success shadow-success-sm rounded-circle text-white">
											<CheckIcon className="d-50" />
										</div>
										<div className="font-size-sm text-success">All files will be uploaded!</div>
									</div>
								)}
								{isDragReject && (
									<div>
										<div className="d-100 btn-icon mb-3 hover-scale-lg bg-danger shadow-danger-sm rounded-circle text-white">
											<CloseTwoToneIcon className="d-50" />
										</div>
										<div className="font-size-sm text-danger">Some files will be rejected!</div>
									</div>
								)}
								{!isDragActive && (
									<div>
										<div className="d-100 btn-icon mb-3 hover-scale-lg bg-white shadow-light-sm rounded-circle text-primary">
											<CloudUploadTwoToneIcon className="d-50" />
										</div>
										<div className="font-size-sm">
											Arraste su archivo aquí{" "}
											<span className="font-size-xs text-dark">(.xslx)</span>
										</div>
									</div>
								)}

								<small className="py-2 text-black-50">o</small>
								<div>
									<Button className="btn-primary hover-scale-sm font-weight-bold btn-pill px-4">
										<span className="px-2">Buscar en su directorio</span>
									</Button>
								</div>
							</div>
						</div>
					</div>
					<div>
						<div className="font-weight-bold my-4 text-uppercase text-dark font-size-sm text-center">
							Cargue su documento Microsoft Excel (.xlsx)
						</div>
						{files.length <= 0 && <div className="text-info text-center font-size-sm"></div>}
						{files.length > 0 && (
							<div>
								<Alert severity="success" className="text-center mb-3">
									Se ha subido el archivo correctamente.
								</Alert>
								<List component="div" className="font-size-sm">
									{files}
								</List>
							</div>
						)}
					</div>
				</>
			)}
		</>
	);
}
