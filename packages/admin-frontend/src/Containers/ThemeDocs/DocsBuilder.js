import React, { useEffect } from 'react';
import { get_document, get_docs_id } from '../../services/Docs';
import CloudUploadTwoToneIcon from '@material-ui/icons/CloudDownloadTwoTone';
import { useDispatch } from 'react-redux';
import imageDocfirm from '../../images/docfirm.svg';
import { setSidebarName } from '../../reducers/ThemeOptions';
import {
	Grid,
	Card,
	Divider,
	Accordion,
	AccordionSummary,
	AccordionDetails,
	Typography,
} from '@material-ui/core';
import { useRouteMatch } from 'react-router-dom';
import UploadFile from './UploadFile';
import ShareOptionsForm from './ShareOptionsForm';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
export default function DocBuilder() {
	const dispatch = useDispatch();
	const match = useRouteMatch();
	const download = () => {
		get_document(match.params.id)
			.then((dato) => {
				let url = dato.url;
				let a = document.createElement('a');
				a.href = url;
				a.download = 'employees.docx';
				a.click();
			})
			.catch((error) => console.log(error));
	};

	useEffect(() => {
		get_docs_id(match.params.id)
			.then((dato) => {
				dispatch(setSidebarName(['Docx - ' + dato._title, imageDocfirm]));
			})
			.catch((error) => console.log(error));
		// eslint-disable-next-line
	}, [match]);

	return (
		<>
			<Grid container spacing={4}>
				<Grid item xs={12} lg={6}>
					<Card className="p-4 mb-4">
						<div className="font-size-lg font-weight-bold">Subir plantilla</div>
						<Divider className="my-4" />
						<UploadFile />
					</Card>
					<Card className="p-4 mb-4">
						<div className="font-size-lg font-weight-bold">
							Descargar plantilla
						</div>
						<Divider className="my-4" />
						<div className="d-flex align-items-center justify-content-center flex-wrap">
							<div
								onClick={download}
								className="m-3 btn-input-select"
								style={{ cursor: 'pointer' }}
							>
								<div className="d-30 d-flex align-items-center justify-content-center rounded-pill bg-secondary text-primary">
									<CloudUploadTwoToneIcon className="d-50" />
								</div>
								<div className="font-weight-bold text-primary opacity-6 mt-12">
									Descargar
								</div>
							</div>
						</div>
						<div className="font-weight-bold my-12 text-uppercase text-dark font-size-sm text-center">
							Descarge su documento Microsoft Word (.docx)
						</div>
					</Card>
				</Grid>
				<Grid item xs={12} lg={6}>
					<ShareOptionsForm system={'su visualizador de documentos favorito'} />
					{/*
                    <Card className="p-4 mb-4">
            <div className="font-size-lg font-weight-bold">Información de la plantilla</div>
            <Divider className="my-4" />
            <div className="p-3">
            </div>
          </Card>
          */}

					<Card className="p-4 mb-4">
						<div className="font-size-lg font-weight-bold">
							Tips para crear tu plantilla
						</div>
						<Divider className="my-4" />
						<div className="p-3">
							<Accordion>
								<AccordionSummary
									expandIcon={<ExpandMoreIcon />}
									aria-controls="panel1a-content"
									id="panel1a-header"
								>
									¿Sabías que las propiedades de los formularios son únicas?
								</AccordionSummary>
								<AccordionDetails>
									<Typography>
										<p>
											{' '}
											Esto permite poder utilizar lo que el usuario escribió en
											distintos formularios para poder juntas los resultados en
											el documento{' '}
										</p>
										transformando esto:
										<code>{`Comparecer {arriendo_nombre_vendedor} {arriendo_apellido_vendedor} junto con...`}</code>{' '}
										en <code>{`Comparecer José Santander junto con...`}</code>
									</Typography>
								</AccordionDetails>
							</Accordion>
							<Accordion>
								<AccordionSummary
									expandIcon={<ExpandMoreIcon />}
									aria-controls="panel2a-content"
									id="panel2a-header"
								>
									¿Sabías que puedes crear condicionales en tus plantillas?
								</AccordionSummary>
								<AccordionDetails>
									<Typography>
										<p>
											Si quisieras añadir un texto dependiendo de lo que ingreso
											el usuario, por ejemplo si la persona lleno el check box
											de que está casado, puedes usar esta sintaxis para
											manejarlo
										</p>
										<code>{`{#condición_casado} esto se imprimiría si la persona está casada.... {/}`}</code>
										<p>
											Todo lo que escribas dentro de{' '}
											<code>{`{#condición_casado}  {/}`}</code> se va a imprimir
											solo si el check box <code>{`{condición_casado}`}</code>{' '}
											es true{' '}
										</p>
										<p>
											Si quieres imprimir un texto solo dado si una condición es
											falsa o no se cumple, la sintaxis es:{' '}
										</p>
										<code>{`{^condición_casado}  el texto... {/}`}</code>
									</Typography>
								</AccordionDetails>
							</Accordion>
							<Accordion>
								<AccordionSummary
									expandIcon={<ExpandMoreIcon />}
									aria-controls="panel2a-content"
									id="panel2a-header"
								>
									¿Que condicionales se pueden usar?
								</AccordionSummary>
								<AccordionDetails>
									<Typography>
										<p>Contamos con las siguientes condicionales:</p>
										<code>{`{#alguna_propiedad == "Juan"} ...la persona se llama Juan {/}`}</code>
										<p>
											{' '}
											<br></br>
										</p>
										<code>{`{#edad_vendedor < 18} ...el vendedor es menor de edad {/}`}</code>
									</Typography>
								</AccordionDetails>
							</Accordion>
							<Accordion>
								<AccordionSummary
									expandIcon={<ExpandMoreIcon />}
									aria-controls="panel1a-content"
									id="panel1a-header"
								>
									¿Cómo usar la propiedad Números a letras?
								</AccordionSummary>
								<AccordionDetails>
									<Typography>
										<p>
										llaves
											Debes agregar la siguiente etiqueta:  nl mivariable   donde nl es la clave para poder transformas los numero a letras {' '}
										</p>
										transformando esto:
										<code>{` {nl mivariable} `}</code>{' '}
										en <code>{`Cien Mil`}</code>
										Donde mivariable viene con el valor 100000
									</Typography>
								</AccordionDetails>
							</Accordion>
					
						</div>
					</Card>
				</Grid>
			</Grid>
		</>
	);
}
