import React, { useState, useEffect, forwardRef, useRef } from "react";
import { useDispatch } from "react-redux";
import MaterialTable from "material-table";
import { useHistory } from "react-router-dom";
import {
	TablePagination,
	Button,
	Dialog,
	DialogContent,
	Select,
	MenuItem,
	FormControl,
	InputLabel,
	TextField,
} from "@material-ui/core";
import Autocomplete from "@material-ui/lab/Autocomplete";
import Edit from "@material-ui/icons/Edit";
import DeleteOutline from "@material-ui/icons/DeleteOutline";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import { setSidebarName } from "../../reducers/ThemeOptions";
import axios from "../../utils/axios";

import { post_form, put_form, delete_bpmn } from "../../services/Form";
import { LocationTable } from "../../utils/LocationTable"; //cambio de idiomas

const tableIcons = {
	/*Add: forwardRef((props, ref) =>
		<Button {...props} ref={ref} className="MuiButtonBase-root MuiButton-root MuiButton-text btn-neutral-primary MuiButton-textSizeSmall MuiButton-sizeSmall">
			<span className="btn-wrapper--icon">
				<FontAwesomeIcon icon={['fas', 'plus']} />
			</span>
			<span className="btn-wrapper--label">Nuevo Formulario</span>
		</Button>),*/
	Edit: forwardRef((props, ref) => <Edit {...props} ref={ref} className="editBpmnList" />),
	Delete: forwardRef((props, ref) => <DeleteOutline {...props} ref={ref} className="deleteBpmnList" />),
};

