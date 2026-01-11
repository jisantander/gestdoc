import React, { useRef, useState } from 'react';
import { get_html_id, put_html } from '../../services/Html';
import Save from '@material-ui/icons/Save';
import EmailEditor from 'react-email-editor';
import { useRouteMatch } from 'react-router-dom';
import Snackbar from '@material-ui/core/Snackbar';
import { useDispatch } from 'react-redux';
import { setSidebarName } from '../../reducers/ThemeOptions';
import { Grid, Card } from '@material-ui/core';
import OptionsForm from './optionsForms';

const Email = () => {
	const match = useRouteMatch();
	const emailEditorRef = useRef(null);
	const dispatch = useDispatch();
	//snack Toas
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
	//fin snackj Toast

	const exportHtml = () => {
		/**
		 * servicio de post con 
			   _body: req.body._body,
			  _template: req.body._template,
		 */
		emailEditorRef.current.editor.exportHtml((data) => {
			const { design, html: originalHtml } = data;

			let html = originalHtml.replace(/&nbsp;/g, '');
			//html = originalHtml.replace(/&deg;/g, '');

			const obj = {
				_body: html,
				_template: design,
			};
			put_html(obj, match.params.id)
				.then((data) =>
					setState({
						...state,
						open: true,
						toastrStyle: 'toastr-success',
						message: 'Correo Guardado',
					})
				)
				.catch(() => console.log('Failed connection with API'));
			console.log('exportHtml', html);
		});
	};

	const onLoad = () => {
		get_html_id(match.params.id)
			.then((data) => {
				dispatch(
					setSidebarName([
						'Plantilla Html - ' + data._title,
						'far',
						'file-code',
					])
				);
				const templateJson = data._template;
				emailEditorRef.current.editor.loadDesign(templateJson);
			})
			.catch(() => console.log('Failed connection with API'));
		// you can load your template here;
		// const templateJson = {};
		// emailEditorRef.current.editor.loadDesign(templateJson);
	};

	return (
		<>
			<Grid container spacing={4}>
				<Grid item xs={12} lg={12}>
					<Card className="p-2 mb-2">
						<div className="d-flex align-items-center justify-content-center flex-wrap">
							<button
								onClick={exportHtml}
								className="m-1  btn-input-select white"
							>
								<div className="d-30 d-flex align-items-center justify-content-center rounded-pill bg-secondary text-primary">
									<Save className="d-50" />
								</div>
								<div className="p-2 font-weight-bold text-primary opacity-6 mt-12">
									Guardar
								</div>
							</button>
						</div>
					</Card>
				</Grid>
			</Grid>

			<EmailEditor ref={emailEditorRef} onLoad={onLoad} />

			<Snackbar
				anchorOrigin={{ vertical, horizontal }}
				open={open}
				classes={{ root: toastrStyle }}
				onClose={handleClose}
				message={message}
			/>

			<Grid className="mt-4" container direction="row" spacing={1}>
				<Grid item xs>
					<OptionsForm system={'esta plantilla de HTML'} />
				</Grid>
			</Grid>
		</>
	);
};

export default Email;
