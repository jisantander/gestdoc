import React, { forwardRef, useRef } from "react";
import MaterialTable from "material-table";
import { useState, useEffect } from "react";
import { useHistory } from "react-router-dom";
import {
	Dialog,
	DialogContent,
	TablePagination,
	Button,
	Select,
	MenuItem,
	FormControl,
	InputLabel,
} from "@material-ui/core"; // Modal
import Form from "@rjsf/material-ui"; //Form basado en Json
import Pt from "prop-types";
import { useDispatch } from "react-redux";
import TextField from "@material-ui/core/TextField";

import { Edit } from "@material-ui/icons";
import DeleteOutline from "@material-ui/icons/DeleteOutline";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import { setSidebarName } from "../../reducers/ThemeOptions";
import axios from "../../utils/axios";

import { post_bpmn, put_bpmn, delete_bpmn, quick_bpmn } from "../../services/Bpmn";
import { settingProcess, settingProcessNoExpress } from "../../utils/SchemasJson"; //Form basado en Json
import { LocationTable } from "../../utils/LocationTable"; //cambio de idiomas
import { useSelector } from "react-redux";

const tableIcons = {
	Edit: forwardRef((props, ref) => <Edit {...props} ref={ref} className="editBpmnList" />),
	Delete: forwardRef((props, ref) => <DeleteOutline {...props} ref={ref} className="deleteBpmnList" />),
};

