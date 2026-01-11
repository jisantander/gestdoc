import React, { useRef } from "react";
import MaterialTable from "material-table";
import { TablePagination, Button } from "@material-ui/core";
import { useDispatch } from "react-redux";
import { setSidebarName } from "../../reducers/ThemeOptions";
import axios from "../../utils/axios";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import { LocationTable } from "../../utils/LocationTable";
import { post_company, put_company, delete_company } from "../../services/Company";
import { forwardRef } from "react";
import Edit from "@material-ui/icons/Edit";
import DeleteOutline from "@material-ui/icons/DeleteOutline";

const tableIcons = {
	Add: forwardRef((props, ref) => (
		<Button
			{...props}
			ref={ref}
			className="MuiButtonBase-root MuiButton-root MuiButton-text btn-neutral-primary MuiButton-textSizeSmall MuiButton-sizeSmall"
		>
			<span className="btn-wrapper--icon">
				<FontAwesomeIcon icon={["fas", "plus"]} />
			</span>
			<span className="btn-wrapper--label">Nueva Empresa</span>
		</Button>
	)),
	Edit: forwardRef((props, ref) => <Edit {...props} ref={ref} className="editBpmnList" />),
	Delete: forwardRef((props, ref) => <DeleteOutline {...props} ref={ref} className="deleteBpmnList" />),
};

const CompanyList = () => {
	const tableRef = useRef();

	const dispatch = useDispatch();
	dispatch(setSidebarName(["Empresas", "far", "building"]));
	const columns = [
		{ title: "Razón Social", field: "name" },
		{ title: "Creado", field: "createdAt", editable: "never" },
	];

	const createCompany = (data, cb) => {
		post_company(data)
			.then(cb)
			.catch(() => console.log("Failed connection with API"));
	};

	return (
		<>
			<span className="line otherLines"></span>
			<MaterialTable
				tableRef={tableRef}
				icons={tableIcons}
				localization={LocationTable}
				title="Empresas registradas"
				columns={columns}
				data={(query) =>
					new Promise(async (resolve, reject) => {
						try {
							const filter = {};
							const params = { page: query.page + 1, limit: query.pageSize };
							if (query.search !== "") {
								filter.name = query.search;
								params.filter = filter;
							}
							const { data } = await axios.get("api/company", {
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
				options={{
					addRowPosition: "first",
					actionsColumnIndex: -1,
					pageSize: 10,
					pageSizeOptions: [10, 20, 30],
					initialPage: 0,
					padding: "dense",
					sorting: false,
				}}
				components={{
					Pagination: (props) => <TablePagination {...props} rowsPerPageOptions={[10, 20, 30]} />,
				}}
				editable={{
					onRowAdd: (newData) =>
						new Promise((resolve) => {
							createCompany(newData, (parseData) => {
								resolve();
							});
						}),
					onRowUpdate: (newData, oldData) =>
						new Promise((resolve) => {
							put_company(newData, newData._id)
								.then((getResult) => {
									resolve();
								})
								.catch(() => console.log("Faild Connection"));
						}),
					onRowDelete: (oldData) =>
						new Promise((resolve) => {
							delete_company(oldData._id)
								.then((getResult) => {
									resolve();
								})
								.catch((error) => console.log("Faild Connection", error));
						}),
				}}
			/>
		</>
	);
};
export default CompanyList;
