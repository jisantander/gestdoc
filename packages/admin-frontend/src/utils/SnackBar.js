import React, { useState } from 'react';
import Snackbar from '@material-ui/core/Snackbar';

const CustomSnackBar = ({ typeStyle, msg }) => {
	const [state, setState] = useState({
		open: true,
		vertical: 'top',
		horizontal: 'center',
		toastrStyle: typeStyle,
		message: msg,
	});

	const { vertical, horizontal, open, toastrStyle, message } = state;
	return (
		<>
			<Snackbar
				autoHideDuration={4000}
				anchorOrigin={{ vertical, horizontal }}
				open={open}
				classes={{ root: toastrStyle }}
				onClose={() => {
					setState({ ...state, open: false });
				}}
				message={message}
			/>
		</>
	);
};
export default CustomSnackBar;