const FormList = () => {
	const tableRef = useRef();

	const [openNewDialog, setOpenNewDialog] = useState(false);
	const [allForm, setAll] = useState(null);
	const [formBase, setFormBase] = useState({
		name: "",
		alias: "",
		descr: "",
		copy: "0",
		base: "",
		loading: false,
	});
	const [tags, setTags] = useState(false);
	const [tagValue, setTagsValue] = useState([]);
	const dispatch = useDispatch();
	dispatch(setSidebarName(["Formularios", "fab", "wpforms"]));

	const columns = [
		{ title: "ID", field: "_alias" },
		{ title: "Nombre", field: "_title" },
		{ title: "Descripción", field: "_description" },
	];

	//refactor este deberia ir en model
	const getDocsAll = async () => {
		try {
			const { data } = await axios.get("api/form/all?allfields=1");
			setAll(data);
		} catch (e) {
			console.error(e);
		}
	};
	const getTagsAll = async () => {
		try {
			const { data } = await axios.get("api/form/tags");
			setTags(data);
		} catch (e) {
			console.error(e);
		}
	};

	useEffect(() => {
		//getDocs();
		getDocsAll();
		getTagsAll();
		// eslint-disable-next-line
	}, []);

	const createform = (data, cb) => {
		if (!isNaN(data._title[0])) {
			alert("Error, el primer caracter no puede ser un número");
			cb(false);
			return;
		}
		post_form(data)
			.then(cb)
			.catch((error) => {
				console.error("Failed connection with API", error);
				setFormBase({ ...formBase, loading: false });
				//if(error)
				if (error.response.data.error) {
					if (error.response.data.error.name) {
						if (error.response.data.error.name === "MongoError") {
							if (error.response.data.error.keyValue["_title"] !== undefined) {
								alert(`El título ${formBase.name} ya ha sido utilizado.`);
							}
						}
					}
				}
			});
	};

	const history = useHistory();
	const goStage = (id) => {
		history.push("FormBuilder/" + id);
	};

	const handleKeyDown = (event) => {
		switch (event.key) {
			case "Enter": {
				event.preventDefault();
				event.stopPropagation();
				if (event.target.value.length > 0) {
					setTags([...tags, { name: event.target.value }]);
					setTagsValue([...tagValue, { name: event.target.value }]);
				}
				break;
			}
			default:
		}
	};
	const handleOpenNewDialog = (rowData) => {
		//setProcessCurrent(rowData);
		setOpenNewDialog(true);
	};

	const closeNewDialog = () => {
		setOpenNewDialog(false);
	};
	const handleFormChange = (event) => {
		setFormBase({ ...formBase, [event.target.name]: event.target.value });
	};
	const handleCreate = () => {
		if (formBase.name === "") {
			return alert("Debe ingresar un nombre válido");
		}
		if (formBase.copy === "1") {
			if (formBase.base === "") {
				return alert("Debe seleccionar un proceso válido");
			}
		}
		debugger;
		const newData = {
			_alias: formBase.alias.toLowerCase().replace(/ /g, "_") + "_",
			_title: formBase.name,
			_description: formBase.descr,
		};
		if (formBase.copy === "1") {
			const selected = allForm.find((it) => it._id === formBase.base);
			const jsonParsed = JSON.parse(selected._stringJson);
			jsonParsed.title = formBase.name;
			jsonParsed._description = formBase.descr;
			jsonParsed.description = formBase.descr;
			newData._stringJson = JSON.stringify(jsonParsed);
			newData._stringUiJson = selected._stringUiJson;
			let oldPrefix = selected._title.toLowerCase().replace(/ /g, "_");
			if (selected._alias) oldPrefix = selected._alias.toLowerCase().replace(/ /g, "_");
			if (!oldPrefix.endsWith("_")) oldPrefix = oldPrefix + "_";
			const newPrefix = newData._alias;
			newData._properties = selected._properties.map((item) => {
				const newField = item.replace(oldPrefix, newPrefix);
				newData._stringJson = newData._stringJson.replaceAll(item, newField);
				newData._stringUiJson = newData._stringUiJson.replaceAll(item, newField);
				return newField;
			});
		}
		if (tagValue.length > 0) {
			newData.tags = tagValue.map((it) => it.name);
		}
		setFormBase({ ...formBase, loading: true });
		createform(newData, (parseData) => {
			setFormBase({
				name: "",
				alias: "",
				descr: "",
				copy: "0",
				base: "",
				loading: false,
			});
			setTagsValue([]);
			setOpenNewDialog(false);
			if (tableRef.current) tableRef.current.onQueryChange();
		});
	};

	return (
		<>
			<span className="line otherLines"></span>
			<MaterialTable
				tableRef={tableRef}
				icons={tableIcons}
				localization={LocationTable}
				title="Configura tus formularios"
				columns={columns}
				data={(query) =>
					new Promise(async (resolve, reject) => {
						try {
							const filter = {};
							const params = { page: query.page + 1, limit: query.pageSize };
							if (query.search !== "") {
								filter._title = query.search;
								params.filter = filter;
							}
							const { data } = await axios.get("api/form", {
								params: params,
							});
							resolve({
								data: data.docs,
								page: query.page,
								totalCount: data.total,
							});
						} catch (e) {
							console.error(e);
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
								<span className="btn-wrapper--label">Nuevo Formulario</span>
							</Button>
						),
						tooltip: "Nuevo Formulario",
						isFreeAction: true,
						onClick: (event, rowData) => {
							handleOpenNewDialog(rowData);
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
						tooltip: "Configurar Formulario",
						onClick: (event, rowData) => {
							goStage(rowData._id);
						},
					},
				]}
				options={{
					addRowPosition: "first",
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
							put_form(newData, newData._id)
								.then((getResult) => {
									resolve();
								})
								.catch(() => console.log("Faild Connection"));
						}),
					onRowDelete: (oldData) =>
						new Promise((resolve) => {
							delete_bpmn(oldData._id)
								.then((getResult) => {
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
								{allForm ? (
									<>
										<h3>Crear un nuevo formulario</h3>
										<TextField
											id="outlined-basic"
											label="ID"
											name="alias"
											variant="outlined"
											value={formBase.alias}
											onChange={handleFormChange}
											fullWidth
										/>
										<TextField
											id="outlined-basic"
											label="Nombre del Formulario"
											name="name"
											variant="outlined"
											value={formBase.name}
											onChange={handleFormChange}
											fullWidth
										/>
										<TextField
											id="outlined-basic"
											label="Descripción"
											name="descr"
											variant="outlined"
											value={formBase.descr}
											onChange={handleFormChange}
											fullWidth
										/>
										{tags && (
											<Autocomplete
												multiple
												id="tags-standard"
												options={tags}
												getOptionLabel={(option) => option.name}
												value={tagValue}
												onChange={(event, newValue) => setTagsValue(newValue)}
												renderInput={(params) => {
													params.inputProps.onKeyDown = handleKeyDown;
													return (
														<TextField
															{...params}
															variant="standard"
															label="Categorías"
															placeholder="Ingrese categorías relevantes"
														/>
													);
												}}
											/>
										)}
										<FormControl
											style={{
												marginTop: 15,
												marginRight: 10,
												marginBottom: 10,
											}}
										>
											<InputLabel id="demo-controlled-open-select-label">
												Copiar de otro Formulario
											</InputLabel>
											<Select
												className="select-operation"
												labelId="demo-simple-select-outlined-label"
												id="demo-simple-select-outlined"
												label="Procedimiento"
												name="copy"
												value={formBase.copy}
												onChange={handleFormChange}
											>
												<MenuItem value="0">No</MenuItem>
												<MenuItem value="1">Si</MenuItem>
											</Select>
										</FormControl>
										{formBase.copy === "1" && (
											<FormControl style={{ marginTop: 15 }}>
												<InputLabel id="demo-controlled-open-select-label">
													Formulario Base
												</InputLabel>
												<Select
													className="select-operation"
													labelId="demo-simple-select-outlined-label"
													id="demo-simple-select-outlined"
													label="Procedimiento Base"
													name="base"
													value={formBase.base}
													onChange={handleFormChange}
												>
													{allForm.map((it) => (
														<MenuItem key={it._id} value={it._id}>
															{it._title}
														</MenuItem>
													))}
												</Select>
											</FormControl>
										)}
										<br />
										{formBase.loading ? (
											<h3>Cargando...</h3>
										) : (
											<Button onClick={handleCreate} className="btn-primary btn-pill mx-1">
												<span className="btn-wrapper--label">Crear Nuevo Formulario</span>
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
		</>
	);
};
export default FormList;
