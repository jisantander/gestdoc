import React, { useState, useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import Paper from '@material-ui/core/Paper';
import {
	ArgumentAxis,
	ValueAxis,
	Chart,
	BarSeries,
} from '@devexpress/dx-react-chart-material-ui';
import { EventTracker, SelectionState } from '@devexpress/dx-react-chart';

import axios from '../../utils/axios';
import AutocompleteControl from '../../utils/AutocompleteControl';

export default () => {
	const history = useHistory();

	const [bpmn, setBpmn] = useState([]);
	const [data, setData] = useState([]);
	const [selected, setSelected] = useState('-');
	const [selection, setSelection] = useState([]);

	useEffect(() => {
		const loadData = async () => {
			try {
				const { data } = await axios.get('/api/bpmn/all');
				setBpmn(data);
			} catch (err) {
				console.error(err);
				alert('Hubo un error al obtener la información');
			}
		};
		loadData();
	}, []);

	useEffect(() => {
		const loadData = async () => {
			try {
				const {
					data: { data },
				} = await axios.post('/api/report/graph-states', {
					bpmn: selected,
				});
				setData(data);
			} catch (err) {
				console.error(err);
				alert('Hubo un error al obtener la información');
			}
		};
		if (bpmn.length > 0) loadData();
	}, [bpmn, selected]);

	const defaultValueAutocomplete = (values, id, name, valForm) => {
		try {
			if (valForm === '-') return { inputValue: '-', _title: 'Todos' };
			return values
				.filter((e) => e._id === valForm)
				.map((item) => {
					return { inputValue: item[id], _title: item[name] };
				})[0];
		} catch (error) {
			return { inputValue: '-', _title: 'Todos' };
		}
	};

	const updToAutocomplete = (arrayData, id, name) => {
		return [
			{ inputValue: '-', _title: 'Todos' },
			...arrayData.map((item) => {
				return { inputValue: item[id], _title: item[name] };
			}),
		];
	};

	const handleBpmn = (value) => {
		setSelected(value);
	};

	const handleClick = ({ targets }) => {
		const target = targets[0];
		if (target) {
			setSelection(
				selection[0] && compare(selection[0], target) ? [] : [target]
			);
			let due_value = 'V';
			if (target.point === 1) due_value = 'O';
			if (target.point === 2) due_value = 'R';
			localStorage.setItem(
				'proc_list',
				JSON.stringify({
					page: 0,
					limit: 10,
					user: '-',
					bpmn: selected,
					due: due_value,
					sequence: '',
					step: '-',
					form: [],
				})
			);
			history.push('Procedure');
		}
	};
	const compare = (
		{ series, point },
		{ series: targetSeries, point: targetPoint }
	) => series === targetSeries && point === targetPoint;

	return (
		<Paper style={{padding:20}}>
			<h4 style={{marginBottom:30}}>Estado de Trámites</h4>
			<AutocompleteControl
				options={updToAutocomplete(bpmn, '_id', '_nameSchema')}
				defaultValue={defaultValueAutocomplete(
					bpmn,
					'_id',
					'_nameSchema',
					selected
				)}
				cbChange={(value) => {
					if (value) {
						handleBpmn(value.inputValue);
					}
				}}
				label={'Procesos'}
				fullWidth
			/>
			{data.length > 0 ? 
			<Chart data={data}>
				<ArgumentAxis />
				<ValueAxis />
				<BarSeries valueField="total" argumentField="state" />
				<EventTracker onClick={handleClick} />
				<SelectionState selection={selection} />
			</Chart>
			:
			<h4 style={{marginTop:20}}>No hay registros de tramites</h4>
}
		</Paper>
	);
};