const BmpnList = () => {
	const tableRef = useRef();

	const company = useSelector(({ auth }) => auth.company);
	const [allBpmn, setAll] = useState(null);
	const [bpmnBase, setBpmnBase] = useState({
		name: "",
		copy: "0",
		base: "",
		loading: false,
	});
	const dispatch = useDispatch();
	dispatch(setSidebarName(["Procesos", "fas", "sitemap"]));

	const columns = [
		{ title: "Nombre", field: "_nameSchema" },
		{ title: "Categoría", field: "_category" },
		{ title: "Descripción", field: "_description" },
	];

	const getDocsAll = async () => {
		try {
			const { data } = await axios.get("api/bpmn/all?allfields=1");
			setAll(data);
		} catch (e) {
			console.error(e);
		}
	};

	useEffect(() => {
		getDocsAll();
		// eslint-disable-next-line
	}, []);

	const createbpmn = (data, cb) => {
		post_bpmn(data)
			.then(cb)
			.catch((e) => console.error("Failed connection with API", e));
	};

	const onSubmit = ({ formData }, e) => {
		put_bpmn(formData, processCurrent._id)
			.then((newData) => {})
			.catch(() => console.log("Faild Connection"));
	};

	const [openDialog, setOpenDialog] = useState(false);
	const [openNewDialog, setOpenNewDialog] = useState(false);
	const [openQuickDialog, setOpenQuickDialog] = useState(false);
	const [processCurrent, setProcessCurrent] = useState(); // one item of dataTable.bpmn[] selected
	const [quickUrl, setQuickUrl] = useState("");

	const handleOpenDialog = (rowData) => {
		setProcessCurrent(rowData);
		setOpenDialog(true);
	};

	const closeDialog = () => {
		setOpenDialog(false);
	};

	const handleOpenNewDialog = (rowData) => {
		//setProcessCurrent(rowData);
		setOpenNewDialog(true);
	};

	const closeNewDialog = () => {
		setOpenNewDialog(false);
	};

	const handleOpenQuickDialog = (rowData) => {
		//setProcessCurrent(rowData);
		setQuickUrl('');
		setOpenQuickDialog(true);
	};

	const closeQuickDialog = () => {
		setQuickUrl('');
		setOpenQuickDialog(false);
	};

	const handleBpmnChange = (event) => {
		setBpmnBase({ ...bpmnBase, [event.target.name]: event.target.value });
	};

	const handleCreate = () => {
		if (bpmnBase.name === "") {
			return alert("Debe ingresar un nombre válido");
		}
		if (bpmnBase.copy === "1") {
			if (bpmnBase.base === "") {
				return alert("Debe seleccionar un proceso válido");
			}
		}
		const newData = {
			_nameSchema: bpmnBase.name,
		};
		if (bpmnBase.copy === "1") {
			const selected = allBpmn.find((it) => it._id === bpmnBase.base);
			newData._bpmnModeler = selected._bpmnModeler;
		}
		setBpmnBase({ ...bpmnBase, loading: true });
		createbpmn(newData, (parseData) => {
			setBpmnBase({ name: "", copy: "0", base: "", loading: false });
			setOpenNewDialog(false);
			if (tableRef.current) tableRef.current.onQueryChange();
		});
	};

	const handleQuickCreate = async () => {
		const selected = allBpmn.find((it) => it._id === bpmnBase.base);
		const quickUrl = await quick_bpmn(selected._id);
		setQuickUrl(quickUrl.url);
	};

	const history = useHistory();
	const goStage = (id) => {
		history.push("BpmnBuilder/" + id);
	};

	return (
		<>
			<span className="line otherLines"></span>
			<MaterialTable
				tableRef={tableRef}
				localization={LocationTable}
				title="Configurar tus procesos con el estandar BPMN"
				columns={columns}
				data={(query) =>
					new Promise(async (resolve, reject) => {
						try {
							const filter = {};
							const params = { page: query.page + 1, limit: query.pageSize };
							if (query.search !== "") {
								filter._nameSchema = query.search;
								params.filter = filter;
							}
							const { data } = await axios.get("api/bpmn", {
								params,
							});
							resolve({
								data: data.docs,
								page: query.page,
								totalCount: data.total,
							});
						} catch (e) {
							console.error(e);
							reject();
						}
					})
				}
				actions={[
					{
						icon: () => (
							<Button className="MuiButtonBase-root MuiButton-root MuiButton-text btn-neutral-primary MuiButton-textSizeSmall MuiButton-sizeSmall">
								<span className="btn-wrapper--icon">
									<FontAwesomeIcon icon={["fas", "plus"]} />
								</span>
								<span className="btn-wrapper--label">Nuevo Proceso</span>
							</Button>
						),
						tooltip: "Nuevo Proceso",
						isFreeAction: true,
						onClick: (event, rowData) => {
							handleOpenNewDialog(rowData);
						},
					},
					{
						icon: () => (
							<Button className="MuiButtonBase-root MuiButton-root MuiButton-text btn-neutral-primary MuiButton-textSizeSmall MuiButton-sizeSmall">
								<span className="btn-wrapper--icon">
									<FontAwesomeIcon icon={["fas", "plus"]} />
								</span>
								<span className="btn-wrapper--label">Acceso Rápido</span>
							</Button>
						),
						tooltip: "Acceso Rápido",
						isFreeAction: true,
						onClick: (event, rowData) => {
							handleOpenQuickDialog(rowData);
						},
					},
					{
						iconProps: {
							style: {
								background: "rgba(60,68,177,.15)",
								color: "#3c44b1",
								width: "40px",
								height: "40px",
								padding: "9px",
								borderRadius: "8px",
							},
						},
						icon: "login",
						tooltip: "Configurar BPMN",
						onClick: (event, rowData) => {
							goStage(rowData._id);
						},
					},
					{
						iconProps: {
							style: {
								background: "rgba(65,145,255,.15)",
								color: "#4191ff",
								width: "40px",
								height: "40px",
								padding: "9px",
								borderRadius: "8px",
							},
						},
						icon: "settings",
						tooltip: "Configurar Proceso",
						onClick: (event, rowData) => {
							handleOpenDialog(rowData);
						},
					},
				]}
				icons={tableIcons}
				options={{
					actionsColumnIndex: -1,
					pageSize: 10,
					pageSizeOptions: [10, 20, 30],
					initialPage: 0,
					padding: "dense",
					sorting: false,
				}}
				editable={{
					onRowUpdate: (newData, oldData) =>
						new Promise((resolve) => {
							put_bpmn({ ...newData, force: true }, newData._id)
								.then((getResult) => {
									resolve();
								})
								.catch(() => console.log("Faild Connection"));
						}),
					onRowDelete: (oldData) =>
						new Promise((resolve) => {
							delete_bpmn(oldData._id)
								.then(() => {
									resolve();
								})
								.catch((error) => console.log("Faild Connection", error));
						}),
				}}
				components={{
					Pagination: (props) => <TablePagination {...props} rowsPerPageOptions={[10, 20, 30]} />,
				}}
			/>
			<Dialog
				classes={{ paper: "modal-content" }}
				fullWidth
				maxWidth="md"
				open={openNewDialog}
				onClose={closeNewDialog}
				aria-labelledby="form-dialog-title2"
			>
				<DialogContent className="p-0">
					<div>
						<div className="bg-secondary border-0">
							<div className="card-body px-lg-5 py-lg-5">
								{allBpmn ? (
									<>
										<h3>Crear un nuevo proceso</h3>
										<TextField
											id="outlined-basic"
											label="Nombre del Proceso"
											name="name"
											variant="outlined"
											value={bpmnBase.name}
											onChange={handleBpmnChange}
											fullWidth
										/>
										<FormControl
											style={{
												marginTop: 15,
												marginRight: 10,
												marginBottom: 10,
											}}
										>
											<InputLabel id="demo-controlled-open-select-label">
												Copiar de otro BPMN
											</InputLabel>
											<Select
												className="select-operation"
												labelId="demo-simple-select-outlined-label"
												id="demo-simple-select-outlined"
												label="Procedimiento"
												name="copy"
												value={bpmnBase.copy}
												onChange={handleBpmnChange}
											>
												<MenuItem value="0">No</MenuItem>
												<MenuItem value="1">Si</MenuItem>
											</Select>
										</FormControl>
										{bpmnBase.copy === "1" && (
											<FormControl style={{ marginTop: 15 }}>
												<InputLabel id="demo-controlled-open-select-label">
													BPMN Base
												</InputLabel>
												<Select
													className="select-operation"
													labelId="demo-simple-select-outlined-label"
													id="demo-simple-select-outlined"
													label="Procedimiento Base"
													name="base"
													value={bpmnBase.base}
													onChange={handleBpmnChange}
												>
													{allBpmn.map((it) => (
														<MenuItem value={it._id}>{it._nameSchema}</MenuItem>
													))}
												</Select>
											</FormControl>
										)}
										<br />
										{bpmnBase.loading ? (
											<h3>Cargando...</h3>
										) : (
											<Button onClick={handleCreate} className="btn-primary btn-pill mx-1">
												<span className="btn-wrapper--label">Crear Nuevo Proceso</span>
											</Button>
										)}
									</>
								) : (
									<h3>Cargando...</h3>
								)}
							</div>
						</div>
					</div>
				</DialogContent>
			</Dialog>
			<Dialog
				classes={{ paper: "modal-content" }}
				fullWidth
				maxWidth="md"
				open={openQuickDialog}
				onClose={closeQuickDialog}
				aria-labelledby="form-dialog-title2"
			>
				<DialogContent className="p-0">
					<div>
						<div className="bg-secondary border-0">
							<div className="card-body px-lg-5 py-lg-5">
								{allBpmn ? (
									<>
										<h3>URL de Acceso Rápido</h3>
										<FormControl style={{ marginTop: 15 }}>
											<InputLabel id="demo-controlled-open-select-label">
												BPMN a Acortar
											</InputLabel>
											<Select
												className="select-operation"
												labelId="demo-simple-select-outlined-label"
												id="demo-simple-select-outlined"
												label="Procedimiento Base"
												name="base"
												value={bpmnBase.base}
												onChange={handleBpmnChange}
											>
												{allBpmn.map((it) => (
													<MenuItem value={it._id}>{it._nameSchema}</MenuItem>
												))}
											</Select>
										</FormControl>
										<br />
										{bpmnBase.loading ? (
											<h3>Cargando...</h3>
										) : (
											<Button onClick={handleQuickCreate} className="btn-primary btn-pill mx-1">
												<span className="btn-wrapper--label">Obtener URL acortada</span>
											</Button>
										)}
										<br />
										{quickUrl !== "" && (
											<>
												<h3>URL de Acceso Rápido</h3>
												<TextField
													id="outlined-basic"
													label="URL"
													name="name"
													variant="outlined"
													value={quickUrl}
													fullWidth
												/>
											</>
										)}
									</>
								) : (
									<h3>Cargando...</h3>
								)}
							</div>
						</div>
					</div>
				</DialogContent>
			</Dialog>
			<Dialog
				classes={{ paper: "modal-content" }}
				fullWidth
				maxWidth="md"
				open={openDialog}
				onClose={closeDialog}
				aria-labelledby="form-dialog-title2"
			>
				<DialogContent className="p-0">
					<div>
						<div className="bg-secondary border-0">
							<div className="card-body px-lg-5 py-lg-5 hola">
								<Form
									schema={company ? settingProcessNoExpress : settingProcess}
									formData={processCurrent}
									onSubmit={onSubmit}
								/>
							</div>
						</div>
					</div>
				</DialogContent>
			</Dialog>
		</>
	);
};

BmpnList.propTypes = {
	dataTable: Pt.shape({
		_bpmnModeler: Pt.string,
		_category: Pt.string,
		_descriPtion: Pt.string,
		_id: Pt.string,
		_link: Pt.string,
		_nameSchema: Pt.string,
		_requirements: Pt.arrayOf(Pt.string),
		_valor: Pt.number,
	}),
};

export default BmpnList;
