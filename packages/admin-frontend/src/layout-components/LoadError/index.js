import React from 'react';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Grid, Button, Tooltip } from '@material-ui/core';

import illustration1 from '../../assets/images/illustrations/pack4/505.svg';

export default function LoadError() {
	return (
		<>
			<div className="app-wrapper bg-white">
				<div className="app-main">
					<div className="app-content p-0">
						<div className="app-inner-content-layout--main">
							<div className="flex-grow-1 w-100 d-flex align-items-center">
								<div className="bg-composed-wrapper--content">
									<div className="hero-wrapper bg-composed-wrapper min-vh-100">
										<div className="flex-grow-1 w-100 d-flex align-items-center">
											<Grid
												item
												lg={6}
												md={9}
												className="px-4 px-lg-0 mx-auto text-center text-black"
											>
												<img
													src={illustration1}
													className="w-50 mx-auto d-block my-5 img-fluid"
													alt="..."
												/>

												<h3 className="font-size-xxl line-height-sm font-weight-light d-block px-3 mb-3 text-black-50">
													Hubo un error de carga en el servidor.
												</h3>
												<p>
													Notifícale a tu administrador de sistemas al respecto.
													Estamos trabajando en solucionar este incidente y toda
													información nos ayuda :)
												</p>
											</Grid>
										</div>
										<div className="hero-footer py-4">
											<Tooltip title="Facebook" arrow>
												<Button
													className="btn-link font-size-lg rounded-sm d-40 btn-icon text-facebook btn-animated-icon"
													href="#/"
													onClick={(e) => e.preventDefault()}
												>
													<span className="btn-wrapper--icon d-flex">
														<FontAwesomeIcon icon={['fab', 'facebook']} />
													</span>
												</Button>
											</Tooltip>
											<Tooltip title="Twitter" arrow>
												<Button
													className="btn-link font-size-lg rounded-sm d-40 btn-icon text-twitter btn-animated-icon"
													href="#/"
													onClick={(e) => e.preventDefault()}
												>
													<span className="btn-wrapper--icon d-flex">
														<FontAwesomeIcon icon={['fab', 'twitter']} />
													</span>
												</Button>
											</Tooltip>
											<Tooltip title="Google" arrow>
												<Button
													className="btn-link font-size-lg rounded-sm d-40 btn-icon text-google btn-animated-icon"
													href="#/"
													onClick={(e) => e.preventDefault()}
												>
													<span className="btn-wrapper--icon d-flex">
														<FontAwesomeIcon icon={['fab', 'google']} />
													</span>
												</Button>
											</Tooltip>
											<Tooltip title="Instagram" arrow>
												<Button
													className="btn-link font-size-lg rounded-sm d-40 btn-icon text-instagram btn-animated-icon"
													href="#/"
													onClick={(e) => e.preventDefault()}
												>
													<span className="btn-wrapper--icon d-flex">
														<FontAwesomeIcon icon={['fab', 'instagram']} />
													</span>
												</Button>
											</Tooltip>
										</div>
									</div>
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>
		</>
	);
}
