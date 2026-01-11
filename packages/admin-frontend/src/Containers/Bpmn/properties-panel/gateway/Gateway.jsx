import React, { useEffect } from "react";

import { Button, TextField, MenuItem, Table, CardContent, FormControlLabel, Switch } from "@material-ui/core";

import PropertiesFieldSelector from "../PropertiesFieldSelector";
import useDebounce from "../../../../hooks/useDebounce";

function GatewayRow({ task, keyRow, valueLocal, handleChange, updatePropertieGateWay, form, modeler }) {
	const debouncedValue = useDebounce(valueLocal.valueOptionsIfs[keyRow].businessObject.$attrs.expected_result, 500);
	const optionalRows = valueLocal.valueOptionsIfs[keyRow].businessObject.$attrs.optionals
		? JSON.parse(valueLocal.valueOptionsIfs[keyRow].businessObject.$attrs.optionals)
		: [];
	const defaultClause = valueLocal.valueOptionsIfs[keyRow].businessObject.$attrs.default_clause
		? // eslint-disable-next-line no-eval
		  eval(valueLocal.valueOptionsIfs[keyRow].businessObject.$attrs.default_clause)
		: false;

	const handleAddOption = () => {
		const newOptionals = JSON.stringify([
			...optionalRows,
			{
				condition: "y",
				field_to_evaluate: "",
				rule_compare: "equal",
				expected_result: "",
			},
		]);
		handleChange({
			target: {
				value: newOptionals,
				name: `valueOptionsIfs[${keyRow}].optionals`,
			},
		});
		updatePropertieGateWay(newOptionals, "optionals", task.id);
	};
	const handleDeleteOption = (keyOption) => () => {
		const newOptionals = JSON.stringify([...optionalRows.filter((item, i) => i !== keyOption)]);
		handleChange({
			target: {
				value: newOptionals,
				name: `valueOptionsIfs[${keyRow}].optionals`,
			},
		});
		updatePropertieGateWay(newOptionals, "optionals", task.id);
	};
	const handleModifyRow = (keyOption, field, value) => {
		const newOptionals = JSON.stringify([
			...optionalRows.map((it, iN) => {
				if (iN === keyOption) {
					it[field] = value;
				}
				return it;
			}),
		]);
		handleChange({
			target: {
				value: newOptionals,
				name: `valueOptionsIfs[${keyRow}].optionals`,
			},
		});
		updatePropertieGateWay(newOptionals, "optionals", task.id);
	};
	const handleDefault = (e) => {
		const value = e.target.checked;
		handleChange({
			target: {
				value: value,
				name: `valueOptionsIfs[${keyRow}].default_clause`,
			},
		});
		updatePropertieGateWay(value, "default_clause", task.id);
	};
	useEffect(() => {
		if (valueLocal.valueOptionsIfs[keyRow].businessObject.$attrs.expected_result) {
			const strWithoutSpaces = debouncedValue.trim();
			if (strWithoutSpaces !== valueLocal.valueOptionsIfs[keyRow].businessObject.$attrs.expected_result) {
				handleChange({
					target: { value: strWithoutSpaces },
				});
				updatePropertieGateWay(strWithoutSpaces, "expected_result", task.id);
			}
		}
		// eslint-disable-next-line
	}, [debouncedValue]);

	if (defaultClause) {
		return (
			<tr>
				<td className="font-size-lg font-weight-bold text-center ">
					<span>{task.businessObject.name}</span>
				</td>
				<td colSpan={3}></td>
				<td>
					<FormControlLabel
						control={<Switch checked={defaultClause} onChange={handleDefault} name="checkedA" />}
						label="Por defecto"
					/>
				</td>
			</tr>
		);
	}
	return (
		<>
			<tr>
				<td className="font-size-lg font-weight-bold text-center ">
					{" "}
					<span>{task.businessObject.name}</span>{" "}
				</td>
				<td>
					{/*<TextField
					fullWidth
					id={'standard-select-' + task.id}
					name={`valueOptionsIfs[${keyRow}].field_to_evaluate`}
					select
					label="Campo a evaluar"
					value={
						valueLocal.valueOptionsIfs[keyRow].businessObject
							.$attrs.field_to_evaluate
							? valueLocal.valueOptionsIfs[keyRow].businessObject
								.$attrs.field_to_evaluate
							: ''
					}
					onChange={(e) => {
						handleChange(e);
						updatePropertieGateWay(
							e.target.value,
							'field_to_evaluate',
							task.id
						);
					}}
					helperText=""
					variant="outlined"
				>
					{form.properties.map((option) => (
						<MenuItem keyRow={option} value={option}>
							{option}
						</MenuItem>
					))}
				</TextField>*/}
					<PropertiesFieldSelector
						modeler={modeler}
						formsData={form}
						value={
							valueLocal.valueOptionsIfs[keyRow].businessObject.$attrs.field_to_evaluate
								? valueLocal.valueOptionsIfs[keyRow].businessObject.$attrs.field_to_evaluate
								: ""
						}
						taskId={task.id}
						nameField={`valueOptionsIfs[${keyRow}].field_to_evaluate`}
						onChange={(e, taskId) => {
							handleChange(e);
							updatePropertieGateWay(e.target.value, "field_to_evaluate", taskId);
						}}
					/>
				</td>

				<td className="font-size-lg font-weight-bold text-center ">
					{/*<span>es igual a</span>*/}
					<TextField
						fullWidth
						id={"standard-select-" + task.id}
						name={`valueOptionsIfs[${keyRow}].rule_compare`}
						select
						label="Condición para evaluar"
						value={
							valueLocal.valueOptionsIfs[keyRow].businessObject.$attrs.rule_compare
								? valueLocal.valueOptionsIfs[keyRow].businessObject.$attrs.rule_compare
								: "equal"
						}
						onChange={(e) => {
							handleChange(e);
							updatePropertieGateWay(e.target.value, "rule_compare", task.id);
						}}
						helperText=""
						variant="outlined"
					>
						<MenuItem value="equal">Es igual</MenuItem>
						<MenuItem value="nequal">No es igual</MenuItem>
						<MenuItem value="less">Es menor</MenuItem>
						<MenuItem value="lequal">Es menor igual</MenuItem>
						<MenuItem value="greater">Es mayor</MenuItem>
						<MenuItem value="gequal">Es mayor igual</MenuItem>
					</TextField>
				</td>

				<td>
					<TextField
						style={{ width: "100%" }}
						className="m-2"
						name={`valueOptionsIfs[${keyRow}].expected_result`}
						id="outlined-multiline-flexible"
						label="Valor esperado"
						multiline
						rowsMax="4"
						variant="outlined"
						value={
							valueLocal.valueOptionsIfs[keyRow].businessObject.$attrs.expected_result
								? valueLocal.valueOptionsIfs[keyRow].businessObject.$attrs.expected_result
								: ""
						}
						onChange={(e) => {
							handleChange(e);
							updatePropertieGateWay(e.target.value, "expected_result", task.id);
						}}
					/>{" "}
				</td>
				<td>
					{optionalRows.length === 0 && (
						<Button
							onClick={handleAddOption}
							style={{ left: "12px" }}
							variant="contained"
							className="m-2 btn-primary"
						>
							Añadir validación extra
						</Button>
					)}
					<FormControlLabel
						control={<Switch checked={defaultClause} onChange={handleDefault} name="checkedA" />}
						label="Por defecto"
					/>
				</td>
			</tr>
			{optionalRows.length > 0 &&
				optionalRows.map((optional, index) => {
					const isLastRow = index + 1 === optionalRows.length;
					return (
						<tr key={index}>
							<td style={{ textAlign: "center" }}>
								<TextField
									style={{ width: 100 }}
									id={"standard-select-" + task.id}
									name={`condition`}
									select
									label="Condición adicional"
									value={optional.condition}
									onChange={(e) => {
										handleModifyRow(index, "condition", e.target.value);
									}}
									helperText=""
									variant="outlined"
								>
									<MenuItem value="y">Y</MenuItem>
									<MenuItem value="o">O</MenuItem>
								</TextField>
							</td>
							<td>
								<PropertiesFieldSelector
									modeler={modeler}
									formsData={form}
									value={optional.field_to_evaluate}
									taskId={task.id}
									nameField={`field_to_evaluate`}
									onChange={(e) => {
										handleModifyRow(index, "field_to_evaluate", e.target.value);
									}}
								/>
							</td>
							<td className="font-size-lg font-weight-bold text-center ">
								<TextField
									fullWidth
									id={"standard-select-" + task.id}
									name={`rule_compare`}
									select
									label="Condición para evaluar"
									value={optional.rule_compare}
									onChange={(e) => {
										handleModifyRow(index, "rule_compare", e.target.value);
									}}
									helperText=""
									variant="outlined"
								>
									<MenuItem value="equal">Es igual</MenuItem>
									<MenuItem value="nequal">No es igual</MenuItem>
									<MenuItem value="less">Es menor</MenuItem>
									<MenuItem value="lequal">Es menor igual</MenuItem>
									<MenuItem value="greater">Es mayor</MenuItem>
									<MenuItem value="gequal">Es mayor igual</MenuItem>
								</TextField>
							</td>

							<td>
								<TextField
									style={{ width: "100%" }}
									className="m-2"
									name={`expected_result`}
									id="outlined-multiline-flexible"
									label="Valor esperado"
									multiline
									rowsMax="4"
									variant="outlined"
									value={optional.expected_result}
									onChange={(e) => {
										handleModifyRow(index, "expected_result", e.target.value);
									}}
								/>{" "}
							</td>
							<td style={{ width: 0 }}>
								{isLastRow && (
									<Button
										onClick={handleAddOption}
										style={{ left: "12px" }}
										variant="contained"
										className="m-2 btn-primary"
									>
										Añadir otra
									</Button>
								)}
								<Button
									onClick={handleDeleteOption(index)}
									style={{ left: "12px" }}
									variant="contained"
									className="m-2 btn-danger"
								>
									Eliminar
								</Button>
							</td>
						</tr>
					);
				})}
		</>
	);
}

