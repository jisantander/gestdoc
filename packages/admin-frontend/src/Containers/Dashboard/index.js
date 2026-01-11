import React from 'react';

import GraphMostSelled from './GraphMostSelled';
import GraphStates from './GraphStates';

export default function index() {
	return (
		<div>
			<GraphMostSelled />
			<br />
			<GraphStates />
		</div>
	);
}
