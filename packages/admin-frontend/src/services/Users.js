import moment from 'moment';

import axios from '../utils/axios';
import API from './url-base';

const get_users = () =>
	new Promise((resolve, reject) => {
		fetch(API + 'users')
			.then((response) => response.json())
			.then((data) => {
				console.log('data users get', data);
				resolve(data);
			})
			.catch(reject);
	});

const get_users_id = (id) =>
	new Promise((resolve, reject) => {
		fetch(API + 'users/' + id)
			.then((response) => response.json())
			.then((data) => {
				console.log('data', data);
				resolve(data);
			})
			.catch(reject);
	});

const post_users = (data) =>
	new Promise((resolve, reject) => {
		axios
			.post('api/users', data)
			.then(({ data: newData }) => {
				resolve({
					data: {
						...newData,
						createdAt: moment(newData.createdAt).format('DD/MM/YYYY HH:mm'),
					},
				});
			})
			.catch(reject);
	});

const put_users = (data, id) =>
	new Promise((resolve, reject) => {
		axios
			.put(`api/users/${id}`, data)
			.then(() => {
				resolve({ data });
			})
			.catch(reject);
	});

const delete_users = (id) =>
	new Promise((resolve, reject) => {
		axios
			.delete(`api/users/${id}`)
			.then((data) => {
				resolve({ data });
			})
			.catch(reject);
	});

export { get_users, post_users, get_users_id, put_users, delete_users };
