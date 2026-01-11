import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Badge, Menu, Button, List, ListItem } from '@material-ui/core';

import avatar3 from '../../assets/images/avatars/avatar3.jpg';
import ExitToAppTwoToneIcon from '@material-ui/icons/ExitToAppTwoTone';
import AccountBoxIcon from '@material-ui/icons/AccountBox';

import { withStyles } from '@material-ui/core/styles';
import HeaderUserboxCompany from './HeaderUserboxCompany';

const StyledBadge = withStyles({
	badge: {
		backgroundColor: 'var(--success)',
		color: 'var(--success)',
		boxShadow: '0 0 0 2px #fff',
		'&::after': {
			position: 'absolute',
			top: 0,
			left: 0,
			width: '100%',
			height: '100%',
			borderRadius: '50%',
			animation: '$ripple 1.2s infinite ease-in-out',
			border: '1px solid currentColor',
			content: '""'
		}
	},
	'@keyframes ripple': {
		'0%': {
			transform: 'scale(.8)',
			opacity: 1
		},
		'100%': {
			transform: 'scale(2.4)',
			opacity: 0
		}
	}
})(Badge);

const HeaderUserbox = () => {
	const { name, surname, email, companyData, admin } = useSelector(({ auth }) => auth);
	const [anchorEl, setAnchorEl] = useState(null);

	const companyName = companyData ? companyData.name : '';

	const handleClick = (event) => {
		setAnchorEl(event.currentTarget);
	};

	const handleClose = () => {
		setAnchorEl(null);
	};

	return (
		<>
			<Button
				variant="text"
				onClick={handleClick}
				className="btn-transition-none text-left ml-2 p-0 bg-transparent d-flex align-items-center"
				disableRipple
			>
				<div className="d-block p-0 avatar-icon-wrapper">
					<StyledBadge
						overlap="circular"
						anchorOrigin={{
							vertical: 'bottom',
							horizontal: 'right'
						}}
						badgeContent=" "
						classes={{ badge: 'bg-success badge-circle border-0' }}
						variant="dot"
					>
						<div className="avatar-icon rounded">
							<img src={avatar3} alt="..." />
						</div>
					</StyledBadge>
				</div>
				<div className="d-none d-xl-block pl-2">
					<span className="text-success">
						<small>{name}</small>
					</span>
					<div className="font-weight-bold">{companyName}</div>
				</div>
				<span className="pl-1 pl-xl-3">
					<FontAwesomeIcon icon={['fas', 'angle-down']} className="opacity-5" />
				</span>
			</Button>
			<Menu
				anchorEl={anchorEl}
				keepMounted
				getContentAnchorEl={null}
				anchorOrigin={{
					vertical: 'top',
					horizontal: 'right'
				}}
				transformOrigin={{
					vertical: 'top',
					horizontal: 'right'
				}}
				open={Boolean(anchorEl)}
				classes={{ list: 'p-0' }}
				onClose={handleClose}
			>
				<div className="dropdown-menu-xl overflow-hidden p-0">
					<div className="d-flex p-4">
						<div className="avatar-icon flex-shrink-0 rounded mr-3">
							<img src={avatar3} alt="..." />
						</div>
						<div>
							<h6 className="font-weight-bold mb-1 text-black">
								{name} {surname} [{companyName}]
							</h6>
							<p className="text-black-50 mb-0">{email}</p>
						</div>
					</div>
					{admin ? (
						<>
							<List component="div" className="nav-neutral-danger nav-pills-rounded flex-column p-3">
								<HeaderUserboxCompany companyId={companyData?._id} />
							</List>
							<div className="divider" />
						</>
					) : null}
					<List component="div" className="nav-neutral-first nav-pills-rounded flex-column p-3">
						<ListItem component={Link} button to="/profile">
							<div className="mr-2">
								<AccountBoxIcon />
							</div>
							<span>Mi Perfil</span>
						</ListItem>
					</List>
					<div className="divider" />
					<List component="div" className="nav-neutral-danger nav-pills-rounded flex-column p-3">
						<ListItem component={Link} button to="/logout">
							<div className="mr-2">
								<ExitToAppTwoToneIcon />
							</div>
							<span>Cerrar sesión</span>
						</ListItem>
					</List>
				</div>
			</Menu>
		</>
	);
};

export default HeaderUserbox;
