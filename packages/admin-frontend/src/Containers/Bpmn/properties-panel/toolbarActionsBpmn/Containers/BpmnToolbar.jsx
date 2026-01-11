import React from "react";
import NameTask from "../Components/NameTask";
import StepsTaks from "../Components/StepsTaks";
import AssignFunctionality from "../Components/AssignFunctionality";
import FormAndHtml from "../Components/FormAndHtml";
import NumberSignatures from "../Components/NumberSignatures";
import Email from "../Components/Email";
import Charge from "../Components/Charge";
import InsertSite from "../Components/InsertSite";
import Doc from "../Components/Doc";
import PossibiltyBack from "../Components/PossibiltyBack";
import IsNotificable from "../Components/IsNotificable";
import DeadLine from "../Components/DeadLine";
import SignatureType from "../Components/SignatureType";
import DownloadName from "../Components/DownloadName";
import allActionsTask from "./allActionsTask";

export default function BpmnToolbar(props) {
	const {
		handleChange,
		updatePropertie,
		valueLocal,
		listStages,
		htmls,
		form,
		emails,
		docs,
		users,
		element,
		defaultValueAutocomplete,
		handleChangeAutocomplete,
		updateName,
	} = props;

	return (
		<div style={{ display: "flex", flexWrap: "wrap" }}>
			<NameTask element={element} updateName={updateName} />

			{listStages.length !== 0 && (
				<StepsTaks
					handleChange={handleChange}
					updatePropertie={updatePropertie}
					valueLocal={valueLocal}
					listStages={listStages}
				/>
			)}

			{
				<AssignFunctionality
					handleChange={handleChange}
					updatePropertie={updatePropertie}
					valueLocal={valueLocal}
					allActionsTask={allActionsTask}
				/>
			}

			{valueLocal.currentAction === "form" && (
				<FormAndHtml
					htmls={htmls}
					//form={form.forms}
					form={form}
					defaultValueAutocomplete={defaultValueAutocomplete}
					valueLocal={valueLocal}
					handleChangeAutocomplete={handleChangeAutocomplete}
					updatePropertie={updatePropertie}
					handleChange={handleChange}
				/>
			)}

			{valueLocal.currentAction === "request_signature" && (
				<NumberSignatures
					handleChange={handleChange}
					updatePropertie={updatePropertie}
					valueLocal={valueLocal}
				/>
			)}

			{valueLocal.currentAction === "email" && (
				<Email
					valueLocal={valueLocal}
					handleChange={handleChange}
					updatePropertie={updatePropertie}
					emails={emails}
				/>
			)}

			{valueLocal.currentAction === "doc" && (
				<Doc
					defaultValueAutocomplete={defaultValueAutocomplete}
					valueLocal={valueLocal}
					handleChangeAutocomplete={handleChangeAutocomplete}
					handleChange={handleChange}
					updatePropertie={updatePropertie}
					docs={docs}
				/>
			)}

			{valueLocal.currentAction === "insert_site" && (
				<InsertSite handleChange={handleChange} updatePropertie={updatePropertie} valueLocal={valueLocal} />
			)}

			{valueLocal.currentAction === "charge" && (
				<Charge valueLocal={valueLocal} handleChange={handleChange} updatePropertie={updatePropertie} />
			)}

			{valueLocal.currentAction === "advanced_signature" && (
				<SignatureType
					valueLocal={valueLocal}
					handleChange={handleChange}
					updatePropertie={updatePropertie}
					users={users}
					element={element}
				/>
			)}

			{valueLocal.currentAction === "advanced_signature" ||
			valueLocal.currentAction === "signature" ||
			valueLocal.currentAction === "request_signature" ? (
				<DownloadName
					valueLocal={valueLocal}
					handleChange={handleChange}
					updatePropertie={updatePropertie}
					users={users}
					element={element}
				/>
			) : null}

			<PossibiltyBack element={element} handleChange={handleChange} updatePropertie={updatePropertie} />

			<IsNotificable element={element} handleChange={handleChange} updatePropertie={updatePropertie} />

			<DeadLine valueLocal={valueLocal} handleChange={handleChange} updatePropertie={updatePropertie} />
		</div>
	);
}
