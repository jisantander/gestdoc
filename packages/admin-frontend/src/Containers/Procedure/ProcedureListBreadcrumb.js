import React from "react";
import Chip from "@material-ui/core/Chip";

export default function ProcedureListBreadcrumb({ filter, bpmns, steps, forms, changeFilter }) {
	const handleClose = (filterType) => () => {
		changeFilter(filterType);
	};
	const handleCloseForm = (formId) => () => {
		changeFilter("form", formId);
	};

	let cont = 0;
	let contentDue = null;
	let contentBpmn = null;
	let contentSequence = null;
	let contentSince = null;
	let contentUpdated = null;
	let contentStep = null;
	let contentForm = null;
	if (filter.ended !== "-") {
		if (filter.ended === "P")
			contentDue = <Chip color="secondary" label={`Estado: En proceso`} onDelete={handleClose("ended")} />;
		if (filter.ended === "F")
			contentDue = <Chip color="default" label={`Estado: Finalizado`} onDelete={handleClose("ended")} />;
		cont++;
	}
	if (filter.bpmn !== "-") {
		if (bpmns.length > 0) {
			const currentBpmn = bpmns.find((it) => it._id === filter.bpmn);
			contentBpmn = (
				<Chip
					color="default"
					label={`Procedimiento: ${currentBpmn._nameSchema || ''}`}
					onDelete={handleClose("bpmn")}
				/>
			);
			cont++;
		}
	}
	if (filter.step !== "-") {
		if (steps.length > 0) {
			const currentStep = steps.find((it) => it.from === filter.step);
			contentStep = <Chip color="default" label={`Paso: ${currentStep.name}`} onDelete={handleClose("step")} />;
			cont++;
		}
	}
	if (filter.due !== "-") {
		if (filter.due === "R")
			contentDue = <Chip color="secondary" label={`Vencimiento: Menos 1 día`} onDelete={handleClose("due")} />;
		if (filter.due === "O")
			contentDue = <Chip color="default" label={`Vencimiento: Dentro de 3 días`} onDelete={handleClose("due")} />;
		if (filter.due === "V")
			contentDue = <Chip color="default" label={`Vencimiento: Más de 3 días`} onDelete={handleClose("due")} />;
		cont++;
	}
	if (filter.sequence !== "") {
		contentSequence = (
			<Chip
				color="secondary"
				label={`ID de procedimiento: ${filter.sequence}`}
				onDelete={handleClose("sequence")}
			/>
		);
		cont++;
	}
	if (filter.since !== "" && filter.since !== undefined) {
		contentSince = (
			<Chip color="secondary" label={`Creado desde: ${filter.since}`} onDelete={handleClose("since")} />
		);
		cont++;
	}
	if (filter.updated !== "" && filter.updated !== undefined) {
		contentUpdated = (
			<Chip color="secondary" label={`Modificado desde: ${filter.updated}`} onDelete={handleClose("updated")} />
		);
		cont++;
	}
	if (filter.form.length > 0) {
		const valuesForm = [];
		forms.forEach((form) => {
			const { properties } = JSON.parse(form._stringJson);
			const propertiesArray = Object.values(properties);
			propertiesArray.forEach((it) => valuesForm.push({ form: form._title, ...it }));
		});
		contentForm = filter.form.map((it) => {
			const itemForm = valuesForm.find((itf) => itf.id === it[0]);
			const labelForm = itemForm ? itemForm.title : it[0];
			const titleForm = itemForm ? itemForm.form : "Form";
			return (
				<Chip
					color="secondary"
					label={`[${titleForm}] ${labelForm}: ${it[1]}`}
					onDelete={handleCloseForm(it[0])}
				/>
			);
		});
		cont++;
	}
	if (cont === 0) return null;
	return (
		<div style={{ padding: "10px" }}>
			{contentBpmn}
			{contentStep}
			{contentDue}
			{contentSequence}
			{contentSince}
			{contentUpdated}
			{contentForm}
		</div>
	);
}
