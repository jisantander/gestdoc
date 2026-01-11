import React, { useState, useEffect } from 'react';
import { Grid, Card } from '@material-ui/core';
import { useHistory, useParams } from 'react-router-dom';
import { useSelector } from 'react-redux';

import axios from '../../utils/axios';
import { Loading } from '../../utils/Loading';

export default function InterfaceDetails() {
	const history = useHistory();
	const { id: interfaceId } = useParams();
	const company = useSelector(({ auth }) => auth.company);
	const [type, setType] = useState('ODOO');
	const [title, setTitle] = useState('');
	const [data, setData] = useState({});
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		const getInterface = async () => {
			try {
				const { data } = await axios.get(`api/interface/${interfaceId}`);
				setType(data.type);
				setTitle(data.title);
				setData(JSON.parse(data.authJson));
				setLoading(false);
			} catch (e) {
				console.error(e);
			}
		};
		if (interfaceId !== 'new') getInterface();
		else setLoading(false);
		// eslint-disable-next-line
	}, []);

	const handleType = (e) => {
		setType(e.target.value);
	};
	const handleTitle = (e) => {
		setTitle(e.target.value);
	};
	const handleChange = (e) => {
		setData({ ...data, [e.target.name]: e.target.value });
	};
	const handleSubmit = async (e) => {
		try {
			e.preventDefault();
			setLoading(true);
			const interfaceData = {
				type,
				title,
				authJson: JSON.stringify(data),
			};
			if (company) {
				interfaceData.company = company;
			}
			if (interfaceId === 'new') {
				await axios.post(`api/interface`, interfaceData);
			} else {
				await axios.put(`api/interface/${interfaceId}`, interfaceData);
			}
			setLoading(false);
			history.push('/Interface');
		} catch (e) {
			console.error(e);
			setLoading(false);
			alert('Hubo un error al guardar, intente de nuevo');
		}
	};

	return (
		<Grid container spacing={4}>
			<Grid item>
				<Card className="p-4 mb-4">
					{loading ? (
						<Loading />
					) : (
						<form onSubmit={handleSubmit}>
							<h3>Interface de conexión</h3>
							<select value={type} onChange={handleType}>
								<option value="ODOO">ODOO</option>
							</select>
							<div className="form-group">
								<label>Descripción de la conexión</label>
								<input
									type="text"
									className="form-control"
									name="title"
									value={title}
									onChange={handleTitle}
								/>
							</div>
							{type === 'ODOO' && (
								<div>
									<div className="form-group">
										<label>Usuario</label>
										<input
											type="text"
											className="form-control"
											name="username"
											value={data.username}
											onChange={handleChange}
										/>
									</div>
									<div className="form-group">
										<label>Contraseña</label>
										<input
											type="password"
											className="form-control"
											name="password"
											value={data.password}
											onChange={handleChange}
										/>
									</div>
									<div className="form-group">
										<label>URL</label>
										<input
											type="text"
											className="form-control"
											name="url"
											value={data.url}
											onChange={handleChange}
										/>
									</div>
									<div className="form-group">
										<label>Base de datos</label>
										<input
											type="text"
											className="form-control"
											name="database"
											value={data.database}
											onChange={handleChange}
										/>
									</div>
									<div className="form-group">
										<label>Puerto de conexión</label>
										<input
											type="text"
											className="form-control"
											name="port"
											value={data.port}
											onChange={handleChange}
										/>
									</div>
								</div>
							)}
							<button className="btn btn-primary">Guardar</button>
						</form>
					)}
				</Card>
			</Grid>
		</Grid>
	);
}
