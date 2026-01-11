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

export const authSuccess = (token, email, name, surname, picture) => {
  return {
    type: AUTH_SUCCESS,
    token: token,
    email,
    name,
    surname,
    picture,
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
      url: "/api/auth/signin",
      method: "POST",
      data: authData,
    })
      .then((response) => {
        dispatch(
          authSuccess(response.data.token, email, response.data.name, response.data.surname, response.data.picture)
        );
        dispatch(updateToken(response.data.token));
      })
      .catch((err) => {
        dispatch(authFail(err));
      });
  };
};

export const authCheckState = () => {
  return (dispatch) => {
    dispatch(authStart());
    const token = localStorage.getItem("token");
    if (!token) {
      dispatch(logout());
    } else {
      axios({
        url: "/api/auth/verify",
        method: "POST",
        data: { token },
      })
        .then((response) => {
          dispatch(
            authSuccess(token, response.data.email, response.data.name, response.data.surname, response.data.picture)
          );
          dispatch(updateToken(token));
        })
        .catch((err) => {
          dispatch(authFail(err));
        });
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
      url: "/api/auth/signin",
      method: "POST",
      data: userData,
    })
      .then((response) => {
        dispatch(
          authSuccess(
            response.data.token,
            userData.email,
            response.data.name,
            response.data.surname,
            response.data.picture
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
      url: "/api/auth/signup",
      method: "POST",
      data: userData,
    })
      .then((response) => {
        alert("Usuario creado correctamente, revise su bandeja de entrada");
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
    delete axios.defaults.headers.common.Authorization;
    dispatch(authLogoutSession());
  };
};

export const authGoogle = (googleData) => {
  return (dispatch) => {
    dispatch(authStart());
    axios({
      url: "/api/auth/google",
      method: "POST",
      data: googleData,
    })
      .then((response) => {
        dispatch(
          authSuccess(
            response.data.token,
            googleData.profileObj.email,
            response.data.name,
            response.data.surname,
            response.data.picture
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
    picture: action.picture,
    error: null,
    loading: false,
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
    token: null,
    email: null,
    name: null,
    surname: null,
    picture: null,
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
    picture: null,
    error: null,
    loading: false,
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
