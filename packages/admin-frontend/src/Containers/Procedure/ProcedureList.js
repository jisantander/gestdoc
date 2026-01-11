import React, { useState, useEffect } from "react";
import MaterialTable from "material-table";
import { useHistory } from "react-router-dom";
import Note from "../Note";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
	TablePagination,
	Button,
	Dialog,
	FormControl,
	InputLabel,
	Select,
	MenuItem,
	Checkbox,
} from "@material-ui/core";
import moment from "moment";
import { useSelector, useDispatch } from "react-redux";
import Snackbar from "@material-ui/core/Snackbar";
import DeleteIcon from "@material-ui/icons/Delete";

import imageOperation from "../../images/laborales.svg";

import { setSidebarName } from "../../reducers/ThemeOptions";
import { setProcedureList } from "../../reducers/procedureList";

import axios from "../../utils/axios";
import useDidMountEffect from "../../hooks/useDidMountEffect";

import AutocompleteControl from "../../utils/AutocompleteControl";
import { Loading } from "../../utils/Loading";
import { LocationTable } from "../../utils/LocationTable"; //cambio de idiomas
import ProcedureListImport from "./ProcedureListImport";
import ProcedureListFilter from "./ProcedureListFilter";
import ProcedureListBreadcrumb from "./ProcedureListBreadcrumb";
import SimpleTable from "../../layout-components/SimpleTable";

const initialFilter = {
	page: 0,
	limit: 10,
	user: "-",
	bpmn: "-",
	due: "-",
	since: "",
	updated: "",
	sequence: "",
	step: "-",
	form: [],
	ended: "-",
};

