import React, { useState, useEffect } from 'react';
import { Card, MenuItem, Divider } from '@material-ui/core';
import { Fab, InputAdornment, TextField } from '@material-ui/core';
import Alert from '@material-ui/lab/Alert';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import Grid from '@material-ui/core/Grid';
import { CopyToClipboard } from 'react-copy-to-clipboard';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';
import './optionsForm.css';

import AutocompleteControl from '../../utils/AutocompleteControl';
import axios from '../../utils/axios';
import useDidMountEffect from '../../hooks/useDidMountEffect';

export default function ShareOptionsForm({ system }) {
	const [bpmn, setBpmn] = useState('');
	const [bpmns, setBpmns] = useState([{ inputValue: '', _title: 'Todos' }]);
	const [listForm, setListForm] = useState({ forms: [] });
	const [currentForm, setCurrentForm] = useState(null);
	const [listProperties, setListProperties] = useState([]);
	const [copyClip, setCopyClip] = useState('');

	const handleChange = (event) => {
		var formSelected = listForm.forms.filter((item) => {
			return item._title === event.target.value;
		});
		setListProperties(formSelected[0]._properties);
		setCurrentForm(event.target.value);
	};

	const handleBpmn = (value) => {
		setListForm({ forms: [] });
		setCurrentForm(null);
		setListProperties([]);
		setBpmn(value);
	};

	useEffect(() => {
		const loadData = async () => {
			try {
				const { data: bpmnData } = await axios.get('api/bpmn/all');
				setBpmns(bpmnData);
				setBpmn(bpmnData[0]._id);
			} catch (e) {
				console.error(e);
				alert('Hubo un error al obtener la información.');
			}
		};
		loadData();
	}, []);
	useDidMountEffect(() => {
		const loadForms = async () => {
			try {
				const {
					data: [formData],
				} = await axios.post(`api/bpmn/steps/${bpmn}`);
				setListForm({ forms: formData.forms });
			} catch (e) {
				console.error(e);
				alert('Hubo un error al obtener los formularios.');
			}
		};
		loadForms();
	}, [bpmn]);

	const defaultValueAutocomplete = (values, id, name, valForm) => {
		try {
			if (valForm === '-') return { inputValue: '', value: 'Todos' };
			return values
				.filter((e) => e._id === valForm)
				.map((item) => {
					return { inputValue: item[id], _title: item[name] };
				})[0];
		} catch (error) {
			return { inputValue: '', value: 'Todos' };
		}
	};

	const updToAutocomplete = (arrayData, id, name) => {
		return [
			{ inputValue: '', _title: 'Todos' },
			...arrayData.map((item) => {
				return { inputValue: item[id], _title: item[name] };
			}),
		];
	};

	if (listForm == null) {
		return <></>;
	}

	return listForm == null ? (
		<></>
	) : (
		<>
			<Card className="p-4 mb-4">
				<div className="font-size-lg font-weight-bold">
					Campos de los formularios
				</div>
				<p className="text-black-50 mb-0">
					Seleccione un campo para luego pegarlo en {system}, luego el sistema
					remplazará el campo del formulario por el valor ingresado por el
					usuario.
				</p>
				<Divider className="my-4" />
				<div className="p-3">
					{bpmns.length > 1 && (
						<AutocompleteControl
							options={updToAutocomplete(bpmns, '_id', '_nameSchema')}
							defaultValue={defaultValueAutocomplete(
								bpmns,
								'_id',
								'_nameSchema',
								bpmn
							)}
							cbChange={(value) => {
								if (value) {
									handleBpmn(value.inputValue);
								}
							}}
							label={'Procesos'}
						/>
					)}
					{listForm.forms.length === 0 ? (
						''
					) : (
						<TextField
							className="m-2"
							id="standard-select-form"
							name="stage"
							select
							label="Formularios"
							value={currentForm}
							onChange={(e) => {
								handleChange(e);
							}}
							helperText="Revise los campos de los formularios"
							variant="outlined"
						>
							{listForm.forms.map((option) => (
								<MenuItem key={option._id} value={option._title}>
									{option._title}
								</MenuItem>
							))}
						</TextField>
					)}
					<Grid>
						<div className={'insideTable'}>
							{listProperties.length === 0 ? (
								''
							) : (
								<TableContainer component={Paper}>
									<Table aria-label="simple table">
										<TableHead>
											<TableRow>
												<TableCell>ID</TableCell>
												<TableCell align="left">Imprimir</TableCell>
												<TableCell align="left">Si existe</TableCell>
												<TableCell align="left">Si No existe</TableCell>
												<TableCell align="left">SI == N</TableCell>
											</TableRow>
										</TableHead>
										<TableBody>
											{listProperties.map((text) => (
												<TableRow key={text}>
													<TableCell align="left"> {text} </TableCell>
													<TableCell align="left">
														<TextField
															style={{ top: '9px' }}
															disabled
															variant="outlined"
															value={'{{fn  ' + text + '}}'}
															fullWidth
															InputProps={{
																endAdornment: (
																	<InputAdornment position="end">
																		<CopyToClipboard
																			text={'{{fn  ' + text + '}}'}
																			onCopy={(e) => setCopyClip(e)}
																		>
																			<Fab size="small" color="primary">
																				<FontAwesomeIcon
																					icon={['fas', 'save']}
																				/>
																			</Fab>
																		</CopyToClipboard>
																	</InputAdornment>
																),
															}}
														/>
													</TableCell>
													<TableCell align="left">
														<TextField
															style={{ top: '9px' }}
															disabled
															variant="outlined"
															value={
																'{{#' +
																text +
																'}}' +
																'   ' +
																'{{/' +
																text +
																'}}'
															}
															fullWidth
															InputProps={{
																endAdornment: (
																	<InputAdornment position="end">
																		<CopyToClipboard
																			text={
																				'{{#' +
																				text +
																				'}}' +
																				'   ' +
																				'{{/' +
																				text +
																				'}}'
																			}
																			onCopy={(e) => setCopyClip(e)}
																		>
																			<Fab size="small" color="primary">
																				<FontAwesomeIcon
																					icon={['fas', 'save']}
																				/>
																			</Fab>
																		</CopyToClipboard>
																	</InputAdornment>
																),
															}}
														/>
													</TableCell>
													<TableCell align="left">
														<TextField
															disabled
															style={{ top: '9px' }}
															variant="outlined"
															value={
																'{{^ ' +
																text +
																'}}' +
																'   ' +
																'{{/' +
																text +
																'}}'
															}
															fullWidth
															InputProps={{
																endAdornment: (
																	<InputAdornment position="end">
																		<CopyToClipboard
																			text={
																				'{{^ ' +
																				text +
																				'}}' +
																				'   ' +
																				'{{/' +
																				text +
																				'}}'
																			}
																			onCopy={(e) => setCopyClip(e)}
																		>
																			<Fab size="small" color="primary">
																				<FontAwesomeIcon
																					icon={['fas', 'save']}
																				/>
																			</Fab>
																		</CopyToClipboard>
																	</InputAdornment>
																),
															}}
														/>
													</TableCell>
													<TableCell align="left">
														<TextField
															disabled
															style={{ top: '9px' }}
															variant="outlined"
															value={
																'{{#ifCond  ' +
																text +
																" '==' " +
																' N ' +
																'}}' +
																'   ' +
																'{{/ifCond' +
																text +
																'}}'
															}
															fullWidth
															InputProps={{
																endAdornment: (
																	<InputAdornment position="end">
																		<CopyToClipboard
																			text={
																				'{{#ifCond  ' +
																				text +
																				" '==' " +
																				' N ' +
																				'}}' +
																				'   ' +
																				'{{/ifCond}}'
																			}
																			onCopy={(e) => setCopyClip(e)}
																		>
																			<Fab size="small" color="primary">
																				<FontAwesomeIcon
																					icon={['fas', 'save']}
																				/>
																			</Fab>
																		</CopyToClipboard>
																	</InputAdornment>
																),
															}}
														/>
													</TableCell>
												</TableRow>
											))}
										</TableBody>
									</Table>
								</TableContainer>
							)}
						</div>
					</Grid>
					{copyClip !== '' ? (
						<Alert className="mb-4" severity="success">
							<span>
								Se a copiado <b>{copyClip}</b> en su portapapeles{' '}
							</span>
						</Alert>
					) : null}
				</div>
			</Card>
		</>
	);
}
