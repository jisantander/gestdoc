import React, { useState, useEffect } from "react";
import { Card, MenuItem, Divider } from "@material-ui/core";
import { Fab, InputAdornment, TextField } from "@material-ui/core";
import Alert from "@material-ui/lab/Alert";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { CopyToClipboard } from "react-copy-to-clipboard";
import { Tooltip } from "@material-ui/core";

import AutocompleteControl from "../../utils/AutocompleteControl";
import axios from "../../utils/axios";
import useDidMountEffect from "../../hooks/useDidMountEffect";

export default function ShareOptionsForm({ system }) {
	const [bpmn, setBpmn] = useState("");
	const [bpmns, setBpmns] = useState([{ inputValue: "", _title: "Seleccione" }]);
	const [listForm, setListForm] = useState({ forms: [] });
	const [currentForm, setCurrentForm] = useState(null);
	const [listProperties, setListProperties] = useState([]);
	const [copyClip, setCopyClip] = useState("");

	const handleChange = (event) => {
		var formSelected = listForm.forms.filter((item) => {
			return item._title === event.target.value;
		});
		setListProperties(formSelected[0]._properties);
		setCurrentForm(event.target.value);
	};

	const handleBpmn = (value) => {
		setListForm({ forms: [] });
		setCurrentForm(null);
		setListProperties([]);
		setBpmn(value);
	};

	useEffect(() => {
		const loadData = async () => {
			try {
				const { data: bpmnData } = await axios.get("api/bpmn/all");
				if (bpmnData.length > 0) {
					setBpmns(bpmnData);
					setBpmn(bpmnData[0]._id);
				}
			} catch (e) {
				console.error(e);
				alert("Hubo un error al obtener la información.");
			}
		};
		loadData();
	}, []);
	useDidMountEffect(() => {
		const loadForms = async () => {
			if (bpmn) {
				try {
					const {
						data: [formData],
					} = await axios.post(`api/bpmn/steps/${bpmn}`);
					const newForms = formData.forms.filter(
						(person, index) => index === formData.forms.findIndex((other) => person._id === other._id)
					);
					setListForm({ forms: newForms });
				} catch (e) {
					console.error(e);
					alert("Hubo un error al obtener los formularios.");
				}
			} else {
				alert("Seleccione un proceso");
			}
		};
		loadForms();
	}, [bpmn]);

	const defaultValueAutocomplete = (values, id, name, valForm) => {
		try {
			if (valForm === "-") return { inputValue: "", value: "Todos" };
			return values
				.filter((e) => e._id === valForm)
				.map((item) => {
					return { inputValue: item[id], _title: item[name] };
				})[0];
		} catch (error) {
			return { inputValue: "", value: "Todos" };
		}
	};

	const updToAutocomplete = (arrayData, id, name) => {
		return [
			{ inputValue: "", _title: "Todos" },
			...arrayData.map((item) => {
				return { inputValue: item[id], _title: item[name] };
			}),
		];
	};

	if (listForm == null) {
		return <></>;
	}

	return listForm == null ? (
		<></>
	) : (
		<>
			<Card className="p-4 mb-4">
				<div className="font-size-lg font-weight-bold">Campos de los formularios</div>
				<p className="text-black-50 mb-0">
					Seleccione un campo para luego pegarlo en {system}, luego el sistema remplazará el campo del
					formulario por el valor ingresado por el usuario.
				</p>
				<Divider className="my-4" />
				<div className="p-3">
					{bpmns.length > 1 && (
						<AutocompleteControl
							options={updToAutocomplete(bpmns, "_id", "_nameSchema")}
							defaultValue={defaultValueAutocomplete(bpmns, "_id", "_nameSchema", bpmn)}
							cbChange={(value) => {
								if (value) {
									handleBpmn(value.inputValue);
								}
							}}
							label={"Procesos"}
						/>
					)}
					{listForm.forms.length === 0 ? (
						""
					) : (
						<TextField
							className="m-2"
							id="standard-select-form"
							name="stage"
							select
							label="Formularios"
							value={currentForm}
							onChange={(e) => {
								handleChange(e);
							}}
							helperText="Revise los campos de los formularios"
							variant="outlined"
						>
							{listForm.forms.map((option) => (
								<MenuItem key={option._id} value={option._title}>
									{option._title}
								</MenuItem>
							))}
						</TextField>
					)}

					{listProperties.length === 0
						? ""
						: listProperties.map((text) => (
								<div style={{ margin: 10 }}>
									<Tooltip title={"{" + text + "}"} arrow>
										<TextField
											disabled
											variant="outlined"
											value={"{" + text + "}"}
											fullWidth
											InputProps={{
												endAdornment: (
													<InputAdornment position="end">
														<CopyToClipboard
															text={"{" + text + "}"}
															onCopy={(e) => setCopyClip(e)}
														>
															<Fab size="small" color="primary">
																<FontAwesomeIcon icon={["fas", "save"]} />
															</Fab>
														</CopyToClipboard>
													</InputAdornment>
												),
											}}
										/>
									</Tooltip>
								</div>
						  ))}
					{copyClip !== "" ? (
						<Alert className="mb-4" severity="success">
							<span>
								Se ha copiado <b>{copyClip}</b> en su portapapeles{" "}
							</span>
						</Alert>
					) : null}
				</div>
			</Card>
		</>
	);
}
