import React from "react";
import { useState, useEffect, useRef } from "react";
import Modeler from "bpmn-js/lib/Modeler";
import customModdleExtension from "./moddle/custom.json";
import SnackBar from "../../utils/SnackBar";
import { useDispatch } from "react-redux";
import { setSidebarName } from "../../reducers/ThemeOptions";
import { put_bpmn, get_bpmn_id } from "../../services/Bpmn";
import { get_all_form } from "../../services/Form";
import { get_docs } from "../../services/Docs";
import { get_email } from "../../services/Email";
import { get_html } from "../../services/Html";

import axios from "../../utils/axios";

/* eslint import/no-webpack-loader-syntax: off */
import raw from "raw.macro";

import PropertiesView from "./properties-panel/PropertiesView";

import { Grid } from "@material-ui/core";
import { Card, CardContent } from "@material-ui/core";
import { Button } from "@material-ui/core";

import { useRouteMatch } from "react-router-dom";

const getModeler = (modelerContainer, document) => {
	const modeler = new Modeler({
		container: modelerContainer,
		moddleExtensions: {
			custom: customModdleExtension,
		},
		keyboard: {
			bindTo: document.body,
		},
	});

	return modeler;
};

const Bpmn = () => {
	const match = useRouteMatch();
	const dispatch = useDispatch();
	const markdown = raw("./diagram.bpmn");
	const modeler = useRef();
	const [flag, setData] = useState(false);

	useEffect(() => {
		get_bpmn_id(match.params.id)
			.then((dataBpmn) => {
				dispatch(setSidebarName(["Proceso: " + dataBpmn._nameSchema, "fas", "sitemap"]));
				if (dataBpmn._bpmnModeler) {
					modeler.current.importXML(dataBpmn._bpmnModeler);
				} else {
					modeler.current.importXML(markdown);
				}
				setData(true);
			})
			.catch(() => console.log("Failed connection with API"));
		// eslint-disable-next-line
	}, [markdown, match.params.id, modeler]);

	const [form, setForm] = useState();
	const [docs, setDocs] = useState();
	const [emails, setEmails] = useState();
	const [htmls, setHtmls] = useState();
	const [users, setUsers] = useState();
	const [snackBar, setSnackBar] = useState(null);

	useEffect(() => {
		const $modelerContainer = document.querySelector("#modeler-container");
		modeler.current = getModeler($modelerContainer, document);

		get_all_form()
			.then((data) => {
				setForm(data);
			})
			.catch(() => console.log("Faild Connection"));

		get_docs()
			.then((data) => {
				setDocs(data);
			})
			.catch(() => console.log("Faild Connection"));

		get_email()
			.then((data) => {
				setEmails(data);
			})
			.catch(() => console.log("Faild Connection"));

		get_html()
			.then((data) => {
				setHtmls(data);
			})
			.catch(() => console.log("Faild Connection"));
		axios.get("api/users/all").then(({ data }) => {
			setUsers(data);
		});
		// eslint-disable-next-line
	}, []);

	function handleClick(e) {
		e.preventDefault();
		modeler.current.saveXML({ format: true }, function (err, xml) {
			const data2 = {
				_bpmnModeler: xml,
			};
			saveBpmn(data2);
		});
	}

	const saveBpmn = (data2, force = false) => {
		put_bpmn({ ...data2, force }, match.params.id)
			.then((data3) => {
				if (data3.bpmn) {
					if (data3.bpmn.error) {
						if (typeof data3.bpmn.message === "string") {
							if (
								window.confirm(
									data3.bpmn.message +
										" ¿Desea guardar el procedimiento a pesar de que hay documentos en proceso? Hay riesgo algunos se vuelvan inconsistentes."
								)
							) {
								saveBpmn(data2, true);
							} else {
								setSnackBar(
									<SnackBar key={new Date()} typeStyle="toastr-danger" msg={data3.bpmn.message} />
								);
							}
							return false;
						}
						if (data3.bpmn.error.length > 0) {
							return setSnackBar(
								<SnackBar
									key={new Date()}
									typeStyle="toastr-danger"
									msg={data3.bpmn.error.join("  ")}
								/>
							);
						}
					}
				}
				setSnackBar(<SnackBar key={new Date()} typeStyle="toastr-success" msg="Se han guardado los cambios" />);
			})
			.catch((error) => {
				if (error?.response?.data?.message) {
					return setSnackBar(
						<SnackBar key={new Date()} typeStyle="toastr-danger" msg={error.response.data.message} />
					);
				}
				setSnackBar(
					<SnackBar
						key={new Date()}
						typeStyle="toastr-danger"
						msg="No hemos podido guardar los cambios, por favor contactar a soporte"
					/>
				);
				console.log("Failed connection with API", error);
			});
	};

	return (
		<>
			<div className="modeler-parent">
				<div id="modeler-container"></div>

				<Grid id="properties-container" mt={6} container spacing={6}>
					<Grid item md={12}>
						<Card className="card-box overflow-visible mb-spacing-6-x2">
							<CardContent>
								{flag === false ? (
									<h1>cargando...</h1>
								) : (
									<PropertiesView
										modeler={modeler.current}
										form={form}
										docs={docs}
										emails={emails}
										htmls={htmls}
										users={users}
									/>
								)}
							</CardContent>
						</Card>
					</Grid>
				</Grid>
			</div>
			<Button style={{ left: "12px" }} onClick={handleClick} variant="contained" className="m-2 btn-primary">
				Guardar
			</Button>
			{snackBar}
		</>
	);
};

export default Bpmn;
