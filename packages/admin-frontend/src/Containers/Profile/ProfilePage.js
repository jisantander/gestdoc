import React, { useState, useEffect } from 'react';
import { Card, CardContent, Grid, Button, Dialog } from '@material-ui/core';
import Form from '@rjsf/material-ui';
import { useSelector, useDispatch } from 'react-redux';

import axios from '../../utils/axios';
import { ProfileInputs, ResetInputs, ResetUi } from '../../utils/SchemasJson';
import { Loading } from '../../utils/Loading';
import { setSidebarName } from '../../reducers/ThemeOptions';

import imageOperation from '../../images/laborales.svg';

export default function UserProfile() {
	const dispatch = useDispatch();

	const [loading, setLoading] = useState(false);
	const [defaultData, setData] = useState({});
	const [dialog, setDialog] = useState(false);
	const userId = useSelector(({ auth }) => auth.userId);

	useEffect(() => {
		const getUser = async () => {
			try {
				setLoading(true);
				const {
					data: { name, surname, email },
				} = await axios.get(`api/users/${userId}`);
				setData({ name, surname, email });
				setLoading(false);
			} catch (e) {
				console.error(e);
			}
		};
		getUser();
		dispatch(setSidebarName(['Mi Perfil', imageOperation]));
		// eslint-disable-next-line
	}, []);

	const handleSubmit = async ({ formData }, e) => {
		try {
			setLoading(true);
			const userData = { ...formData };
			await axios.post(`api/profile`, userData);
			setData(userData);
			setLoading(false);
		} catch (e) {
			console.error(e);
		}
	};
	const handleOpen = () => {
		setDialog(true);
	};
	const handleClose = () => {
		setDialog(false);
	};
	const handleReset = async ({ formData }, e) => {
		try {
			setLoading(true);
			const userData = { ...formData };
			await axios.post(`api/password_upd`, userData);
			setData(userData);
			setLoading(false);
			setDialog(false);
			alert('Contraseña actualizada con éxito');
		} catch (e) {
			if (e.response) {
				console.error(e.response);
			} else {
				console.error(e);
			}
			setLoading(false);
			if (e.response.data.message) {
				return alert(e.response.data.message);
			}
			alert('Hubo un error al actualizar la contraseña');
		}
	};

	return (
		<div>
			<Grid container spacing={3}>
				<Grid item xs={12} sm={12} md={4}>
					<Card className="p-4 mb-4">
						<CardContent style={{ textAlign: 'center' }}>
							<div class="rounded">
								<img
									src="data:image/jpeg;base64,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"
									alt="..."
								/>
							</div>
							<Button
								onClick={handleOpen}
								className="MuiButtonBase-root MuiButton-root MuiButton-text btn-neutral-primary MuiButton-textSizeSmall MuiButton-sizeSmall"
							>
								Modificar Contraseña
							</Button>
						</CardContent>
					</Card>
				</Grid>
				<Grid item xs={12} sm={12} md={8}>
					<Card className="p-4 mb-4">
						{loading ? (
							<Loading />
						) : (
							<Form
								schema={ProfileInputs}
								formData={defaultData}
								onSubmit={handleSubmit}
							/>
						)}
					</Card>
				</Grid>
			</Grid>
			<Dialog
				onClose={handleClose}
				aria-labelledby="simple-dialog-title"
				open={dialog}
				classes={{ paper: 'modal-content rounded-lg' }}
			>
				<Card className="p-4 mb-4">
					{loading ? (
						<Loading />
					) : (
						<Form
							schema={ResetInputs}
							uiSchema={ResetUi}
							onSubmit={handleReset}
						/>
					)}
				</Card>
			</Dialog>
		</div>
	);
}
