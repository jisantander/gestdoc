import React, { useRef } from 'react';
import MaterialTable from 'material-table';
import { useHistory } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { TablePagination, Button } from '@material-ui/core';

import { setSidebarName } from '../../reducers/ThemeOptions';
import axios from '../../utils/axios';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import { post_html, put_html, delete_html } from '../../services/Html';
import { LocationTable } from '../../utils/LocationTable'; //cambio de idiomas
import { forwardRef } from 'react';
import Edit from '@material-ui/icons/Edit';
import DeleteOutline from '@material-ui/icons/DeleteOutline';

const tableIcons = {
	Add: forwardRef((props, ref) => (
		<Button
			{...props}
			ref={ref}
			className="MuiButtonBase-root MuiButton-root MuiButton-text btn-neutral-primary MuiButton-textSizeSmall MuiButton-sizeSmall"
		>
			<span className="btn-wrapper--icon">
				<FontAwesomeIcon icon={['fas', 'plus']} />
			</span>
			<span className="btn-wrapper--label">Nueva Plantilla HTML</span>
		</Button>
	)),
	Edit: forwardRef((props, ref) => (
		<Edit {...props} ref={ref} className="editBpmnList" />
	)),
	Delete: forwardRef((props, ref) => (
		<DeleteOutline {...props} ref={ref} className="deleteBpmnList" />
	)),
};

const HtmlsList = () => {
	const tableRef = useRef();

	const dispatch = useDispatch();

	dispatch(setSidebarName(['Plantillas Html', 'far', 'file-code']));

	const columns = [{ title: 'Nombre', field: '_title' }];

	const createHtmls = (data, cb) => {
		post_html(data)
			.then(cb)
			.catch(() => console.log('Failed connection with API'));
	};

	const history = useHistory();
	const goStage = (id) => {
		history.push('HtmlsBuilder/' + id);
	};

	return (
		<>
			<span className="line otherLines"></span>
			<MaterialTable
				tableRef={tableRef}
				icons={tableIcons}
				localization={LocationTable}
				title="Plantilla HTML"
				columns={columns}
				data={(query) =>
					new Promise(async (resolve, reject) => {
						try {
							const filter = {};
							const params = { page: query.page + 1, limit: query.pageSize };
							if (query.search !== '') {
								filter._title = query.search;
								params.filter = filter;
							}
							const { data } = await axios.get('api/html', {
								params: params,
							});
							resolve({
								data: data.docs,
								page: query.page,
								totalCount: data.total,
							});
						} catch (e) {
							console.error(e);
						}
					})
				}
				actions={[
					{
						iconProps: {
							style: {
								background: 'rgba(60,68,177,.15)',
								color: '#3c44b1',
								width: '40px',
								height: '40px',
								padding: '9px',
								borderRadius: '8px',
							},
						},
						icon: 'login',
						tooltip: 'Configurar Plantilla',
						onClick: (event, rowData) => {
							goStage(rowData._id);
						},
					},
				]}
				options={{
					addRowPosition:'first',
					actionsColumnIndex: -1,
					pageSize: 10,
					pageSizeOptions: [10, 20, 30],
					initialPage: 0,
					padding: 'dense',
					sorting: false,
				}}
				editable={{
					onRowAdd: (newData) =>
						new Promise((resolve) => {
							createHtmls(newData, (parseData) => {
								resolve();
							});
						}),
					onRowUpdate: (newData, oldData) =>
						new Promise((resolve) => {
							put_html(newData, newData._id)
								.then((getResult) => {
									resolve();
								})
								.catch(() => console.log('Faild Connection'));
						}),
					onRowDelete: (oldData) =>
						new Promise((resolve) => {
							delete_html(oldData._id)
								.then((getResult) => {
									resolve();
								})
								.catch((error) => console.log('Faild Connection', error));
						}),
				}}
				components={{
					Pagination: (props) => (
						<TablePagination {...props} rowsPerPageOptions={[10, 20, 30]} />
					),
				}}
			/>
		</>
	);
};
export default HtmlsList;
