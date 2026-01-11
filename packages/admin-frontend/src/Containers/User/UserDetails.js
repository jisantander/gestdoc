import React, { useState, useEffect } from 'react';
import { Grid, Card } from '@material-ui/core';
import Form from '@rjsf/material-ui';
import { useHistory, useParams } from 'react-router-dom';
import { useSelector } from 'react-redux';

import axios from '../../utils/axios';
import { getIdRoutes, getNameRoutes } from '../../utils/permissions';
import { UserInputs, UserUi } from '../../utils/SchemasJson';
import { Loading } from '../../utils/Loading';

export default function UserDetails() {
	const history = useHistory();
	const { id: userId } = useParams();
	const {admin,company} = useSelector(({ auth }) => auth);
	const [defaultData, setData] = useState({});
	const [loading, setLoading] = useState(true);
	const [companies, setCompanies] = useState([]);

	useEffect(() => {
		const getCompanies = async () => {
			try {
				const { data } = await axios.get(`api/company/all`);
				setCompanies(data);
			} catch (e) {
				console.error(e);
			}
			const getUser = async () => {
				try {
					const { data } = await axios.get(`api/users/${userId}`);
					data.routes = getNameRoutes(data.routes);
					setData(data);
					setLoading(false);
				} catch (e) {
					console.error(e);
				}
			};
			if (userId !== 'new') getUser();
			else setLoading(false);
		};
		getCompanies();
		// eslint-disable-next-line
	}, []);

	const handleSubmit = async ({ formData }, e) => {
		try {
			const userData = {
				...formData,
				routes: getIdRoutes(formData.routes),
				role: 'ROLE_ADMIN',
			};
			if (!admin) {
				userData.company = company;
			}
			if (userId === 'new') {
				await axios.post(`api/users`, userData);
			} else {
				delete userData.password;
				await axios.put(`api/users/${userId}`, userData);
			}
			history.push('/UserList');
		} catch (e) {
			console.error(e);
		}
	};

	const UserInputsJson = UserInputs(companies);
	if (userId === 'new') {
		UserInputsJson.properties.password = {
			type: 'string',
			title: 'Contraseña',
		};
		UserInputsJson.required.push('password');
		UserUi.password = {
			'ui:widget': 'password',
		};
	}
	if (!admin) {
		delete UserInputsJson.properties.admin;
		delete UserInputsJson.properties.company;
	}

	return (
		<Grid container spacing={4}>
			<Grid item>
				<Card className="p-4 mb-4">
					{loading ? (
						<Loading />
					) : (
						<Form
							schema={UserInputsJson}
							uiSchema={UserUi}
							formData={defaultData}
							onSubmit={handleSubmit}
						/>
					)}
				</Card>
			</Grid>
		</Grid>
	);
}
