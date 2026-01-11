import React, { useState, useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import {
	Grid,
	Button,
	Dialog,
	TextField,
	FormControl,
} from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import Form from '@rjsf/material-ui'; //Form basado en Json

import { signin, authGoogle } from '../../reducers/auth';
import axios from '../../utils/axios';

import { Loading } from '../../utils/Loading';
import { LoginInputs, LoginUi } from '../../utils/SchemasJson'; //Form basado en Json
import GoogleLogin from 'react-google-login';
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

const Login = () => {
	const history = useHistory();
	const dispatch = useDispatch();
	//debugger;
	const loading = useSelector(({ auth }) => auth.loading);

	const isAuth = useSelector(({ auth }) => !!auth.token);

	const [email, setEmail] = useState('');
	const [show, setShow] = useState(false);
	const [sending, setSending] = useState(false);

	const onSubmit = ({ formData }, e) => {
		dispatch(signin(formData));
	};

	const responseGoogle = async (response) => {
		if (response.profileObj) {
			dispatch(authGoogle(response));
			//esperar el response.
			// dispatch(setDocEmail(response.profileObj.email));
			//createTransaction(response.profileObj.email);
		}
	};

	const handleRemember = () => {
		setShow(true);
	};

	const handleRememberPost = async () => {
		try {
			setSending(true);
			await axios.post('api/password-reset', { email });
			setSending(false);
			alert('Se ha enviado un correo de recuperación!');
			setShow(false);
		} catch (e) {
			alert(e.response.data.message);
		}
	};

	const handleClose = () => {
		setShow(false);
	};

	useEffect(() => {
		//debugger;
		if (isAuth) {
			history.push('/Procedure');
		}
		// eslint-disable-next-line
	}, [isAuth]);

	const classes = useStyles();

	let content = <Loading />;
	if (!loading) {
		content = (
			<Form schema={LoginInputs} uiSchema={LoginUi} onSubmit={onSubmit} />
		);
	}

	return (
		<div className={classes.root}>
			<Dialog maxWidth="lg" onClose={handleClose} open={show}>
				<div className="text-center p-5">
					{sending ? (
						<Loading />
					) : (
						<>
							<FormControl variant="outlined">
								<TextField
									labelId="label-filter-sequence"
									id="demo-simple-select-outlined"
									label="Correo electrónico"
									value={email}
									onChange={(e) => setEmail(e.target.value)}
								/>
							</FormControl>
							<hr />
							<Button
								className="btn-primary btn-pill mx-1"
								onClick={handleRememberPost}
							>
								<span className="btn-wrapper--label">
									Solicitar recuperación
								</span>
							</Button>
						</>
					)}
				</div>
			</Dialog>
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
					<GoogleLogin
						clientId="780265444499-oi0sa86lg23lsr1kqf43qmuqbh6sog0k.apps.googleusercontent.com"
						buttonText="Identificarme con mi correo de Google"
						onSuccess={responseGoogle}
						onFailure={responseGoogle}
						cookiePolicy={'single_host_origin'}
					/>
					<br />
					<span
						onClick={handleRemember}
						style={{ cursor: 'pointer', color: '#fff' }}
					>
						Recordar contraseña
					</span>
				</Grid>
			</Grid>
		</div>
	);
};
export default Login;
