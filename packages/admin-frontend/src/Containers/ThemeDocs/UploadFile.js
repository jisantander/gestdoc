import React, { useState, useCallback } from 'react';
import { put_file_docs } from '../../services/Docs';
import SnackBar from '../../utils/SnackBar';
import { Button, List, ListItem } from '@material-ui/core';
import Alert from '@material-ui/lab/Alert';

import { useDropzone } from 'react-dropzone';

import CloseTwoToneIcon from '@material-ui/icons/CloseTwoTone';
import CloudUploadTwoToneIcon from '@material-ui/icons/CloudUploadTwoTone';
import CheckIcon from '@material-ui/icons/Check';
import { useRouteMatch } from 'react-router-dom';

export default function LivePreviewExample() {
	const [snackBar, setSnackBar] = useState(null);
	const match = useRouteMatch();
	const onDrop = useCallback(
		(acceptedFiles) => {
			// Do something with the files
			console.log('acceptedFiles', acceptedFiles);

			//send File to S3

			if (
				acceptedFiles[0].type ===
				'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
			) {
				put_file_docs(acceptedFiles[0], match.params.id)
					.then((data) => {})
					.catch(() => console.log('Failed connection with API'));
			} else {
				setSnackBar(
					<SnackBar
						key={new Date()}
						typeStyle="toastr-danger"
						msg="El formato debe ser .docx"
					/>
				);

				return false;
			}
		},
		[match.params.id]
	);

	const {
		acceptedFiles,
		isDragActive,
		isDragAccept,
		isDragReject,
		getRootProps,
		getInputProps,
	} = useDropzone({ onDrop, accept: '.docx' });

	const files = acceptedFiles.map((file) => (
		<ListItem
			className="font-size-sm px-3 py-2 text-primary d-flex justify-content-between align-items-center"
			key={file.path}
		>
			<span>{file.path}</span>{' '}
			<span className="badge badge-pill bg-neutral-warning text-warning">
				{file.size} bytes
			</span>
		</ListItem>
	));

	return (
		<>
			<div className="dropzone">
				<div
					{...getRootProps({
						className: 'dropzone-upload-wrapper',
						onDrop: (event) => console.log(event),
					})}
				>
					<input {...getInputProps()} />
					<div className="dropzone-inner-wrapper">
						{isDragAccept && (
							<div>
								<div className="d-100 btn-icon mb-3 hover-scale-lg bg-success shadow-success-sm rounded-circle text-white">
									<CheckIcon className="d-50" />
								</div>
								<div className="font-size-sm text-success">
									All files will be uploaded!
								</div>
							</div>
						)}
						{isDragReject && (
							<div>
								<div className="d-100 btn-icon mb-3 hover-scale-lg bg-danger shadow-danger-sm rounded-circle text-white">
									<CloseTwoToneIcon className="d-50" />
								</div>
								<div className="font-size-sm text-danger">
									Some files will be rejected!
								</div>
							</div>
						)}
						{!isDragActive && (
							<div>
								<div className="d-100 btn-icon mb-3 hover-scale-lg bg-white shadow-light-sm rounded-circle text-primary">
									<CloudUploadTwoToneIcon className="d-50" />
								</div>
								<div className="font-size-sm">
									Arraste su archivo aquí{' '}
									<span className="font-size-xs text-dark">(.docx)</span>
								</div>
							</div>
						)}

						<small className="py-2 text-black-50">o</small>
						<div>
							<Button className="btn-primary hover-scale-sm font-weight-bold btn-pill px-4">
								<span className="px-2">Buscar en su directorio</span>
							</Button>
						</div>
					</div>
				</div>
			</div>
			<div>
				<div className="font-weight-bold my-4 text-uppercase text-dark font-size-sm text-center">
					Cargue su documento Microsoft Word (.docx)
				</div>
				{files.length <= 0 && (
					<div className="text-info text-center font-size-sm"></div>
				)}
				{files.length > 0 && (
					<div>
						<Alert severity="success" className="text-center mb-3">
							Se ha subido el archivo correctamente.
						</Alert>
						<List component="div" className="font-size-sm">
							{files}
						</List>
					</div>
				)}
			</div>
			{snackBar}
		</>
	);
}
