import React, { useState, useEffect } from 'react';
import { useHistory, useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { Grid } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import Form from '@rjsf/material-ui'; //Form basado en Json

import { signin } from '../../reducers/auth';
import axios from '../../utils/axios';

import { Loading } from '../../utils/Loading';
import useDidMountEffect from 'hooks/useDidMountEffect';
import { RecoverInputs, RecoverUi } from '../../utils/SchemasJson'; //Form basado en Json
import Background from '../../assets/images/login/background.png';
import Logo from '../../assets/images/login/logo-white.png';

//pasar al menu

const useStyles = makeStyles((theme) => ({
	root: {
		flexGrow: 1,
	},
	paper: {
		padding: theme.spacing(2),
		textAlign: 'center',
		color: theme.palette.text.secondary,
	},
}));

const ResetPassword = () => {
	const history = useHistory();
	const { token } = useParams();
	const dispatch = useDispatch();
	//debugger;
	const loading = useSelector(({ auth }) => auth.loading);
	const isAuth = useSelector(({ auth }) => !!auth.token);
	const [verify, setVerify] = useState(true);
	const [email, setEmail] = useState('');
	const [sending, setSending] = useState(false);
	const [error, setError] = useState(false);

	const onSubmit = async ({ formData }, e) => {
		if (formData.password !== formData.password2) {
			return alert('Las contraseñas deben coincidir');
		}
		try {
			setSending(true);
			await axios.post(`api/password-reset/${token}`, {
				password: formData.password,
			});
			setSending(false);
			dispatch(signin({ email, password: formData.password }));
		} catch (e) {
			console.error(e);
			setError('Error al reestablecer contraseña');
		}
	};

	useDidMountEffect(() => {
		//debugger;
		if (isAuth) {
			history.push('/Procedure');
		}
		// eslint-disable-next-line
	}, [isAuth]);
	useEffect(() => {
		const verifyToken = async () => {
			try {
				setSending(true);
				const { data } = await axios.get(`api/password-reset/${token}`);
				setEmail(data.email);
				setVerify(false);
				setSending(false);
			} catch (e) {
				setError('Token inválido');
				setVerify(false);
			}
		};
		verifyToken();
		// eslint-disable-next-line
	}, []);

	const classes = useStyles();

	let content = <Loading />;
	if (!loading) {
		content = (
			<Form schema={RecoverInputs} uiSchema={RecoverUi} onSubmit={onSubmit} />
		);
	}
	if (sending) {
		content = <Loading />;
	}
	if (verify) content = <Loading />;
	if (error) content = <h3>Token expirado</h3>;

	return (
		<div className={classes.root}>
			<Grid
				container
				alignItems="center"
				justify="center"
				style={{ minHeight: '100vh', backgroundColor: '#070c58' }}
			>
				<Grid
					item
					md={7}
					alignItems="stretch"
					style={{
						backgroundImage: `url(${Background})`,
						height: '100vh',
						width: '100%',
						backgroundRepeat: 'round',
					}}
				></Grid>

				<Grid
					item
					md={5}
					justify="center"
					alignItems="center"
					className="all-white"
				>
					<img src={Logo} className="logo-login" alt="gestdoc-logo" />
					{content}
				</Grid>
			</Grid>
		</div>
	);
};
export default ResetPassword;
