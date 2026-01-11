import axios from "../utils/axios";
import updateObject from "../utils/updateObject";

/**************************************************************************
 * Se definen los action types
 */

export const AUTH_START = "AUTH_START";
export const AUTH_SUCCESS = "AUTH_SUCCESS";
export const AUTH_FAIL = "AUTH_FAIL";
export const AUTH_LOGOUT = "AUTH_LOGOUT";
export const AUTH_TOKEN = "AUTH_TOKEN";

/**************************************************************************
 * Se definen los actions
 */

export const authStart = () => {
	return {
		type: AUTH_START,
	};
};

export const authSuccess = (token, email, name, surname, routes, userId, company, companyData, role, admin) => {
	return {
		type: AUTH_SUCCESS,
		token: token,
		email,
		name,
		surname,
		routes,
		userId,
		company,
		companyData,
		role,
		admin,
	};
};

export const authFail = (error) => {
	return {
		type: AUTH_FAIL,
		error: error,
	};
};

export const logout = () => {
	localStorage.removeItem("token");
	return {
		type: AUTH_LOGOUT,
	};
};

export const auth = (email, password) => {
	return (dispatch) => {
		dispatch(authStart());
		const authData = {
			email: email,
			password: password,
			returnSecureToken: true,
		};
		axios({
			url: "api/auth/signin",
			method: "POST",
			data: authData,
		})
			.then((response) => {
				dispatch(
					authSuccess(
						response.data.token,
						email,
						response.data.user.name,
						response.data.user.surname,
						response.data.user.routes,
						response.data.user._id,
						response.data.user.company,
						response.data.user.companyData,
						response.data.user.role,
						response.data.user.admin
					)
				);
				dispatch(updateToken(response.data.token));
			})
			.catch((err) => {
				dispatch(authFail(err));
			});
	};
};

export const deleteSession = () => {
	return (dispatch) => {
		dispatch(authSuccess(null, null, null, null, [], null, null));
		dispatch(updateToken(null));
	};
};

export const authCheckState = () => {
	return async (dispatch) => {
		dispatch(authStart());
		const token = localStorage.getItem("token");
		if (!token) {
			dispatch(logout());
		} else {
			try {
				const { data } = await axios({
					url: "api/verify",
					method: "POST",
					data: { token },
				});
				dispatch(updateToken(token));
				dispatch(
					authSuccess(
						token,
						data.email,
						data.name,
						data.surname,
						data.routes,
						data.sub,
						data.company,
						data.companyData,
						data.role,
						data.admin
					)
				);
			} catch (err) {
				dispatch(authFail(err));
			}
		}
	};
};

export const updToken = (token) => {
	return {
		type: AUTH_TOKEN,
		token: token,
	};
};

export const updateToken = (token) => {
	return (dispatch) => {
		localStorage.setItem("token", token);
		axios.defaults.headers.common["Authorization"] = token;
		axios.defaults.headers.common.Authorization = token;
		dispatch(updToken(token));
	};
};

export const signin = (userData) => {
	return (dispatch) => {
		dispatch(authStart());
		axios({
			url: "api/login",
			method: "POST",
			data: userData,
		})
			.then((response) => {
				dispatch(
					authSuccess(
						response.data.token,
						userData.email,
						response.data.user.name,
						response.data.user.surname,
						response.data.user.routes,
						response.data.user._id,
						response.data.user.company,
						response.data.user.companyData,
						response.data.user.role,
						response.data.user.admin
					)
				);
				dispatch(updateToken(response.data.token));
			})
			.catch((err) => {
				if (err) {
					dispatch(authFail(err));
				}
			});
	};
};

export const signup = (userData) => {
	return (dispatch) => {
		dispatch(authStart());
		axios({
			url: "api/auth/signup",
			method: "POST",
			data: userData,
		})
			.then((response) => {
				dispatch(
					authSuccess(
						response.data.token,
						userData.email,
						userData.name,
						userData.surname,
						userData.routes,
						userData._id,
						userData.company,
						userData.companyData,
						userData.role,
						userData.admin
					)
				);
				dispatch(updateToken(response.data.token));
			})
			.catch((err) => {
				if (err) {
					dispatch(authFail(err));
				}
			});
	};
};

export const authLogoutSession = () => {
	return {
		type: AUTH_LOGOUT,
	};
};

export const authLogout = () => {
	return (dispatch) => {
		localStorage.removeItem("token");
		localStorage.removeItem("proc_list");

		delete axios.defaults.headers.common.Authorization;
		dispatch(authLogoutSession());
	};
};

export const authGoogle = (googleData) => {
	return (dispatch) => {
		dispatch(authStart());
		axios({
			url: "api/google_auth",
			method: "POST",
			data: googleData,
		})
			.then((response) => {
				console.log(response);
				dispatch(
					authSuccess(
						response.data.token,
						googleData.profileObj.email,
						response.data.user.name,
						response.data.user.surname,
						response.data.user.routes,
						response.data.user._id,
						response.data.user.company,
						response.data.user.role
					)
				);
				dispatch(updateToken(response.data.token));
			})
			.catch((err) => {
				if (err) {
					dispatch(authFail(err));
				}
			});
	};
};

/**************************************************************************
 * Se definen los reducers
 */

const reducerAuthStart = (state, action) => {
	return updateObject(state, { error: null, loading: true });
};

const reducerAuthSuccess = (state, action) => {
	return updateObject(state, {
		token: action.token,
		email: action.email,
		name: action.name,
		surname: action.surname,
		routes: action.routes,
		error: null,
		loading: false,
		userId: action.userId,
		company: action.company,
		companyData: action.companyData,
		role: action.role,
		admin: action.admin,
	});
};

const reducerAuthFail = (state, action) => {
	return updateObject(state, {
		error: action.error,
		loading: false,
	});
};

const reducerAuthLogout = (state, action) => {
	return updateObject(state, {
		loading: false,
		token: null,
		email: null,
		name: null,
		surname: null,
		routes: [],
		userId: null,
		company: null,
		role: null,
	});
};

const reducerUpdateToken = (state, action) => {
	return updateObject(state, {
		token: action.token,
	});
};

/**************************************************************************
 * Core del reducer
 */

export default function reducer(
	state = {
		token: null,
		email: null,
		name: null,
		surname: null,
		userId: null,
		company: null,
		role: null,
		routes: [],
		error: null,
		loading: true,
	},
	action
) {
	switch (action.type) {
		case AUTH_START:
			return reducerAuthStart(state, action);
		case AUTH_SUCCESS:
			return reducerAuthSuccess(state, action);
		case AUTH_FAIL:
			return reducerAuthFail(state, action);
		case AUTH_LOGOUT:
			return reducerAuthLogout(state, action);
		case AUTH_TOKEN:
			return reducerUpdateToken(state, action);
		default:
			break;
	}
	return state;
}
