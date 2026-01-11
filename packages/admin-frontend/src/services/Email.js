import API from "./url-base";
import axios from "../utils/axios";

const get_email = () =>
    new Promise((resolve, reject) => {
        axios
            .get("api/email/all")
            .then((data) => {
                resolve(data.data);
            })
            .catch(reject);
    });

const get_email_id = (id) =>
    new Promise((resolve, reject) => {
        fetch(API + "email/" + id)
            .then((response) => response.json())
            .then((data) => {
                resolve(data);
            })
            .catch(reject);
    });

const post_email = (data) =>
    new Promise((resolve, reject) => {
        axios
            .post("/api/email", { ...data })
            .then((data) => {
                resolve(data);
            })
            .catch(reject);
    });

const put_email = (data, id) =>
    new Promise((resolve, reject) => {
        const requestOptions = {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ ...data }),
        };
        fetch(API + "email/" + id, requestOptions)
            .then((response) => response.json())
            .then((data) => {
                resolve({ data });
            })
            .catch(reject);
    });

const put_file_email = (file, id) =>
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
        fetch(API + "email/" + id, requestOptions)
            .then((response) => response.json())
            .then((data) => {
                resolve({ data });
            })
            .catch(reject);
    });

const delete_email = (id) =>
    new Promise((resolve, reject) => {
        const requestOptions = {
            method: "DELETE",
            headers: { "Content-Type": "application/json" },
        };
        fetch(API + "email/" + id, requestOptions)
            .then((response) => response)
            .then((data) => {
                resolve({ data });
            })
            .catch(reject);
    });

export { put_file_email, get_email, post_email, get_email_id, put_email, delete_email };
