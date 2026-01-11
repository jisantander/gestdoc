import React, { lazy, Suspense, useState, useEffect } from 'react';
import { Switch, Route, Redirect, useLocation } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { ClimbingBoxLoader } from 'react-spinners';
import { useSelector, useDispatch } from 'react-redux';

import { ThemeProvider } from '@material-ui/styles';

import { authCheckState } from './reducers/auth';

import MuiTheme from './theme';

// Layout Blueprints

import {
	LeftSidebar,
	//MinimalLayout,
	PresentationLayout,
} from './layout-blueprints';

// Example Pages

import Dashboard from './Containers/Dashboard';
import Overview from './example-pages/Overview';
import BpmnList from './Containers/Bpmn/BpmnList';
import Bpmn from './Containers/Bpmn/Bpmn';
import FormList from './Containers/FormBuilder/FormList';
import FormBuilder from './Containers/FormBuilder/FormBuilder';
import ThemeList from './Containers/ThemeDocs/ThemeList';
import DocsBuilder from './Containers/ThemeDocs/DocsBuilder';
import EmailList from './Containers/Email/EmailList';
import EmailBuilder from './Containers/Email/EmailBuilder';
import HtmlsList from './Containers/Htmls/HtmlsList';
import HtmlsBuilder from './Containers/Htmls/HtmlsBuilder';
import ProcedureList from './Containers/Procedure/ProcedureList';
import ProcedureDetails from './Containers/Procedure/ProcedureDetails';
import CompanyList from './Containers/Company/CompanyList';
import CompanyDetails from './Containers/Company/CompanyDetails';
import UserList from './Containers/User/UserList';
import UserDetails from './Containers/User/UserDetails';
import InterfaceList from './Containers/Interface/InterfaceList';
import InterfaceDetails from './Containers/Interface/InterfaceDetails';
import Profile from './Containers/Profile/ProfilePage';
import LogoutPage from './Containers/Logout';

import { Loading } from './utils/Loading';

const Homepage = lazy(() => import('./Containers/Login'));
const ResetPassword = lazy(() => import('./Containers/ResetPassword'));

const Routes = () => {
	const location = useLocation();
	const dispatch = useDispatch();
	const isAuth = useSelector(({ auth }) => auth.token !== null);

	const pageVariants = {
		initial: {
			opacity: 0,
		},
		in: {
			opacity: 1,
		},
		out: {
			opacity: 0,
		},
	};

	const pageTransition = {
		type: 'tween',
		ease: 'linear',
		duration: 0.3,
	};

	useEffect(() => {
		dispatch(authCheckState());
		// eslint-disable-next-line
	}, []);

	const SuspenseLoading = () => {
		const [show, setShow] = useState(false);
		useEffect(() => {
			let timeout = setTimeout(() => setShow(true), 300);
			return () => {
				clearTimeout(timeout);
			};
		}, []);

		return (
			<>
				<AnimatePresence>
					{show && (
						<motion.div
							key="loading"
							initial={{ opacity: 0 }}
							animate={{ opacity: 1 }}
							exit={{ opacity: 0 }}
							transition={{ duration: 0.4 }}
						>
							<div className="d-flex align-items-center flex-column vh-100 justify-content-center text-center py-3">
								<div className="d-flex align-items-center flex-column px-4">
									<ClimbingBoxLoader color={'#3c44b1'} loading={true} />
								</div>
								<div className="text-muted font-size-xl text-center pt-3">
									Please wait while we load the live preview examples
									<span className="font-size-lg d-block text-dark">
										This live preview instance can be slower than a real
										production build!
									</span>
								</div>
							</div>
						</motion.div>
					)}
				</AnimatePresence>
			</>
		);
	};

	return (
		<ThemeProvider theme={MuiTheme}>
			<AnimatePresence>
				<Suspense fallback={<SuspenseLoading />}>
					<Switch>
						<Redirect exact from="/" to="/Homepage" />
						<Route path={['/Homepage']}>
							<PresentationLayout>
								<Switch location={location} key={location.pathname}>
									<motion.div
										initial="initial"
										animate="in"
										exit="out"
										variants={pageVariants}
										transition={pageTransition}
									>
										<Route path="/Homepage" component={Homepage} />
									</motion.div>
								</Switch>
							</PresentationLayout>
						</Route>
						<Route path={['/password-reset/:token']}>
							<PresentationLayout>
								<Switch location={location} key={location.pathname}>
									<motion.div
										initial="initial"
										animate="in"
										exit="out"
										variants={pageVariants}
										transition={pageTransition}
									>
										<Route
											path="/password-reset/:token"
											component={ResetPassword}
										/>
									</motion.div>
								</Switch>
							</PresentationLayout>
						</Route>

						<Route
							path={[
								'/Dashboard',
								'/Overview',
								'/BpmnList',
								'/FormList',
								'/BpmnBuilder',
								'/FormBuilder',
								'/ThemeList',
								'/DocsBuilder',
								'/EmailList',
								'/EmailBuilder',
								'/HtmlsList',
								'/HtmlsBuilder',
								'/Procedure',
								'/Company',
								'/UserList',
								'/Interface',
								'/profile',
							]}
						>
							<LeftSidebar>
								<Switch location={location} key={location.pathname}>
									<motion.div
										initial="initial"
										animate="in"
										exit="out"
										variants={pageVariants}
										transition={pageTransition}
									>
										{isAuth ? (
											<>
												<Route path="/Dashboard" component={Dashboard} />
												<Route path="/Overview" component={Overview} />
												<Route path="/BpmnList" component={BpmnList} />
												<Route path="/FormList" component={FormList} />
												<Route path="/BpmnBuilder/:id" component={Bpmn} />
												<Route
													path="/FormBuilder/:id"
													component={FormBuilder}
												/>
												<Route path="/ThemeList" component={ThemeList} />
												<Route
													path="/DocsBuilder/:id"
													component={DocsBuilder}
												/>
												<Route path="/EmailList" component={EmailList} />
												<Route
													path="/EmailBuilder/:id"
													component={EmailBuilder}
												/>
												<Route path="/HtmlsList" component={HtmlsList} />
												<Route
													path="/HtmlsBuilder/:id"
													component={HtmlsBuilder}
												/>
												<Route
													path="/Procedure"
													component={ProcedureList}
													exact
												/>
												<Route
													path="/Procedure/:id"
													component={ProcedureDetails}
												/>
												<Route path="/Company" component={CompanyList} exact />
												<Route path="/Company/:id" component={CompanyDetails} />
												<Route path="/UserList" component={UserList} exact />
												<Route path="/UserList/:id" component={UserDetails} />
												<Route
													path="/Interface"
													component={InterfaceList}
													exact
												/>
												<Route
													path="/Interface/:id"
													component={InterfaceDetails}
												/>
												<Route path="/profile" component={Profile} />
											</>
										) : (
											<Loading />
										)}
									</motion.div>
								</Switch>
							</LeftSidebar>
						</Route>
						<Route path={['/logout']}>
							<LogoutPage />
						</Route>
					</Switch>
				</Suspense>
			</AnimatePresence>
		</ThemeProvider>
	);
};

export default Routes;
