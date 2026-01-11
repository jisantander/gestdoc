import React, { useState, useEffect } from "react";
import Paper from "@material-ui/core/Paper";
import { ArgumentAxis, ValueAxis, Chart, LineSeries } from "@devexpress/dx-react-chart-material-ui";
import Grid from "@material-ui/core/Grid";
import DateFnsUtils from "@date-io/date-fns";
import { DatePicker, MuiPickersUtilsProvider } from "@material-ui/pickers";

import axios from "../../utils/axios";

export default () => {
	const [data, setData] = useState([]);
	const sd = new Date();
	sd.setMonth(sd.getMonth() - 1);
	const [start, setStart] = useState(sd);
	const [end, setEnd] = useState(new Date());

	useEffect(() => {
		const loadData = async () => {
			try {
				const {
					data: { data },
				} = await axios.post("/api/report/most-selled", {
					start,
					end,
				});
				setData(data);
			} catch (err) {
				console.error(err);
				alert("Hubo un error al obtener la información");
			}
		};
		loadData();
	}, [start, end]);

	const handleDateChange = (field) => (date) => {
		if (field === "start") setStart(date);
		if (field === "end") setEnd(date);
	};

	return (
		<Paper style={{ padding: 20 }}>
			<h4 style={{ marginBottom: 30 }}>Trámites más vendidos</h4>

			<MuiPickersUtilsProvider utils={DateFnsUtils}>
				<Grid container>
					<label>Desde:</label>
					<DatePicker value={start} onChange={handleDateChange("start")} />
					<label>Hasta:</label>
					<DatePicker value={end} onChange={handleDateChange("end")} />
				</Grid>
			</MuiPickersUtilsProvider>

			{data.length > 0 ? (
				<Chart data={data}>
					<ArgumentAxis />
					<ValueAxis />

					<LineSeries valueField="amount" argumentField="bpmn" />
				</Chart>
			) : (
				<h4 style={{ marginTop: 20 }}>No hay registros de ventas para estas fechas</h4>
			)}
		</Paper>
	);
};
