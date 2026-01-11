import React, { useRef } from 'react';
import MaterialTable from 'material-table';
import { useHistory } from 'react-router-dom';
import { TablePagination, Button } from '@material-ui/core';
import { useDispatch } from 'react-redux';
import { setSidebarName } from '../../reducers/ThemeOptions';
import axios from '../../utils/axios';

import { LocationTable } from '../../utils/LocationTable'; //cambio de idiomas

import { forwardRef } from 'react';
import Edit from '@material-ui/icons/Edit';
import DeleteOutline from '@material-ui/icons/DeleteOutline';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

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
			<span className="btn-wrapper--label">Nuevo Usuario</span>
		</Button>
	)),
	Edit: forwardRef((props, ref) => (
		<Edit {...props} ref={ref} className="editBpmnList" />
	)),
	Delete: forwardRef((props, ref) => (
		<DeleteOutline {...props} ref={ref} className="deleteBpmnList" />
	)),
};

const InterfaceList = () => {
	const tableRef = useRef();

	const dispatch = useDispatch();
	dispatch(setSidebarName(['Usuarios', 'fas', 'users-cog']));

	const columns = [
		{ title: 'Tipo de conector', field: 'type' },
		{ title: 'Descripción', field: 'title' },
		{ title: 'Creado', field: 'createdAt' },
	];

	const history = useHistory();
	const goStage = (id) => {
		history.push('Interface/' + id);
	};

	return (
		<>
			<MaterialTable
				tableRef={tableRef}
				icons={tableIcons}
				localization={LocationTable}
				title="Interfaces de conexión"
				columns={columns}
				data={(query) =>
					new Promise(async (resolve, reject) => {
						try {
							const filter = {};
							const params = { page: query.page + 1, limit: query.pageSize };
							if (query.search !== '') {
								filter.name = query.search;
								params.filter = filter;
							}
							const { data } = await axios.get('api/interface', {
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
						icon: 'search',
						tooltip: 'Ver Detalles',
						onClick: (event, rowData) => {
							goStage(rowData._id);
						},
					},
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
						icon: 'add_box',
						tooltip: 'Crear Nuevo Usuario',
						position: 'toolbar',
						onClick: () => {
							history.push('Interface/new');
						},
					},
				]}
				options={{
					actionsColumnIndex: -1,
					pageSize: 10,
					pageSizeOptions: [10, 20, 30],
					initialPage: 0,
					padding: 'dense',
					sorting: false,
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
export default InterfaceList;
