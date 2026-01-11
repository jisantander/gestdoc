import API from "./url-base";
import axios from "../utils/axios";

const get_bpmn = () =>
	new Promise((resolve, reject) => {
		fetch(API + "bpmn/all")
			.then((response) => response.json())
			.then((data) => {
				console.log("data bpmn", data);
				resolve({ bpmn: data });
			})
			.catch(reject);
	});

const get_bpmn_id = (id) =>
	new Promise((resolve, reject) => {
		fetch(API + "bpmn/" + id)
			.then((response) => response.json())
			.then((data) => {
				resolve(data);
			})
			.catch(reject);
	});

const post_bpmn = (data) =>
	new Promise((resolve, reject) => {
		axios
			.post("api/bpmn", {
				_bpmnModeler: data._bpmnModeler,
				_nameSchema: data._nameSchema,
				download: data.download,
			})
			.then((data) => {
				resolve({ bpmn: data.data });
			})
			.catch(reject);
	});

const put_bpmn = (data, id) =>
	new Promise((resolve, reject) => {
		const requestOptions = {
			method: "PUT",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify({ ...data, force: true }),
		};
		fetch(API + "bpmn/" + id, requestOptions)
			.then((response) => response.json())
			.then((data) => {
				resolve({ bpmn: data });
			})
			.catch(reject);
	});

const delete_bpmn = (id) =>
	new Promise((resolve, reject) => {
		const requestOptions = {
			method: "DELETE",
			headers: { "Content-Type": "application/json" },
		};
		fetch(API + "bpmn/" + id, requestOptions)
			.then((response) => response)
			.then((data) => {
				resolve({ data });
			})
			.catch(reject);
	});

const quick_bpmn = (id) => 
	new Promise((resolve, reject) => {
		axios
			.post("api/bpmn/quick", {
				id: id,
			})
			.then((data) => {
				resolve({ ...data.data });
			})
			.catch(reject);
	});

export { get_bpmn, post_bpmn, get_bpmn_id, put_bpmn, delete_bpmn, quick_bpmn };
