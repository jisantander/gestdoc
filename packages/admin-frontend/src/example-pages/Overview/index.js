import React from 'react';
import { useSelector } from 'react-redux';
import { PageTitle } from 'layout-components';

import OverviewPageTitleActions from '../../example-components/Overview/OverviewPageTitleActions';

export default function Overview() {
	const name = useSelector(({ auth }) => auth.name);

	return (
		<>
			<PageTitle
				titleHeading={`Welcome back, ${name}`}
				titleDescription="This page shows an overview for your account summary."
			>
				<OverviewPageTitleActions />
			</PageTitle>
		</>
	);
}
