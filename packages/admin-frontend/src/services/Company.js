import moment from 'moment';

import axios from '../utils/axios';

import API from './url-base';

const get_company = () =>
	new Promise((resolve, reject) => {
		fetch(API + 'company')
			.then((response) => response.json())
			.then((data) => {
				console.log('data company get', data);
				resolve(data);
			})
			.catch(reject);
	});

const get_company_id = (id) =>
	new Promise((resolve, reject) => {
		fetch(API + 'company/' + id)
			.then((response) => response.json())
			.then((data) => {
				console.log('data', data);
				resolve(data);
			})
			.catch(reject);
	});

const post_company = (data) =>
	new Promise((resolve, reject) => {
		axios
			.post('api/company', data)
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

const put_company = (data, id) =>
	new Promise((resolve, reject) => {
		axios
			.put(`api/company/${id}`, data)
			.then(() => {
				resolve({ data });
			})
			.catch(reject);
	});

const delete_company = (id) =>
	new Promise((resolve, reject) => {
		axios
			.delete(`api/company/${id}`)
			.then((data) => {
				resolve({ data });
			})
			.catch(reject);
	});

export {
	get_company,
	post_company,
	get_company_id,
	put_company,
	delete_company,
};
