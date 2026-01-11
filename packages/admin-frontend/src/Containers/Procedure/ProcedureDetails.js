import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { Grid, Card, FormControl, InputLabel, Select, Dialog, MenuItem, Button } from "@material-ui/core";
import { useSelector, useDispatch } from "react-redux";
import ArrowForwardIcon from "@material-ui/icons/ArrowForward";
import DeleteIcon from "@material-ui/icons/Delete";
import GetAppIcon from "@material-ui/icons/GetApp";
import NextIcon from "@material-ui/icons/NavigateNext";
import BeforeIcon from "@material-ui/icons/NavigateBefore";
import moment from "moment";

import Note from "../Note";
import axios from "../../utils/axios";

import { Loading } from "../../utils/Loading";
import ProcedureContent from "./ProcedureContent";
import ProcedureRescue from "./ProcedureRescue";

import LoadError from "../../layout-components/LoadError/index";

import { setSidebarName } from "../../reducers/ThemeOptions";
import imageOperation from "../../images/laborales.svg";

import { PROCEDURE_HAS_ENDED } from "../../utils/global";

const { REACT_APP_EXPRESS_API } = process.env;

const GestorTabs = ({ gestor, procedureId, gestores, ecert, userId, step = 0, documentData }) => {
	const goFlow = (id) => {
		return window.open(`${REACT_APP_EXPRESS_API}procedure/${id}`);
	};
	const canEdit = userId === gestor.user;
	const history = gestor.history ? Object.keys(gestor.history) : null;

	let stage = gestor.history ? gestor.history[history[step]] : null;
	if (!stage && history) stage = history.length === step ? { type: PROCEDURE_HAS_ENDED } : null;

	return (
		<>
			<ProcedureContent
				data={stage}
				procedure={procedureId}
				gestores={gestores}
				ecert={ecert}
				history={gestor.history}
				documentData={documentData}
			/>
			<Button variant="contained" color="primary" onClick={() => goFlow(procedureId)}>
				<ArrowForwardIcon /> Ir al Procedimiento
			</Button>

			{canEdit ? <></> : <div>No tenemos información de este gestor</div>}
		</>
	);
};

