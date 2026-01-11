import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { ListItem, Button, Dialog, DialogTitle, DialogContent, DialogActions } from '@material-ui/core';
import ExitToAppTwoToneIcon from '@material-ui/icons/ExitToAppTwoTone';

import axios from '../../utils/axios';
import { authSuccess, updateToken } from '../../reducers/auth';

import AutocompleteControl from '../../utils/AutocompleteControl';

export default function HeaderUserboxCompany({ companyId = '' }) {
	const dispatch = useDispatch();

	const [showModal, setShowModal] = useState(false);
	const [options, setOptions] = useState([]);
	const [company, setCompany] = useState(companyId);
	const [loading, setLoading] = useState(false);

	const handleButtonClick = async () => {
		try {
			const { data } = await axios.get('api/users/companies');
			setShowModal(true);
			if (companyId === '') setCompany(data[0]._id);
			setOptions(
				data.map((item) => {
					return { inputValue: item._id, _title: item.name };
				})
			);
		} catch (err) {
			console.error(err.response.data);
		}
	};
	const handleSubmit = async () => {
		try {
			setLoading(true);
			const { data } = await axios.post('api/updcompany', { company });
			setLoading(false);
			dispatch(
				authSuccess(
					data.token,
					data.email,
					data.name,
					data.surname,
					data.routes,
					data._id,
					data.company,
					data.companyData,
					data.role,
					data.admin
				)
			);
			dispatch(updateToken(data.token));
			localStorage.removeItem("proc_list");
			window.location.reload();
		} catch (err) {
			setLoading(false);
			console.error(err.response.data);
		}
	};

	const defaultValueAutocomplete = (values, valForm) => {
		try {
			if (valForm === '-') return { inputValue: '-', value: 'Todos' };
			return values.filter((e) => e.inputValue === valForm)[0];
		} catch (error) {
			return { inputValue: '-', value: 'Todos' };
		}
	};

	return (
		<div>
			<ListItem button onClick={handleButtonClick}>
				<div className="mr-2">
					<ExitToAppTwoToneIcon />
				</div>
				<span>Cambiar de empresa</span>
			</ListItem>
			<Dialog open={showModal} onClose={() => setShowModal(false)} fullWidth maxWidth="xs">
				<DialogTitle>Selecciona una empresa:</DialogTitle>
				<DialogContent>
					{options.length > 0 ? (
						<AutocompleteControl
							options={options}
							defaultValue={defaultValueAutocomplete(options, company)}
							cbChange={(value) => {
								if (value) {
									setCompany(value.inputValue);
								}
							}}
							label={'Empresas'}
						/>
					) : (
						<span>Cargando...</span>
					)}
				</DialogContent>
				<DialogActions>
					{!loading ? <Button onClick={handleSubmit}>Cambiar de empresa</Button> : <span>Cargando...</span>}
					<Button onClick={() => setShowModal(false)}>Cerrar</Button>
				</DialogActions>
			</Dialog>
		</div>
	);
}
