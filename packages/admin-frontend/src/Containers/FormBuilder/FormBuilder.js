import React, { useState, useEffect } from 'react';
import { useRouteMatch } from 'react-router-dom';
import Snackbar from '@material-ui/core/Snackbar';
import { Loading } from '../../utils/Loading';
import FileWidget from './widgets/FileWidget';
import ValidInput from './widgets/ValidInput';
import FormBuilderSchema from 'react-jsonschema-form-builder';
import Autocomplete from '@material-ui/lab/Autocomplete';
import { useDispatch } from 'react-redux';
import { TextField } from '@material-ui/core';

import axios from '../../utils/axios';
import '../../assets/stage.css';
import { get_form_id, put_string_json } from '../../services/FormBuilder';
import { setSidebarName } from '../../reducers/ThemeOptions';
import newField from './newField.json';
import WidgetAdress from './widgets/WidgetAdress';
import './style.css';

const FormBuilder = () => {
	const match = useRouteMatch();
	const [form, setForm] = useState({
		form: {},
	});
	const [tags, setTags] = useState(false);
	const [tagValue, setTagsValue] = useState([]);

	const dispatch = useDispatch();
	const [state, setState] = useState({
		open: false,
		vertical: 'top',
		horizontal: 'center',
		toastrStyle: '',
		message: 'This is a toastr/snackbar notification!',
	});
	const { vertical, horizontal, open, toastrStyle, message } = state;

	const handleClose = () => {
		setState({ ...state, open: false });
	};
	const getJsonSchema = (jsonSchema) => {
		var obj = jsonSchema.jsonSchema; // JSON.parse(jsonSchema);
		if (obj.required?.length > 0) {
			obj.required = [...new Set(obj.required)];
		}
		var properties = [];
		try {
			for (const key in obj.properties) {
				properties.push(key);
			}
		} catch (error) {}
		var _stringJson = JSON.stringify(jsonSchema.jsonSchema);
		var _stringUiJson = JSON.stringify(jsonSchema.uiSchema);
		const newTags = tagValue.map((item) => item.name.toUpperCase());
		put_string_json(
			_stringJson,
			_stringUiJson,
			properties,
			newTags,
			match.params.id
		)
			.then((data) =>
				setState({
					...state,
					open: true,
					toastrStyle: 'toastr-success',
					message: 'Formulario Guardado',
				})
			)
			.catch((e) => console.log('Failed connection with API', e));
	};
	const getTagsAll = async () => {
		try {
			const { data } = await axios.get('api/form/tags');
			setTags(data);
		} catch (e) {
			console.error(e);
		}
	};

	useEffect(() => {
		if (!match.params.id) return;
		debugger;
		get_form_id(match.params.id)
			.then((data) => {
				let headerTitle = data._title ? data._title : data._alias;
				dispatch(
					setSidebarName(['Formulario - ' + headerTitle, 'fab', 'wpforms'])
				);
				if (data._stringJson === '') {
					debugger;
					data._stringJson = JSON.parse(`{
						"title":"${data._title ? data._title : data._alias}",
						"description":"${data._description ? data._description : ''}",
						"type":"object",
						"properties":{}
					}`);
				} else {
					data._stringJson = JSON.parse(data._stringJson);
					data._stringJson.title = data._title ? data._title : data._alias;
					data._stringJson.description = data._description
						? data._description
						: '';
				}

				if (typeof data._stringUiJson == 'undefined') {
					data._stringUiJson = '';
				}

				if (data._stringUiJson === '') {
					data._stringUiJson = {};
				} else {
					data._stringUiJson = JSON.parse(data._stringUiJson);
				}

				data.prefix = data._alias?.toLowerCase().replace(/ /g, '_') + '_';
				setForm(data);
				if (data.tags.length > 0) {
					setTagsValue(data.tags.map((it) => ({ name: it })));
				}
			})
			.catch((e) => console.log('Failed connection with API', e));
		getTagsAll();
		// eslint-disable-next-line
	}, [match.params]);

	const handleNewField = (newProp, formData, prefix) => {
		let beforeObject = newProp.uiSchema[formData.id];
		if (formData.fieldType === 'address') {
			newProp.jsonSchema.type = 'string';
			newProp.uiSchema[formData.id] = {
				...beforeObject,
				...{ 'ui:widget': 'WidgetAdress' },
			};
		} else if (formData.fieldType === 'multipleChoicesList') {
			newProp.jsonSchema.type = 'array';
			newProp.jsonSchema.items = {
				type: 'string',
				enum: formData.options,
			};
			newProp.jsonSchema.uniqueItems = true;

			newProp.uiSchema[formData.id] = {
				...beforeObject,
				...{ 'ui:widget': 'checkboxes' },
			};
		} else if (formData.fieldType === 'ValidInput') {
			newProp.jsonSchema.type = 'string';
			newProp.jsonSchema.validar = formData.options;

			newProp.uiSchema[formData.id] = {
				...beforeObject,
				...{ 'ui:widget': 'ValidInput' },
			};
		} else if (formData.fieldType === 'TxtSelect') {
			newProp.jsonSchema.type = 'string';
			newProp.jsonSchema.enum = formData.optionsTxtArea
				.split(',')
				.map((item) => item.trim());
			let beforeObject = newProp.uiSchema[formData.id];
			newProp.uiSchema[formData.id] = {
				...beforeObject,
				...{ 'ui:widget': 'select' },
			};
		}
		return newProp;
	};
	const handleKeyDown = (event) => {
		switch (event.key) {
			case 'Enter': {
				event.preventDefault();
				event.stopPropagation();
				if (event.target.value.length > 0) {
					setTags([...tags, { name: event.target.value }]);
					setTagsValue([...tagValue, { name: event.target.value }]);
				}
				break;
			}
			default:
		}
	};

	//cambiar
	const modalSchemaUi = {
		optionsTxtArea: { 'ui:widget': 'textarea' },
	};

	return form._stringJson == null ? (
		<Loading />
	) : (
		<div>
			{tags && (
				<Autocomplete
					multiple
					id="tags-standard"
					options={tags}
					getOptionLabel={(option) => option.name}
					value={tagValue}
					onChange={(event, newValue) => setTagsValue(newValue)}
					renderInput={(params) => {
						params.inputProps.onKeyDown = handleKeyDown;
						return (
							<TextField
								{...params}
								variant="standard"
								label="Categorías"
								placeholder="Ingrese categorías relevantes"
							/>
						);
					}}
				/>
			)}
			<FormBuilderSchema
				getJsonSchemaForm={getJsonSchema}
				rootSchema={form._stringJson}
				rootSchemaUi={form._stringUiJson}
				prefix={form.prefix}
				customWidgets={{ FileWidget, WidgetAdress, ValidInput }}
				newPropJsonSchema={handleNewField}
				newFields={newField}
				modalSchemaUi={modalSchemaUi}
			/>

			<Snackbar
				anchorOrigin={{ vertical, horizontal }}
				open={open}
				classes={{ root: toastrStyle }}
				onClose={handleClose}
				message={message}
			/>
		</div>
	);
};
export default FormBuilder;
