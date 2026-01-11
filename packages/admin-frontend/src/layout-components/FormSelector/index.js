import React, { useState } from "react";
import { TextField, Button, Dialog, DialogContent } from "@material-ui/core";
import Autocomplete from "@material-ui/lab/Autocomplete";
import DialogActions from "@material-ui/core/DialogActions";
import MaterialTable from "material-table";

import { LocationTable } from "../../utils/LocationTable";

export default function FormSelector({ formsData, value, onChange }) {
	const { forms, tags } = formsData;
	const [dialog, setDialog] = useState(false);
	const [tagValue, setTagsValue] = useState([]);

	const handleDialog = () => {
		setDialog(true);
	};
	const handleClose = () => {
		setDialog(false);
	};
	const handleSubmit = (form) => {
		onChange(form._id);
		setDialog(false);
	};
	const handleSubmitClean = () => {
		onChange(null);
		setDialog(false);
	};

	const filteredForms = forms.filter((item) => {
		if (tagValue.length > 0) {
			let contains = false;
			item.tags.forEach((it) => {
				if (tagValue.includes(it)) contains = true;
			});
			return contains;
		}
		return true;
	});

	const columns = [
		{ title: "Nombre", field: "_title" },
		{ title: "Descripción", field: "tags" },
	];

	return (
		<div>
			<span
				style={{
					width: "200px",
					whiteSpace: "nowrap",
					overflow: "hidden",
					textOverflow: "ellipsis",
					display: "block",
				}}
			>
				<kbd>{value ? value._title : ""}</kbd>
			</span>
			<Button onClick={handleDialog} variant="contained">
				<span>Modificar</span>
			</Button>
			<Dialog
				classes={{ paper: "modal-content" }}
				fullWidth
				maxWidth="lg"
				open={dialog}
				onClose={handleClose}
				aria-labelledby="form-dialog-title2"
			>
				<DialogContent className="p-0">
					<div>
						<div className="bg-secondary border-0">
							<div className="card-body px-lg-5 py-lg-5">
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
								<MaterialTable
									localization={LocationTable}
									title="Selecciona el formulario a usar"
									columns={columns}
									data={filteredForms}
									options={{
										actionsColumnIndex: -1,
										pageSize: 10,
										pageSizeOptions: [10, 20, 30],
										initialPage: 0,
										padding: "dense",
										sorting: false,
									}}
									actions={[
										{
											icon: "save",
											tooltip: "Seleccionar",
											onClick: (event, rowData) => handleSubmit(rowData),
										},
									]}
								/>
							</div>
						</div>
					</div>
				</DialogContent>

				<DialogActions>
					<Button onClick={handleSubmitClean} color="primary">
						Eliminar selección
					</Button>
					<Button onClick={handleClose} color="primary">
						Cancelar
					</Button>
				</DialogActions>
			</Dialog>
		</div>
	);
}