export default function Gateway(props) {
	const { valueLocal, handleChange, updatePropertieGateWay, form } = props;

	return (
		<>
			<fieldset style={{ display: "flex" }}>
				<legend className="font-size-lg font-weight-bold">Condiciones</legend>

				<p> Defina la regla que se debe cumplir para cada camino.</p>
			</fieldset>

			<CardContent className="pt-3 px-4 pb-4">
				<Table className="table table-alternate-spaced ">
					<thead>
						<tr>
							<th scope="col" className="text-center">
								Definición
							</th>
							<th scope="col" className="text-center" style={{ width: "34%" }}>
								Campo a evaluar
							</th>
							<th scope="col" className="text-center" style={{ width: 193 }}>
								Condición lógica
							</th>
							<th scope="col" className="text-center" style={{ width: "24%" }}>
								Valor esperado{" "}
							</th>
							<th>-</th>
						</tr>
					</thead>
					<tbody>
						{valueLocal.valueOptionsIfs &&
							valueLocal.valueOptionsIfs.map((task, key) => {
								return (
									<GatewayRow
										key={key}
										keyRow={key}
										task={task}
										valueLocal={valueLocal}
										form={form}
										handleChange={handleChange}
										updatePropertieGateWay={updatePropertieGateWay}
										modeler={props.modeler}
									/>
								);
							})}
					</tbody>
				</Table>
			</CardContent>
		</>
	);
}
