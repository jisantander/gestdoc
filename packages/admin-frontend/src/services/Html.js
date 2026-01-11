import API from "./url-base";
import axios from "../utils/axios";

/*
const get_html = () =>
	new Promise((resolve, reject) => {
		fetch(API + 'html/all')
			.then((response) => response.json())
			.then((data) => {
				console.log('data html get', data);
				resolve(data);
			})
			.catch(reject);
	});
	*/

const get_html = () =>
    new Promise((resolve, reject) => {
        axios
            .get(API + "html/all")
            .then((response) => {
                resolve(response.data);
            })
            .catch(reject);
    });

const get_html_id = (id) =>
    new Promise((resolve, reject) => {
        fetch(API + "html/" + id)
            .then((response) => response.json())
            .then((data) => {
                resolve(data);
            })
            .catch(reject);
    });

const post_html = (data) =>
    new Promise((resolve, reject) => {
        axios
            .post("/api/html", { ...data })
            .then((data) => {
                resolve(data);
            })
            .catch(reject);
    });

const put_html = (data, id) =>
    new Promise((resolve, reject) => {
        const requestOptions = {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ ...data }),
        };
        fetch(API + "html/" + id, requestOptions)
            .then((response) => response.json())
            .then((data) => {
                resolve({ data });
            })
            .catch(reject);
    });

const put_file_html = (file, id) =>
    new Promise((resolve, reject) => {
        var formdata = new FormData();
        formdata.append("file", file);

        //)  formdata.append('profileImage', file, file.name);

        console.log("data", formdata);
        console.log("file", file);
        console.log("files", file.files);

        console.log("boundary:", formdata._boundary);

        const requestOptions = {
            method: "PUT",
            body: formdata,
            headers: {
                accept: "application/json",
                "Accept-Language": "en-US,en;q=0.8",
            },
        };
        fetch(API + "html/" + id, requestOptions)
            .then((response) => response.json())
            .then((data) => {
                resolve({ data });
            })
            .catch(reject);
    });

const delete_html = (id) =>
    new Promise((resolve, reject) => {
        const requestOptions = {
            method: "DELETE",
            headers: { "Content-Type": "application/json" },
        };
        fetch(API + "html/" + id, requestOptions)
            .then((response) => response)
            .then((data) => {
                resolve({ data });
            })
            .catch(reject);
    });

export { put_file_html, get_html, post_html, get_html_id, put_html, delete_html };
