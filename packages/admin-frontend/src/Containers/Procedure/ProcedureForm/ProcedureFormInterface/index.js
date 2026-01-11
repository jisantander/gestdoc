import React, { useState, useEffect } from "react";
import { Grid, Card } from "@material-ui/core";

import axios from "../../../../utils/axios";

import InterfaceOdoo from "./InterfaceOdoo";
import { Loading } from "../../../../utils/Loading";

export default function ProcedureFormInterface() {
	const [type, setType] = useState([]);
	const [data, setData] = useState({});
	const [employee, setEmployee] = useState(false);
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		const getInterface = async () => {
			try {
				const { data } = await axios.get(`api/interface/all`);
				setType(data);
				setData(data[0]);
				setLoading(false);
			} catch (e) {
				console.error(e);
			}
		};
		getInterface();
		// eslint-disable-next-line
	}, []);

	const handleType = (e) => {
		const selected = type.find((item) => item._id === e.target.value);
		setData(selected);
	};
	const handleEmployee = (employeeData) => {
		setEmployee(employeeData);
	};

	return (
		<Grid container spacing={4}>
			<Grid item>
				<Card className="p-4 mb-4">
					{loading ? (
						<Loading />
					) : (
						<div>
							<h3>Interface de conexión</h3>
							<select onChange={handleType}>
								{type.map((item) => (
									<option value={item._id} key={item._id}>
										{item.title}
									</option>
								))}
							</select>
							{data.type === "ODOO" && <InterfaceOdoo odooData={data} handleEmployee={handleEmployee} />}
							{employee && <pre>{JSON.stringify(employee, null, 2)}</pre>}
						</div>
					)}
				</Card>
			</Grid>
		</Grid>
	);
}
