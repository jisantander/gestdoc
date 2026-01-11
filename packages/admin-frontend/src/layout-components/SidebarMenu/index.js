import React, { useState } from 'react';
import PerfectScrollbar from 'react-perfect-scrollbar';
import clsx from 'clsx';
import { Collapse } from '@material-ui/core';
import { connect } from 'react-redux';
import { NavLink } from 'react-router-dom';
import ChevronRightTwoToneIcon from '@material-ui/icons/ChevronRightTwoTone';

import { useSelector } from 'react-redux';
import imageOperation from '../../images/laborales.svg';
import crecimientoOperation from '../../images/crecimiento.png';
import imagePoderes from '../../images/poderes.svg';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import { setSidebarToggleMobile } from '../../reducers/ThemeOptions';
import { SidebarWidget } from '../../layout-components';

const LiAllowed = ({ routes, route, children, ...others }) => {
	if (!routes.includes(route)) return null;
	return <li {...others}>{children}</li>;
};

const SidebarMenu = (props) => {
	const { setSidebarToggleMobile, routes } = props;

	const company = useSelector(({ auth }) => auth.company);

	const toggleSidebarMobile = () => setSidebarToggleMobile(false);

	const [pagesOpen, setPagesOpen] = useState(false);
	const togglePages = (event) => {
		setPagesOpen(!pagesOpen);
		event.preventDefault();
	};

	const [pagesTwo, setPagesTwo] = useState(false);
	const togglePages2 = (event) => {
		setPagesTwo(!pagesTwo);
		event.preventDefault();
	};

	return (
		<>
			<PerfectScrollbar>
				<div className="sidebar-navigation">
					<SidebarWidget />
					<div className="sidebar-header">
						<span>Navegación</span>
					</div>
					<ul>
						<LiAllowed route="/Dashboard" routes={routes}>
							<NavLink
								onClick={toggleSidebarMobile}
								activeClassName="active"
								className="nav-link-simple"
								to="/Dashboard"
							>
								<span className="sidebar-icon">
									<img src={crecimientoOperation} alt="Operacion" />
								</span>
								Panel de Control
								<span className="sidebar-icon-indicator sidebar-icon-indicator-right">
									<ChevronRightTwoToneIcon />
								</span>
							</NavLink>
						</LiAllowed>
						<LiAllowed route="/Procedure" routes={routes}>
							<NavLink
								onClick={toggleSidebarMobile}
								activeClassName="active"
								className="nav-link-simple"
								to="/Procedure"
							>
								<span className="sidebar-icon">
									<img src={imageOperation} alt="Operacion" />
								</span>
								Operaciones
								<span className="sidebar-icon-indicator sidebar-icon-indicator-right">
									<ChevronRightTwoToneIcon />
								</span>
							</NavLink>
						</LiAllowed>
						{routes.length > 1 && (
							<li>
								<a
									href="#/"
									onClick={togglePages}
									className={clsx({ active: pagesOpen })}
								>
									<span className="sidebar-icon">
										<FontAwesomeIcon icon={['fas', 'sitemap']} size="lg" />
									</span>
									<span className="sidebar-item-label">
										Gestión de procesos
									</span>
									<span className="sidebar-icon-indicator">
										<ChevronRightTwoToneIcon />
									</span>
								</a>
								<Collapse in={pagesOpen}>
									<ul>
										<LiAllowed route="/BpmnList" routes={routes}>
											<NavLink onClick={toggleSidebarMobile} to="/BpmnList">
												Procesos
											</NavLink>
										</LiAllowed>
										<LiAllowed route="/FormList" routes={routes}>
											<NavLink onClick={toggleSidebarMobile} to="/FormList">
												Formularios
											</NavLink>
										</LiAllowed>
										<LiAllowed route="/ThemeList" routes={routes}>
											<NavLink onClick={toggleSidebarMobile} to="/ThemeList">
												Plantilla Documentos
											</NavLink>
										</LiAllowed>
										<LiAllowed route="/EmailList" routes={routes}>
											<NavLink onClick={toggleSidebarMobile} to="/EmailList">
												Plantilla Correos
											</NavLink>
										</LiAllowed>
										<LiAllowed route="/HtmlsList" routes={routes}>
											<NavLink onClick={toggleSidebarMobile} to="/HtmlsList">
												Plantilla Html
											</NavLink>
										</LiAllowed>
									</ul>
								</Collapse>
							</li>
						)}

						{routes.length > 1 && (
							<li>
								<a
									href="#/"
									onClick={togglePages2}
									className={clsx({ active: pagesTwo })}
								>
									<span className="sidebar-icon">
										<img src={imagePoderes} alt="Poderes" />
									</span>
									<span className="sidebar-item-label">
										Configuración de cuentas
									</span>
									<span className="sidebar-icon-indicator">
										<ChevronRightTwoToneIcon />
									</span>
								</a>
								<Collapse in={pagesTwo}>
									<ul>
										{(process.env.REACT_APP_EXP === company || !company) && (
											<LiAllowed route="/Company" routes={routes}>
												<NavLink onClick={toggleSidebarMobile} to="/Company">
													Empresas
												</NavLink>
											</LiAllowed>
										)}
										<LiAllowed route="/UserList" routes={routes}>
											<NavLink onClick={toggleSidebarMobile} to="/UserList">
												Usuarios
											</NavLink>
										</LiAllowed>
										<LiAllowed route="/Interface" routes={routes}>
											<NavLink onClick={toggleSidebarMobile} to="/Interface">
												Interfaces de conexión
											</NavLink>
										</LiAllowed>
									</ul>
								</Collapse>
							</li>
						)}
					</ul>
				</div>
			</PerfectScrollbar>
		</>
	);
};

const mapStateToProps = (state) => ({
	routes: state.auth.routes,
	sidebarToggleMobile: state.ThemeOptions.sidebarToggleMobile,
});

const mapDispatchToProps = (dispatch) => ({
	setSidebarToggleMobile: (enable) => dispatch(setSidebarToggleMobile(enable)),
});

export default connect(mapStateToProps, mapDispatchToProps)(SidebarMenu);
