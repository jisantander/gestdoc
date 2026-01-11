import API from "./url-base";
import axios from "../utils/axios";

const get_docs = () =>
    new Promise((resolve, reject) => {
        axios
            .get("api/docs/all")
            .then((data) => {
                resolve(data.data);
            })
            .catch(reject);
    });

const get_docs_id = (id) =>
    new Promise((resolve, reject) => {
        fetch(API + "docs/" + id)
            .then((response) => response.json())
            .then((data) => {
                resolve(data);
            })
            .catch(reject);
    });

const post_docs = (data) =>
    new Promise((resolve, reject) => {
        axios
            .post("/api/docs", { ...data })
            .then((response) => {
                resolve(response);
            })
            .catch(reject);
    });

const put_docs = (data, id) =>
    new Promise((resolve, reject) => {
        const requestOptions = {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ ...data }),
        };
        fetch(API + "docs/" + id, requestOptions)
            .then((response) => response.json())
            .then((data) => {
                resolve({ data });
            })
            .catch(reject);
    });

const put_file_docs = (file, id) =>
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
        fetch(API + "docs/" + id, requestOptions)
            .then((response) => response.json())
            .then((data) => {
                resolve({ data });
            })
            .catch(reject);
    });

const delete_docs = (id) =>
    new Promise((resolve, reject) => {
        const requestOptions = {
            method: "DELETE",
            headers: { "Content-Type": "application/json" },
        };
        fetch(API + "docs/" + id, requestOptions)
            .then((response) => response)
            .then((data) => {
                resolve({ data });
            })
            .catch(reject);
    });

const get_document = (id) =>
    new Promise((resolve, reject) => {
        fetch(API + "docs/doc/" + id)
            .then((response) => response)
            .then((data) => {
                console.log("data", data);
                resolve(data);
            })
            .catch(reject);
    });

export { put_file_docs, get_docs, post_docs, get_docs_id, put_docs, delete_docs, get_document };