const ProcedureList = () => {
	const history = useHistory();
	const dispatch = useDispatch();
	const { email: userEmail, role: userRole } = useSelector(({ auth }) => auth);

	const company = useSelector(({ auth }) => auth.company);
	const [total, setTotal] = useState(0);
	const [dataTable, setData] = useState(null);
	const [bpmns, setBpmn] = useState([]);
	const [users, setUsers] = useState([]);
	const [filter, setFilter] = useState(initialFilter);
	const [open, setOpen] = useState(false);
	const [dialog, setDialog] = useState("create");
	const [loading, setLoading] = useState(false);
	const [steps, setSteps] = useState([]);
	const [forms, setForms] = useState([]);
	const [gestores, setGestores] = useState([]);
	const [gestoresUsers, setGestoresUsers] = useState([]);
	const [selectedRows, setSelectedRows] = useState([]);
	const [state, setState] = useState({
		openMsg: false,
		vertical: "top",
		horizontal: "center",
		toastrStyle: "",
		message: "This is a toastr/snackbar notification!",
	});

	const [modal4, setModal4] = useState(false);
	const toggle4 = () => setModal4(!modal4);

	const { vertical, horizontal, openMsg, toastrStyle, message } = state;

	dispatch(setSidebarName(["Operaciones", imageOperation]));

	const columns = [
		{
			title: "",
			field: "selection",
			render: (rowData) => (
				<Checkbox
					checked={selectedRows.indexOf(rowData._id) !== -1}
					onChange={(event) => handleRowSelect(event, rowData)}
				/>
			),
		},
		{ title: "ID", field: "sequence", width: "10%" },
		{ title: "Operaciones", field: "bpmn._nameSchema", width: "30%" },
		{
			width: "10%",
			title: "Usuario",
			render: (rowData) => {
				return (
					<div>
						{rowData.email
							? rowData.email
							: rowData.gestores
							? rowData.gestores.map((it) => <>{it.name}</>)
							: null}
					</div>
				);
			},
		},
		{
			width: "20%",
			title: "Etapa",
			render: (rowData) => {
				return (
					<div>
						{rowData.gestores
							? rowData.gestores.map((it) => <>{it.current_name || it.current}</>)
							: "Rescate"}
					</div>
				);
			},
		},
		{
			width: "15%",
			title: "Fecha Inicio",
			render: (rowData) => {
				const createdAt = moment(rowData.createdAt).utcOffset("GMT-04:00").format("DD/MM/YYYY , h:mm a");
				return createdAt;
			},
		},
		{
			width: "15%",
			title: "Fecha Fin",
			render: (rowData) => {
				if (rowData.origin === "rescue") return "Rescate";
				if (!rowData.gestores) return "";
				const newRowData = rowData.gestores.filter((it) => it.vence);
				const $newRowData = newRowData.map((it) => {
					const dueDate = moment(rowData.createdAt.substr(0, 16)).add(it.vence, "days").format("DD/MM/YYYY");
					const diffDue =
						moment(rowData.createdAt.substr(0, 16)).add(it.vence, "days").diff(moment(), "days") + 1;
					let colorDue = "green";
					if (diffDue <= 3) {
						colorDue = "orange";
					}
					if (diffDue <= 1) {
						colorDue = "red";
					}
					return (
						<div key={it.name}>
							<strong style={{ color: colorDue }}>
								{dueDate} para {it.name}
							</strong>
						</div>
					);
				});
				return newRowData.length === 0 ? "" : <>{$newRowData}</>;
			},
		},
	];

	const getDocs = async () => {
		try {
			setLoading(true);
			const { data } = await axios.get("api/procedure", {
				params: { page: filter.page + 1, limit: filter.limit, filter },
			});
			setData(data.docs);
			dispatch(setProcedureList(data.docs));
			setTotal(data.total);
			setLoading(false);
			if (data.docs.length === 0 && filter.page !== 0) {
				setFilter({ ...filter, page: 0, limit: 10 });
			}
		} catch (e) {
			console.error(e);
		}
	};

	const getProcedures = async () => {
		try {
			const { data } = await axios.get("api/bpmn/all");
			/*debugger;*/
			setBpmn(data);
		} catch (e) {
			console.error(e);
		}
	};
	const getUsers = async () => {
		try {
			if (userRole === "VISITOR") return setUsers([]);
			const { data } = await axios.get("api/users/all");
			setUsers(data);
		} catch (e) {
			console.error(e);
		}
	};
	const getParticipants = async () => {
		try {
			const {
				data: { participants },
			} = await axios.get(`api/bpmn/gestor`, {
				params: { bpmn: filter.bpmn },
			});
			setGestoresUsers(participants.map((it) => userEmail));
			setGestores(participants);
		} catch (e) {
			console.error(e);
		}
	};

	useDidMountEffect(() => {
		const loadSteps = async () => {
			const { data } = await axios.post(`api/bpmn/steps/${filter.bpmn}`);
			setSteps(data[0].steps);
			setForms(data[0].forms);
		};
		if (filter.bpmn !== "-") loadSteps();
		else {
			setSteps([]);
		}
	}, [filter.bpmn]);

	useDidMountEffect(() => {
		localStorage.setItem("proc_list", JSON.stringify(filter));
		getDocs();
		// eslint-disable-next-line
	}, [filter]);

	useEffect(() => {
		getProcedures();
		getUsers();
		const initialLoad = () => {
			const initialFilterJson = localStorage.getItem("proc_list");
			let initialFilterObj = false;
			if (initialFilterJson) {
				initialFilterObj = JSON.parse(initialFilterJson);
				if (initialFilterObj) {
					setFilter(initialFilterObj);
				} else {
					getDocs();
				}
			} else {
				getDocs();
			}
		};
		initialLoad();
		// eslint-disable-next-line
	}, []);

	const handlePage = (tmpPage) => {
		setFilter({ ...filter, page: tmpPage });
	};
	const handleLimit = (tmpLimit) => {
		setFilter({ ...filter, limit: tmpLimit });
	};

	const goStage = (id) => {
		history.push("Procedure/" + id);
	};

	const handleCloseMsg = () => {
		setState({ ...state, open: false });
	};
	const handleClose = () => {
		setOpen(false);
	};
	const handleCreate = () => {
		if (filter.bpmn === "-") {
			/*setState({
				...state,
				open: true,
				toastrStyle: 'toastr-success',
				message: 'Debe seleccionar un Trámite a ser creado',
			});*/
			toggle4();
		} else {
			setDialog("create");
			setOpen(true);
			getParticipants();
		}
	};
	const handleCreatePost = async () => {
		if (filter.bpmn === "-") {
			toggle4();
		} else {
			try {
				setLoading(true);
				const participants = gestores.map((item, i) => {
					const userId = users.find((it) => it.email === gestoresUsers[i]);
					return { id: item.id, user: userId._id };
				});
				const { data } = await axios.post("api/procedure", {
					bpmn: filter.bpmn,
					participants,
				});
				history.push("Procedure/" + data._id);
			} catch (e) {
				console.error(e);
			}
		}
	};
	const handleModalImport = () => {
		setDialog("download");
		setOpen(true);
	};
	const handleBpmn = (bpmnValue) => {
		if (bpmnValue !== "-")
			setFilter({
				...filter,
				bpmn: bpmnValue,
				step: "-",
				page: 0,
				form: [],
			});
		else {
			setFilter({ ...filter, bpmn: "-", step: "-", page: 0, form: [] });
		}
		setModal4(false);
	};
	const handleUser = () => {
		setDialog("user");
		setOpen(true);
	};
	const handleUsers = (userSelected) => {
		if (userSelected !== "-") setFilter({ ...filter, user: userSelected, page: 0 });
		else {
			const { user, ...newFilter } = filter;
			setFilter({ ...newFilter, page: 0, user: "-" });
		}
		setOpen(false);
	};
	const handleSequence = (e) => {
		if (e.target.value !== "-") {
			let sequenceProc = e.target.value;
			//if (!isNaN(sequenceProc))
			setFilter({ ...filter, sequence: sequenceProc, page: 0 });
		} else {
			const { sequence, ...newFilter } = filter;
			setFilter({ ...newFilter, page: 0 });
		}
	};
	const handleStep = (stepValue) => {
		if (stepValue !== "-") {
			setFilter({ ...filter, page: 0, form: [], step: stepValue });
		} else {
			setFilter({ ...filter, page: 0, form: [], step: "-" });
		}
	};
	const handleDue = (dueValue) => {
		if (dueValue !== "") {
			setFilter({ ...filter, page: 0, due: dueValue });
		} else {
			setFilter({ ...filter, page: 0, due: "-" });
		}
	};
	const handleDeleteFilter = (field = "form", formField = false) => {
		let newFilter = { ...filter };
		if (field !== "form") {
			newFilter[field] = "-";
			if (field === "sequence") {
				newFilter["sequence"] = "";
			}
			if (field === "since") {
				delete newFilter["since"];
			}
			if (field === "updated") {
				delete newFilter["updated"];
			}
			if (field === "bpmn") {
				newFilter["step"] = "-";
				newFilter["form"] = [];
			}
		} else {
			newFilter.form = filter.form.filter((it) => it[0] !== formField);
		}
		setFilter({ ...newFilter });
	};
	const handleGestorUser = (i) => (e) => {
		const newGestoresUsers = [...gestoresUsers];
		newGestoresUsers[i] = e.target.value;
		setGestoresUsers(newGestoresUsers);
	};
	const handleForm = (id, value) => {
		let newForm = filter.form;
		const indexValue = filter.form.findIndex((it) => it[0] === id);
		if (indexValue === -1 && value !== "") newForm.push([id, value]);
		else newForm[indexValue][1] = value;
		if (value === "" && indexValue !== -1) {
			newForm = filter.form.filter((it, i) => i !== indexValue);
		}
		setFilter({ ...filter, form: newForm });
	};
	const handleSince = (newDate) => {
		if (newDate === "" || newDate === "Invalid date") {
			const { since, ...newFilters } = filter;
			return setFilter({ ...newFilters });
		}
		setFilter({ ...filter, since: moment(newDate).add(-5, "hours").format("YYYY-MM-DD") });
	};
	const handleUpdated = (newDate) => {
		if (newDate === "" || newDate === "Invalid date") {
			const { updated, ...newFilters } = filter;
			return setFilter({ ...newFilters });
		}
		setFilter({ ...filter, updated: moment(newDate).add(-5, "hours").format("YYYY-MM-DD") });
	};
	const handleEnded = (value) => {
		setFilter({ ...filter, ended: value });
	};
	const handleDownload = async () => {
		const tmpEmail = prompt(
			`Ingrese un correo para enviar la descarga. Se intentará descargar los ${total} procedimientos encontrados.`
		);
		if (tmpEmail === null) {
			return;
		}
		if (tmpEmail === "") {
			return alert("Debe ingresar un correo válido por si la descarga es muy grande.");
		}
		try {
			const response = await axios({
				method: "post",
				url: "api/procedure/download",
				data: { filter, email: tmpEmail },
				responseType: "blob",
			});
			if (response.headers["content-type"] === "application/json; charset=utf-8") {
				const textResponse = JSON.parse(await response.data.text());
				return alert(textResponse);
			}
			const fileNameHeader = "x-suggested-filename";
			const suggestedFileName = response.headers[fileNameHeader];
			let effectiveFileName = suggestedFileName === undefined ? "Documentos.zip" : suggestedFileName;
			effectiveFileName = effectiveFileName.substr(0, effectiveFileName.length - 4) + ".zip";
			const url = window.URL.createObjectURL(new Blob([response.data]));
			const link = document.createElement("a");
			link.href = url;
			link.setAttribute("download", effectiveFileName);
			document.body.appendChild(link);
			link.click();
		} catch (err) {
			if (err?.response?.data) {
				return alert("No hay procedimientos con PDF para descargar");
			}
			alert("Hubo un error al intentar la descarga");
		}
	};

	const handleRowSelect = (event, rowData) => {
		console.log("conflux", { rowData, selectedRows });
		const selectedIndex = selectedRows.indexOf(rowData._id);
		let newSelectedRows = [];

		if (selectedIndex === -1) {
			newSelectedRows = newSelectedRows.concat(selectedRows, rowData._id);
		} else if (selectedIndex === 0) {
			newSelectedRows = newSelectedRows.concat(selectedRows.slice(1));
		} else if (selectedIndex === selectedRows.length - 1) {
			newSelectedRows = newSelectedRows.concat(selectedRows.slice(0, -1));
		} else if (selectedIndex > 0) {
			newSelectedRows = newSelectedRows.concat(
				selectedRows.slice(0, selectedIndex),
				selectedRows.slice(selectedIndex + 1)
			);
		}

		setSelectedRows(newSelectedRows);
	};
	const handleDelete = async () => {
		if (window.confirm(`¿Está seguro que desea eliminar todos los procedimientos seleccionados?`)) {
			try {
				const { data } = await axios.delete(`/api/procedure`, {
					data: {
						rows: selectedRows,
					},
				});
				if (data.success) {
					alert("Procedimientos eliminados");
				} else {
					alert("Error al eliminar procedimientos");
				}
				onRefresh();
				setSelectedRows([]);
			} catch (e) {
				alert("Error al eliminar procedimientos");
			}
		}
	};

	const onRefresh = () => {
		setFilter({ ...filter, page: 0 });
		handleClose();
	};

	const defaultValueAutocomplete = (values, id, name, valForm) => {
		try {
			if (valForm === "-") return { inputValue: "-", value: "Todos" };
			return values
				.filter((e) => e._id === valForm)
				.map((item) => {
					return { inputValue: item[id], _title: item[name] };
				})[0];
		} catch (error) {
			return { inputValue: "-", value: "Todos" };
		}
	};

	const updToAutocomplete = (arrayData, id, name) => {
		return [
			{ inputValue: "-", _title: "Todos" },
			...arrayData.map((item) => {
				return { inputValue: item[id], _title: item[name] };
			}),
		];
	};

	if (userRole === "VISITOR") {
		return dataTable == null ? (
			<Loading />
		) : (
			<>
				{" "}
				<SimpleTable rows={dataTable} />
			</>
		);
	}

	return dataTable == null ? (
		<Loading />
	) : (
		<>
			<Dialog fullWidth={true} maxWidth="lg" onClose={handleClose} open={open}>
				<div className="text-center p-5">
					{dialog === "create" && (
						<>
							<h4 className="font-weight-bold mt-4">Primero asignaremos responsable a cada rol</h4>
							{gestores.length > 0 ? (
								<ul>
									{gestores.map((item, i) => (
										<li key={item.id} className="box-list">
											{item.name}{" "}
											<FormControl variant="outlined">
												<InputLabel id="demo-simple-select-outlined-label">
													Responsable
												</InputLabel>
												<Select
													labelId="demo-simple-select-outlined-label"
													id="demo-simple-select-outlined"
													label="Responsable"
													value={gestoresUsers[i]}
													onChange={handleGestorUser(i)}
												>
													{users.map((item) => (
														<MenuItem value={item.email}>{item.name}</MenuItem>
													))}
												</Select>
											</FormControl>
										</li>
									))}
								</ul>
							) : (
								<Loading />
							)}
							<div className="pt-4">
								<Button className="btn-primary btn-pill mx-1" onClick={handleCreatePost}>
									<span className="btn-wrapper--label">Crear Procedimiento</span>
								</Button>
								<Button onClick={handleClose} className="btn-neutral-dark btn-pill mx-1">
									<span className="btn-wrapper--label">Cancel</span>
								</Button>
							</div>
						</>
					)}
					{dialog === "user" && (
						<ProcedureListFilter
							filter={filter}
							users={users}
							handleUsers={handleUsers}
							selected={filter.bpmn}
							bpmns={bpmns}
							handleBpmn={handleBpmn}
							steps={steps}
							forms={forms}
							handleStep={handleStep}
							handleSequence={handleSequence}
							handleDue={handleDue}
							handleForm={handleForm}
							handleSince={handleSince}
							handleUpdated={handleUpdated}
							handleEnded={handleEnded}
							onRefresh={onRefresh}
						/>
					)}
					{dialog === "download" && <ProcedureListImport bpmns={bpmns} />}
				</div>
			</Dialog>
			<div className="customTable">
				<MaterialTable
					localization={LocationTable}
					title="Operaciones"
					columns={columns}
					data={dataTable}
					actions={[
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
							icon: "search",
							tooltip: "Ver Detalles",
							onClick: (event, rowData) => {
								goStage(rowData._id);
							},
						},
					]}
					options={{
						actionsColumnIndex: -1,
						pageSize: filter ? filter.limit : 10,
						pageSizeOptions: [10, 20, 50, 100],
						initialPage: 0,
						padding: "dense",
						sorting: false,
					}}
					components={{
						Toolbar: (props) => {
							if (loading) return <Loading />;
							return (
								<div>
									<div
										style={{
											padding: "10px",
											paddingTop: "18px",
											display: "flex",
											justifyContent: "space-between",
										}}
									>
										<div style={{ display: "flex" }}>
											{" "}
											<h5 style={{ display: "flex" }}>
												Revisa el estado y flujo de tus operaciones{" "}
												<span className="line"></span>{" "}
											</h5>{" "}
										</div>
										<div style={{ display: "flex" }}>
											{userRole !== "VISITOR" && process.env.REACT_APP_EXP !== company && (
												<Button
													className="MuiButtonBase-root MuiButton-root MuiButton-text btn-neutral-primary MuiButton-textSizeSmall MuiButton-sizeSmall"
													onClick={handleCreate}
												>
													<span className="btn-wrapper--icon">
														<FontAwesomeIcon icon={["fas", "play-circle"]} />
													</span>
													<span className="btn-wrapper--label">Iniciar nueva operación</span>
												</Button>
											)}
											{userRole !== "VISITOR" && process.env.REACT_APP_EXP !== company && (
												<Button
													className="MuiButtonBase-root MuiButton-root MuiButton-text btn-neutral-primary MuiButton-textSizeSmall MuiButton-sizeSmall"
													onClick={handleModalImport}
												>
													<span className="btn-wrapper--icon">
														<FontAwesomeIcon icon={["fas", "upload"]} />
													</span>
													<span className="btn-wrapper--label">Importar</span>
												</Button>
											)}
											{(users.length >= 1 || userRole === "VISITOR") && (
												<Button
													onClick={handleUser}
													className="MuiButtonBase-root MuiButton-root MuiButton-text btn-neutral-primary MuiButton-textSizeSmall MuiButton-sizeSmall"
												>
													<span className="btn-wrapper--icon">
														<FontAwesomeIcon icon={["fas", "search"]} />
													</span>
													<span className="btn-wrapper--label">
														{filter.user !== "-"
															? users.find((it) => it._id === filter.user).name
															: "Filtrar"}
													</span>
												</Button>
											)}
											<Button
												onClick={handleDownload}
												className="MuiButtonBase-root MuiButton-root MuiButton-text btn-neutral-primary MuiButton-textSizeSmall MuiButton-sizeSmall"
											>
												<span className="btn-wrapper--icon">
													<FontAwesomeIcon icon={["fas", "download"]} />
												</span>
												<span className="btn-wrapper--label">Descargar</span>
											</Button>
											{selectedRows.length > 0 ? (
												<Button
													variant="contained"
													color="secondary"
													onClick={handleDelete}
													style={{
														backgroundColor: "red",
													}}
												>
													<DeleteIcon /> Eliminar Procedimientos
												</Button>
											) : null}
										</div>
									</div>
									<ProcedureListBreadcrumb
										filter={filter}
										bpmns={bpmns}
										steps={steps}
										forms={forms}
										changeFilter={handleDeleteFilter}
									/>
								</div>
							);
						},
						Pagination: (props) => (
							<TablePagination
								{...props}
								rowsPerPageOptions={[10, 20, 30]}
								rowsPerPage={filter.limit}
								count={total}
								page={filter.page}
								onChangePage={(e, page) => handlePage(page)}
								onChangeRowsPerPage={(event) => {
									props.onChangeRowsPerPage(event);
									handleLimit(event.target.value);
								}}
							/>
						),
					}}
				/>
			</div>

			<Note txt={"Le llamamos operación a cualquier trámite o flujo de nuestros documentos "} />

			<>
				<div className="d-flex align-items-center justify-content-center flex-wrap">
					<Dialog open={modal4} onClose={toggle4} classes={{ paper: "shadow-sm-dark rounded-sm" }}>
						<div className="text-center p-5">
							<div className="avatar-icon-wrapper rounded-circle m-0">
								<div
									className="d-inline-flex justify-content-center p-0 rounded-circle btn-icon avatar-icon-wrapper  m-0 d-130"
									style={{ backgroundColor: "#2e67fb26", color: "#fff" }}
								>
									<FontAwesomeIcon
										icon={["fas", "door-open"]}
										className="d-flex align-self-center display-3"
									/>
								</div>
							</div>
							<h4 className="font-weight-bold mt-4" style={{ display: "flex", color: "#2e67fbcf" }}>
								Primero selecciona el proceso que quieras iniciar, luego vuelve a este modal{" "}
							</h4>

							<AutocompleteControl
								options={updToAutocomplete(bpmns, "_id", "_nameSchema")}
								defaultValue={defaultValueAutocomplete(bpmns, "_id", "_nameSchema", filter.bpmn)}
								cbChange={(value) => {
									if (value) {
										handleBpmn(value.inputValue);
									}
								}}
								label={"Procesos"}
							/>

							<div className="pt-4">
								<Button onClick={toggle4} className="btn-neutral-secondary btn-pill text-danger mx-1">
									<span className="btn-wrapper--label">Cancelar</span>
								</Button>
							</div>
						</div>
					</Dialog>
				</div>
			</>

			<Snackbar
				anchorOrigin={{ vertical, horizontal }}
				open={openMsg}
				classes={{ root: toastrStyle }}
				onClose={handleCloseMsg}
				message={message}
			/>
		</>
	);
};
export default ProcedureList;
