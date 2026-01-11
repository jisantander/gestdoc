//import axios from '../utils/axios';
import API from './url-base';

const get_form_id = (id) =>
	new Promise((resolve, reject) => {
		fetch(API + 'form/' + id)
			.then((response) => response.json())
			.then((data) => {
				console.log('data', data);
				resolve(data);
			})
			.catch(reject);
	});

const put_string_json = (_stringJson, _stringUiJson, _properties, tags, id) =>
	new Promise((resolve, reject) => {
		const requestOptions = {
			method: 'PUT',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify({ _stringJson, _stringUiJson, _properties, tags }),
		};

		fetch(API + 'form/' + id, requestOptions)
			.then((response) => response.json())
			.then((data) => {
				console.log('from', data);
				resolve({ data });
			})
			.catch(reject);
	});

export { get_form_id, put_string_json };
