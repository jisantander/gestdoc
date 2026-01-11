import React from 'react';
import TextField from '@material-ui/core/TextField';
import Autocomplete from '@material-ui/lab/Autocomplete';
import './css/Autocomplete.css';

export default function AutocompleteControl({
	options,
	defaultValue,
	cbChange,
	label,
	fullWidth = false,
}) {
	const [value, setValue] = React.useState(defaultValue ? defaultValue : '');
	const [inputValue, setInputValue] = React.useState(
		defaultValue?._title ? defaultValue._title : ''
	);

	React.useEffect(() => {
		setInputValue(defaultValue?._title ? defaultValue._title : '');
		setValue(defaultValue ? defaultValue : '');
	}, [defaultValue]);

	return (
		<Autocomplete
			value={value}
			onChange={(event, newValue) => {
				setValue(newValue);
				cbChange(newValue);
			}}
			inputValue={inputValue}
			onInputChange={(event, newInputValue) => {
				setInputValue(newInputValue);
			}}
			className={'autocompleteControl'}
			id={`autocomplete-${label}`}
			options={options}
			getOptionLabel={(option) => option._title}
			renderInput={(params) => (
				<TextField {...params} label={label} variant="outlined" />
			)}
			fullWidth={fullWidth}
		/>
	);
}
