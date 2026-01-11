import React, { useState } from "react";
import { DialogTitle, TextField, FormControl, Grid, Select, MenuItem, Button } from "@material-ui/core";
import DateFnsUtils from "@date-io/date-fns";
import { DatePicker, MuiPickersUtilsProvider } from "@material-ui/pickers";
import DeleteIcon from "@material-ui/icons/Delete";
import { useSelector } from "react-redux";

import AutocompleteControl from "../../utils/AutocompleteControl";

import useDidMountEffect from "../../hooks/useDidMountEffect";
import useDebounce from "../../hooks/useDebounce";

import axios from "../../utils/axios";

const FilterFormInput = ({ item, initialValue, handleForm }) => {
	const [value, setValue] = useState(initialValue);

	const debouncedValue = useDebounce(value, 800);

	useDidMountEffect(() => {
		handleForm(item.id, debouncedValue);
	}, [debouncedValue]);

	if (item.type === "string") {
		return (
			<FormControl variant="outlined">
				<TextField
					labelId="label-filter-sequence"
					id="demo-simple-select-outlined"
					label={item.title}
					value={value}
					onChange={(e) => setValue(e.target.value)}
				/>
			</FormControl>
		);
	}
	return null;
};

const FilterForm = ({ forms, filter, handleForm }) => {
	const [selected, setSelected] = useState("-");

	const handleFilterForm = (e) => setSelected(e.target.value);

	const alreadyDone = [];
	let formSelected = false;
	let propertiesArray = [];
	if (selected !== "-") {
		formSelected = forms.find((it) => it._id === selected);
		const { properties } = JSON.parse(formSelected._stringJson);
		propertiesArray = Object.values(properties);
	}

	return (
		<div>
			<h5>Formularios relacionados</h5>
			<Select
				style={{ margin: 20 }}
				labelId="demo-simple-select-outlined-label"
				id="demo-simple-select-outlined"
				label="Formulario"
				value={selected}
				onChange={handleFilterForm}
			>
				<MenuItem value="-">Ningún formulario</MenuItem>
				{forms.map((form) => {
					if (alreadyDone.findIndex((itf) => itf === form._title) === -1) {
						alreadyDone.push(form._title);
						return (
							<MenuItem key={form._id} value={form._id}>
								{form._title}
							</MenuItem>
						);
					} else {
						return null;
					}
				})}
			</Select>
			{formSelected && (
				<div>
					{propertiesArray.map((item) => {
						let initialValue = "";
						const indexValue = filter.form.findIndex((it) => it[0] === item.id);
						if (indexValue !== -1) {
							initialValue = filter.form[indexValue][1];
						}
						return <FilterFormInput item={item} initialValue={initialValue} handleForm={handleForm} />;
					})}
				</div>
			)}
		</div>
	);
};

