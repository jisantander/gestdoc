import React, { useState, useEffect } from 'react';
import clsx from 'clsx';
import PropTypes from 'prop-types';
import { connect, useSelector } from 'react-redux';
import { useHistory, useLocation } from 'react-router-dom';

import { Sidebar, Header, Footer } from '../../layout-components';
import NotAllowed from '../../layout-components/NotAllowed';

const LeftSidebar = (props) => {
	const {
		children,
		sidebarToggle,
		sidebarToggleMobile,
		sidebarFixed,
		headerFixed,
		headerSearchHover,
		headerDrawerToggle,
		footerFixed,
		contentBackground,
	} = props;
	const history = useHistory();
	const location = useLocation();
	const loading = useSelector(({ auth }) => auth.loading);
	const isAuth = useSelector(({ auth }) => auth.token !== null);
	const routes = useSelector(({ auth }) => auth.routes);
	const [allowed, setAllowed] = useState(false);

	useEffect(() => {
		if (!loading) {
			if (!isAuth) history.push('/');
			if (routes) {
				if (location.pathname === '/profile') {
					setAllowed(true);
				} else {
					setAllowed(
						routes.some((item) => {
							return location.pathname.substr(0, item.length) === item;
						})
					);
				}
			}
		}
		// eslint-disable-next-line
	}, [loading, isAuth, location.pathname, routes]);

	return (
		<>
			<div
				className={clsx('app-wrapper', contentBackground, {
					'header-drawer-open': headerDrawerToggle,
					'app-sidebar-collapsed': sidebarToggle,
					'app-sidebar-mobile-open': sidebarToggleMobile,
					'app-sidebar-fixed': sidebarFixed,
					'app-header-fixed': headerFixed,
					'app-footer-fixed': footerFixed,
					'search-wrapper-open': headerSearchHover,
				})}
			>
				<div>
					<Sidebar />
				</div>
				<div className="app-main">
					<Header />
					<div className="app-content">
						<div className="app-content--inner">
							<div className="app-content--inner__wrapper">
								{allowed ? children : <NotAllowed />}
							</div>
						</div>
						<Footer />
					</div>
				</div>
			</div>
		</>
	);
};

LeftSidebar.propTypes = {
	children: PropTypes.node,
};

const mapStateToProps = (state) => ({
	sidebarToggle: state.ThemeOptions.sidebarToggle,
	sidebarToggleMobile: state.ThemeOptions.sidebarToggleMobile,
	sidebarFixed: state.ThemeOptions.sidebarFixed,
	headerFixed: state.ThemeOptions.headerFixed,
	headerSearchHover: state.ThemeOptions.headerSearchHover,
	headerDrawerToggle: state.ThemeOptions.headerDrawerToggle,

	footerFixed: state.ThemeOptions.footerFixed,

	contentBackground: state.ThemeOptions.contentBackground,
});

export default connect(mapStateToProps)(LeftSidebar);