export default function ProcedureDetails({ history: propsHistory }) {
	const userId = useSelector(({ auth }) => auth.userId);
	const procedures = useSelector(({ procedureList }) => procedureList.procedures);
	const { id: procedureId } = useParams();
	const [data, setData] = useState(false);
	const [value, setValue] = useState(0);
	const [procedure, setProcedure] = useState(0);
	// eslint-disable-next-line
	const [show, setShow] = useState(false);
	const [modalRemove, setModalRemove] = useState(false);

	const dispatch = useDispatch();

	const handleChange = (e) => {
		setProcedure(0);
		setValue(e.target.value);
	};
	const handleProcedureChange = (e) => {
		setProcedure(e.target.value);
	};
	const getData = async (data = false) => {
		try {
			const { data: documentData } = await axios.get(`api/procedure/${procedureId}`);

			dispatch(setSidebarName(["Operaciones -  " + documentData.documento._nameSchema, imageOperation]));
			setData(documentData);
			if (documentData.gestores[value] && documentData.origin !== "rescue") {
				if (documentData.gestores[value].history) {
					history = Object.keys(documentData.gestores[value].history);
					if (documentData.gestores[value].current === PROCEDURE_HAS_ENDED) {
						setProcedure(history.length);
					} else setProcedure(history.length - 1);
				}
			} else {
				dispatch(setSidebarName(["Operaciones -  " + documentData._id, imageOperation]));
			}
		} catch (e) {
			console.error(e);
			setData({ error: true });
		}
	};

	useEffect(() => {
		getData();
		// eslint-disable-next-line
	}, [procedureId]);

	if (data.origin === "rescue") return <ProcedureRescue history={propsHistory} procedure={data} />;

	const handleStep = () => {
		setShow(true);
	};

	const handleModalRemove = () => {
		setModalRemove(true);
	};
	const toggleRemove = () => setModalRemove(false);
	const handleRemove = async () => {
		try {
			await axios.delete(`api/procedure/${procedureId}`);
			propsHistory.goBack();
		} catch (e) {
			console.error(e);
			setModalRemove(false);
		}
	};
	const handleExcel = () => {
		axios({
			method: "get",
			url: `api/procedure/xls/${procedureId}`,
			responseType: "blob",
		})
			.then((response) => {
				const fileNameHeader = "x-suggested-filename";
				const suggestedFileName = response.headers[fileNameHeader];
				let effectiveFileName = suggestedFileName === undefined ? "Procedimiento.xlsx" : suggestedFileName;
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
		propsHistory.push(procedures[newIndex]._id);
	};
	const index = procedures.findIndex((it) => it._id === procedureId);

	let hasEnded = false;
	if (!isNaN(value)) {
		if (data) {
			if (!data.error) {
				hasEnded = data.gestores[value].current === PROCEDURE_HAS_ENDED;
			}
		}
	}

	const hasDueDate = () => {
		const dueDays = data.gestores[value].vence;
		if (dueDays) {
			if (dueDays > 0) {
				return true;
			}
		}
		return false;
	};
	const whenDueDate = () => {
		const dueDays = data.gestores[value].vence;
		if (dueDays) {
			if (dueDays > 0) {
				return moment(data.createdAt.substr(0, 10)).add(dueDays, "days").format("DD/MM/YYYY");
			}
		}
		return "--";
	};
	const colorDueDate = () => {
		let colorDue = "green";
		const dueDays = data.gestores[value].vence;
		let diffDue = 999;
		if (dueDays) {
			if (dueDays > 0) {
				diffDue = moment(data.createdAt.substr(0, 16)).add(dueDays, "days").diff(moment(), "days") + 1;
			}
		}
		if (diffDue <= 3) {
			colorDue = "orange";
		}
		if (diffDue <= 1) {
			colorDue = "red";
		}
		return colorDue;
	};

	let history = [];
	const pdfs = [];
	if (data) {
		if (!data.error) {
			if (data.gestores[value]) {
				if (data.gestores[value].history) {
					history = Object.keys(data.gestores[value].history);
				}
				for (const histKey in data.gestores[value].history) {
					if (data.gestores[value].history[histKey].type === "doc") {
						let tempDoc = false;
						for (const histDoc in data.documento.docs) {
							if (histDoc === data.gestores[value].history[histKey].value) {
								tempDoc = histDoc;
							}
						}
						if (tempDoc) pdfs.push(tempDoc);
					}
				}
			}
		}
	}

	if (data) {
		if (data.error) {
			return <LoadError />;
		}
	}
	const pdfsArray = Object.values(pdfs);
	const handlePdf = () => {
		let urlPdf = `/api/preview/uploaded/${procedureId}`;

		if (data.ecert.length > 0) {
			//TODO Agregar seleccionar entre documentos descargables
			urlPdf = `/api/preview/aws/${procedureId}/${pdfsArray[0]}`;
		} else {
			urlPdf = `/api/preview/aws/${procedureId}/${pdfsArray[0]}`;
		}
		if (!pdfsArray[0]) {
			urlPdf = `/api/preview/uploaded/${procedureId}`;
		}
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

	return (
		<>
			<Grid container>
				<Grid item sm={12}>
					<Card className="p-4 mb-4" style={{ overflow: "auto" }}>
						{!data ? (
							<Loading />
						) : (
							<>
								<div
									style={{
										display: "flex",
										flexDirection: "column",
										marginBottom: "margin-bottom: 40px",
									}}
								>
									<h3 className="cus-title">
										Historial {data.sequence} <span className="line"></span>{" "}
									</h3>
									<div
										style={{
											marginTop: "20px",
											marginBottom: "20px",
											display: "inline-flex",
											justifyContent: "space-between",
										}}
									>
										<div
											style={{
												display: "inline-flex",
											}}
										>
											<FormControl
												variant="outlined"
												style={{ display: "block", marginRight: "10px" }}
											>
												<InputLabel id="demo-simple-select-outlined-label">Gestor</InputLabel>
												<Select
													labelId="demo-simple-select-outlined-label"
													id="demo-simple-select-outlined"
													value={value}
													onChange={handleChange}
													label="Gestor"
												>
													{data.gestores.map((gestor, i) => (
														<MenuItem key={i} value={i}>
															{gestor.user
																? `${gestor.name} - ${
																		data.users.find((it) => it._id === gestor.user)
																			.name
																  }`
																: gestor.name}
														</MenuItem>
													))}
												</Select>
											</FormControl>
											{history.length > 0 && (
												<>
													<FormControl variant="outlined" style={{ display: "block" }}>
														<InputLabel id="demo-simple-select-outlined-2-label">
															Etapa
														</InputLabel>
														<Select
															labelId="demo-simple-select-outlined-2-label"
															id="demo-simple-select-outlined-2-label"
															value={procedure}
															onChange={handleProcedureChange}
															label="Procedimiento"
														>
															{data &&
																history.map((item, i) => (
																	<MenuItem key={i} value={i}>
																		{data.gestores[value].history[item].titleStage}
																	</MenuItem>
																))}
															{hasEnded && (
																<MenuItem
																	key={99999}
																	value={
																		Object.keys(data.gestores[value].history).length
																	}
																>
																	Finalizado
																</MenuItem>
															)}
														</Select>
													</FormControl>
												</>
											)}
										</div>
										{procedures.length > 0 ? (
											<div>
												<Button
													variant="contained"
													color="secondary"
													onClick={handleGoList("prev")}
												>
													<BeforeIcon /> Anterior
												</Button>
												<span>
													{index + 1} de {procedures.length}
												</span>
												<Button
													variant="contained"
													color="secondary"
													onClick={handleGoList("next")}
												>
													<NextIcon /> Siguiente
												</Button>
											</div>
										) : null}
									</div>
								</div>
								{hasDueDate() ? (
									<strong style={{ color: colorDueDate() }}>Vence el {whenDueDate()}</strong>
								) : null}
								{data.gestores.map((gestor, i) => {
									if (value === i) {
										return (
											<GestorTabs
												key={i}
												gestor={gestor}
												procedureId={procedureId}
												gestores={data.gestores}
												ecert={data.ecert}
												handleStep={handleStep}
												userId={userId}
												step={procedure}
												documentData={data}
											/>
										);
									} else {
										return null;
									}
								})}
							</>
						)}
					</Card>
				</Grid>
			</Grid>
			<hr />
			<div>
				{!hasEnded ? (
					<Button variant="contained" color="secondary" onClick={handleModalRemove}>
						<DeleteIcon /> Eliminar Procedimiento
					</Button>
				) : null}{" "}
				{pdfsArray.length <= 1 ? (
					<Button variant="contained" color="secondary" onClick={handlePdf}>
						<GetAppIcon /> Descargar PDF final
					</Button>
				) : null}{" "}
				<Button variant="contained" color="secondary" onClick={handleExcel}>
					<GetAppIcon /> Descargar en Excel
				</Button>
				<Note
					txt={
						"Excelente trabajo, en esta sección podrás ver el registro de los datos." +
						" Puedes eliminar este procedimiento si te pertenece."
					}
				/>
				<Dialog open={modalRemove} onClose={toggleRemove} classes={{ paper: "shadow-sm-dark rounded-sm" }}>
					<div className="text-center p-5">
						<h3 className="font-weight-bold mt-4" style={{ display: "flex", color: "#2e67fbcf" }}>
							¿Desea eliminar este procedimiento?
						</h3>

						<div className="pt-4">
							<Button variant="contained" color="secondary" onClick={handleRemove}>
								<DeleteIcon /> Eliminar Procedimiento
							</Button>
							<Button onClick={toggleRemove} className="btn-neutral-secondary btn-pill text-danger mx-1">
								<span className="btn-wrapper--label">Cancelar</span>
							</Button>
						</div>
					</div>
				</Dialog>
			</div>
		</>
	);
}
