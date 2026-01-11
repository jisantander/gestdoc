const API =
	(process.env.REACT_APP_ENV === 'development'
		? process.env.REACT_APP_LOCAL
		: process.env.REACT_APP_API) + 'api/';

export default API;
