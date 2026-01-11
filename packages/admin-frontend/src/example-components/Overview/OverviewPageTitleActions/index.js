import React, { useState } from 'react';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Button } from '@material-ui/core';

const OverviewPageTitleActions = () => {
	const [modal, setModal] = useState(false);
	const toggleModal = () => setModal(!modal);

	return (
		<>
			<Button onClick={toggleModal} variant="contained" color="primary">
				<span className="btn-wrapper--icon">
					<FontAwesomeIcon icon={['fas', 'plus']} />
				</span>
				<span className="btn-wrapper--label">View Profile</span>
			</Button>
		</>
	);
};

export default OverviewPageTitleActions;
