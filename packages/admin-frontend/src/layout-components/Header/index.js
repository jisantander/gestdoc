import React from "react";

import clsx from "clsx";

import { connect } from "react-redux";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { setSidebarToggleMobile } from "../../reducers/ThemeOptions";

import HeaderUserbox from "../../layout-components/HeaderUserbox";
//import HeaderSearch from '../../layout-components/HeaderSearch';
import HeaderWidget from "../../layout-components/HeaderWidget";

const Header = (props) => {
	const {
		headerShadow,
		headerBgTransparent,
		/*sidebarToggleMobile,
		setSidebarToggleMobile,*/
		sidebarName,
	} = props;

	/*const toggleSidebarMobile = () => {
		setSidebarToggleMobile(!sidebarToggleMobile);
	};*/

	return (
		<>
			<div
				className={clsx("app-header", {
					"app-header--shadow": headerShadow,
					"app-header--opacity-bg": headerBgTransparent,
				})}
			>
				<div className="app-header--pane">
					{sidebarName[2] ? (
						<span className="sidebar-icon icon-header-svg">
							<FontAwesomeIcon icon={[sidebarName[1], sidebarName[2]]} size="lg" />
						</span>
					) : (
						<img className="img-header" src={sidebarName[1]} alt="Cabecera" />
					)}
					<p className="text-capitalize font-weight-bold parrafo-header" style={{ display: "flex" }}>
						{sidebarName[0]}
						<span className="line"></span>
					</p>
					<HeaderWidget />
				</div>
				<div className="app-header--pane">
					<HeaderUserbox />
				</div>
			</div>
		</>
	);
};

function mapStateToProps(state) {
	return {
		sidebarName: state.ThemeOptions.sidebarName,
		headerShadow: state.ThemeOptions.headerShadow,
		headerBgTransparent: state.ThemeOptions.headerBgTransparent,
		sidebarToggleMobile: state.ThemeOptions.sidebarToggleMobile,
	};
}

const mapDispatchToProps = (dispatch) => ({
	setSidebarToggleMobile: (enable) => dispatch(setSidebarToggleMobile(enable)),
});

export default connect(mapStateToProps, mapDispatchToProps)(Header);
