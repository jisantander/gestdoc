import API from './url-base';
import axios from '../utils/axios';

const get_all_form = () =>
	new Promise((resolve, reject) => {
		axios
			.get('api/form/all')
			.then((data) => {
				var properties = [];
				const tags = [];
				for (let i = 0; i < data.data.length; i++) {
					properties.push(...data.data[i]._properties);
					if (data.data[i].tags.length > 0) {
						data.data[i].tags.forEach((it) => tags.push(it));
					}
				}
				resolve({ forms: data.data, properties, tags: [...new Set(tags)] });
			})
			.catch(reject);
	});

const post_form = (data) =>
	new Promise((resolve, reject) => {
		if (data._stringJson === undefined) data._stringJson = '';
		axios
			//.post('/api/form', { ...data, _stringJson: '' })
			.post('/api/form', { ...data })
			.then((data) => {
				debugger;
				resolve({ form: data.data });
			})
			.catch(reject);
	});

const put_form = (data, id) =>
	new Promise((resolve, reject) => {
		const requestOptions = {
			method: 'PUT',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify({ ...data }),
		};
		fetch(API + 'form/' + id, requestOptions)
			.then((response) => response.json())
			.then((data) => {
				resolve({ forms: data });
			})
			.catch(reject);
	});

const delete_bpmn = (id) =>
	new Promise((resolve, reject) => {
		const requestOptions = {
			method: 'DELETE',
			headers: { 'Content-Type': 'application/json' },
		};
		fetch(API + 'form/' + id, requestOptions)
			.then((response) => response)
			.then((data) => {
				resolve({ data });
			})
			.catch(reject);
	});

export { get_all_form, post_form, put_form, delete_bpmn };
