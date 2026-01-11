import React, { useState, useEffect } from "react";
import { TextField, MenuItem, Button, Dialog, DialogContent } from "@material-ui/core";
import Autocomplete from "@material-ui/lab/Autocomplete";
import DialogActions from "@material-ui/core/DialogActions";
import Edit from "@material-ui/icons/Edit";

import IconButton from "@material-ui/core/IconButton";

export default function PropertiesFieldSelector({ formsData, value, onChange, taskId, nameField, modeler }) {
	const tags = formsData.tags;
	const [dialog, setDialog] = useState(false);
	const [tagValue, setTagsValue] = useState([]);
	const [form, setForm] = useState(false);
	const [field, setField] = useState(false);
	const [showall, setShowall] = useState("1");

	useEffect(() => {
		setForm(false);
	}, [tagValue]);
	useEffect(() => {
		setField(false);
	}, [form]);

	const handleDialog = () => {
		setDialog(true);
	};
	const handleClose = () => {
		setDialog(false);
	};
	const handleForm = (e) => {
		setForm(e.target.value);
	};
	const handleField = (e) => {
		setField(e.target.value);
	};
	const handleSubmit = () => {
		if (!field) {
			return alert("Debe seleccionar un campo");
		}
		onChange({ target: { name: nameField, value: field } }, taskId);
		setDialog(false);
	};

	let filteredForms = formsData.forms.filter((item) => {
		if (tagValue.length > 0) {
			let contains = false;
			item.tags.forEach((it) => {
				if (tagValue.includes(it)) contains = true;
			});
			return contains;
		}
		return true;
	});
	if (showall === "0") {
		const approvedForms = [];
		modeler._definitions.rootElements[1].flowElements.forEach((it) => {
			if (it.functions === "form") {
				approvedForms.push(it.form);
			}
		});
		filteredForms = filteredForms.filter((item) => {
			return approvedForms.includes(item._id);
		});
	}
	const properties = [];
	if (form) {
		const formSelected = formsData.forms.find((it) => it._id === form);
		formSelected._properties.forEach((it) => properties.push(it));
	}

	return (
		<div>
			<span
				style={{
					width: "max-content",
					whiteSpace: "nowrap",
					overflow: "auto",
					display: "block",
				}}
			>
				<IconButton size="small" onClick={handleDialog}>
					<Edit fontSize="inherit" />
				</IconButton>
				{value}
			</span>

			<Dialog
				classes={{ paper: "modal-content" }}
				fullWidth
				maxWidth="md"
				open={dialog}
				onClose={handleClose}
				aria-labelledby="form-dialog-title2"
			>
				<DialogContent className="p-0">
					<div>
						<div className="bg-secondary border-0">
							<div className="card-body px-lg-5 py-lg-5">
								<TextField
									fullWidth
									select
									label="Mostrar todos los formularios"
									helperText=""
									variant="outlined"
									value={showall}
									onChange={(value) => setShowall(value.target.value)}
								>
									<MenuItem value="1">Mostrar todos los formularios</MenuItem>
									<MenuItem value="0">Solamente los ya elegidos</MenuItem>
								</TextField>
								<br />
								<Autocomplete
									multiple
									id="tags-standard"
									options={tags}
									value={tagValue}
									onChange={(event, newValue) => setTagsValue(newValue)}
									renderInput={(params) => {
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
								<br />
								<TextField
									fullWidth
									select
									label="Formulario origen"
									helperText=""
									variant="outlined"
									value={form}
									onChange={handleForm}
								>
									{filteredForms.map((option) => (
										<MenuItem key={option._id} value={option._id}>
											{option._title}
										</MenuItem>
									))}
								</TextField>
								<br />
								<br />
								<TextField
									fullWidth
									select
									label="Campo a evaluar"
									value={field}
									onChange={handleField}
									helperText=""
									variant="outlined"
								>
									{properties.map((option) => (
										<MenuItem key={option} value={option}>
											{option}
										</MenuItem>
									))}
								</TextField>
							</div>
						</div>
					</div>
				</DialogContent>

				<DialogActions>
					<Button onClick={handleSubmit} color="primary">
						Seleccionar campo
					</Button>
					<Button onClick={handleClose} color="primary">
						Cancelar
					</Button>
				</DialogActions>
			</Dialog>
		</div>
	);
}