export default function ProcedureListFilter({
	filter,
	users,
	handleUsers,
	selected,
	bpmns,
	handleBpmn,
	steps,
	forms,
	handleStep,
	handleSequence,
	handleDue,
	handleForm,
	handleSince,
	handleUpdated,
	handleEnded,
	onRefresh,
}) {
	const { role: userRole } = useSelector(({ auth }) => auth);

	let hasForm = false;
	if (selected !== "-" && steps.length > 0) {
		if (filter.step === "-" && forms.length > 0) {
			hasForm = true;
		}
	}

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

	const arrayDues = [
		{ inputValue: "R", value: "Menos 1 día" },
		{ inputValue: "O", value: "Dentro de 3 días" },
		{ inputValue: "V", value: "Más de 3 días" },
	];

	const arrayCurrent = [
		{ inputValue: "P", value: "En proceso" },
		{ inputValue: "F", value: "Finalizados" },
	];

	const handleDelete = async () => {
		if (window.confirm(`¿Está seguro que desea eliminar todos los procedimientos filtrados?`)) {
			try {
				const { data } = await axios.delete(`/api/procedure`, {
					data: {
						filter,
					},
				});
				if (data.success) {
					alert("Procedimientos eliminados");
				} else {
					alert("Error al eliminar procedimientos");
				}
				onRefresh();
			} catch (e) {
				alert("Error al eliminar procedimientos");
			}
		}
	};

	return (
		<div
			className={{
				root: {
					flexGrow: 1,
				},
			}}
		>
			<Grid container spacing={3}>
				<Grid item xs={12}>
					<DialogTitle id="simple-dialog-title">Búsqueda avanzada</DialogTitle>
				</Grid>
				<Grid
					item
					xs={4}
					style={{
						display: "flex",
						flexDirection: "column",
						alignItems: "center",
					}}
				>
					<AutocompleteControl
						options={updToAutocomplete(arrayCurrent, "inputValue", "value")}
						defaultValue={defaultValueAutocomplete(arrayCurrent, "inputValue", "value", filter.ended)}
						cbChange={(value) => {
							if (value) {
								handleEnded(value.inputValue);
							}
						}}
						label={"Estado actual de Proceso"}
					/>
					<br />
					{userRole !== "VISITOR" && (
						<AutocompleteControl
							options={updToAutocomplete(users, "_id", "name")}
							defaultValue={defaultValueAutocomplete(users, "_id", "name", filter.user)}
							cbChange={(value) => {
								if (value) {
									handleUsers(value.inputValue);
								}
							}}
							label={"Usuario"}
						/>
					)}
					<br />
					<FormControl variant="outlined">
						<TextField
							style={{ width: 231 }}
							labelId="label-filter-sequence"
							id="demo-simple-select-outlined"
							label="Secuencia o ID de Trámite"
							value={filter.sequence}
							onChange={handleSequence}
						/>
					</FormControl>
					<br />
					<AutocompleteControl
						options={updToAutocomplete(arrayDues, "inputValue", "value")}
						defaultValue={defaultValueAutocomplete(arrayDues, "inputValue", "value", filter.due)}
						cbChange={(value) => {
							if (value) {
								handleDue(value.inputValue);
							}
						}}
						label={"Vencimiento de Proceso"}
					/>
					<br />
					<div className="filter-date">
						<MuiPickersUtilsProvider utils={DateFnsUtils}>
							<DatePicker
								labelId="label-filter-since"
								variant="inline"
								id="demo-simple-select-outlined"
								label="Creado después de"
								format="dd/MM/yyyy"
								value={filter.since}
								onChange={handleSince}
							/>
							<button onClick={() => handleSince("")}>Borrar</button>
						</MuiPickersUtilsProvider>
						<br />
						<MuiPickersUtilsProvider utils={DateFnsUtils}>
							<DatePicker
								labelId="label-filter-since"
								variant="inline"
								id="demo-simple-select-outlined"
								label="Última modificación después de"
								format="dd/MM/yyyy"
								value={filter.updated}
								onChange={handleUpdated}
							/>
							<button onClick={() => handleUpdated("")}>Borrar</button>
						</MuiPickersUtilsProvider>
					</div>
				</Grid>
				<Grid item xs={hasForm ? 4 : 8}>
					{bpmns.length > 0 && (
						<AutocompleteControl
							options={updToAutocomplete(bpmns, "_id", "_nameSchema")}
							defaultValue={defaultValueAutocomplete(bpmns, "_id", "_nameSchema", selected)}
							cbChange={(value) => {
								if (value) {
									handleBpmn(value.inputValue);
								}
							}}
							label={"Procesos"}
						/>
					)}
					<br />
					{selected !== "-" && steps.length > 0 ? (
						<AutocompleteControl
							options={updToAutocomplete(steps, "from", "name")}
							defaultValue={defaultValueAutocomplete(steps, "from", "name", filter.step)}
							cbChange={(value) => {
								if (value) {
									handleStep(value.inputValue);
								}
							}}
							label={"Pasos de Proceso"}
						/>
					) : null}
				</Grid>
				{hasForm && (
					<Grid item xs={4}>
						<FilterForm forms={forms} filter={filter} handleForm={handleForm} />
					</Grid>
				)}
				<Grid item xs={12}>
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
				</Grid>
			</Grid>
		</div>
	);
}
