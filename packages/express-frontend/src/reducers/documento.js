import axios from "../utils/axios";
import updateObject from "../utils/updateObject";

const initialState = {
  documento: false,
  error: null,
  loading: false,
  email: false,
  id: false,
  bpmn: false,
  updated: false,
  before: null,
};

/**************************************************************************
 * Se definen los action types
 */

export const DOC_INIT = "DOC_INIT";
export const DOC_LOADING = "DOC_LOADING";
export const DOC_SUCCESS = "DOC_SUCCESS";
export const DOC_FAIL = "DOC_FAIL";
export const DOC_SET = "DOC_SET";
export const EMAIL_SET = "EMAIL_SET";
export const DOC_DATA = "DOC_DATA";
export const DOC_UPDATED = "DOC_UPDATED";
export const DOC_BEFORE = "DOC_BEFORE";
export const DOC_REVIEWS = "DOC_REVIEWS";
export const DOC_REVIEWS_RESET = "DOC_REVIEWS_RESET";
export const DOC_ECERT = "DOC_ECERT";

/**************************************************************************
 * Se definen los actions
 */

export const docStart = () => {
  return {
    type: DOC_INIT,
  };
};

export const docLoading = () => {
  return {
    type: DOC_LOADING,
  };
};

export const setDocError = () => {
  return { type: DOC_FAIL };
};

export const setDocument = (data) => {
  return {
    type: DOC_SET,
    payload: data,
  };
};

export const setDocEmail = (data) => {
  return {
    type: EMAIL_SET,
    payload: data,
  };
};

export const setData = (data) => {
  return { type: DOC_DATA, payload: data };
};

export const setReviews = (data) => {
  return { type: DOC_REVIEWS, payload: data };
};

export const setEcert = (data) => {
  return { type: DOC_ECERT, payload: data };
};

export const resetReviews = () => {
  return { type: DOC_REVIEWS_RESET };
};

export const setUpdated = () => {
  return { type: DOC_UPDATED, payload: { updated: +new Date() } };
};

export const setBefore = (data) => {
  return { type: DOC_BEFORE, payload: data };
};

export const getDocumento = (transaction) => {
  return async (dispatch) => {
    try {
      const { data } = await axios.get(`/api/documento/${transaction}`);
      dispatch(setData(data));
    } catch (err) {
      dispatch(setDocError());
    }
  };
};

export const setNextStage = (transaction, current, dataStage) => {
  return async (dispatch) => {
    try {
      dispatch(docLoading());

      //Aqui a dataStage debo poder meter aparte de form otra propiedad con los title de cada dato

      //debo crear una funcion donde me tome todos los title de propertied del nested del formulario a generar.

      /*
      form_names: {key : title}
      */

      const { data } = await axios.put(`/api/documento/${transaction}`, {
        current,
        data: dataStage,
      });
      dispatch(setData(data));
      dispatch(setUpdated());
      dispatch(setBefore(null));
    } catch (err) {
      dispatch(setDocError());
    }
  };
};

export const returning = (data) => {
  return async (dispatch, getState) => {
    try {
      /*const { documento } = getState();
      const { data: procedure } = await axios.get(`/api/documento/${documento._id}`);*/
      dispatch(setBefore(data));
      dispatch(setUpdated());
    } catch (err) {
      dispatch(setDocError());
    }
  };
};

/**************************************************************************
 * Se definen los reducers
 */

const reducerDocStart = (state, action) => {
  return initialState;
};

const reducerDocLoading = (state, action) => {
  return updateObject(state, {
    error: false,
    loading: true,
  });
};

const reducerDocFail = (state, action) => {
  return updateObject(state, {
    error: true,
    loading: false,
  });
};

const reducerDocSet = (state, action) => {
  return updateObject(state, {
    error: null,
    loading: false,
    documento: action.payload,
    bpmn: action.payload.id,
  });
};

const reducerEmailSet = (state, action) => {
  return updateObject(state, {
    error: null,
    loading: false,
    email: action.payload,
  });
};

const reducerDocData = (state, action) => {
  return updateObject(state, {
    error: null,
    loading: false,
    ...action.payload,
  });
};

const reducerDocUpdated = (state, action) => {
  return updateObject(state, {
    ...initialState,
    error: null,
    loading: true,
    before: null,
    ...action.payload,
  });
};

const reducerDocBefore = (state, action) => {
  return updateObject(state, {
    before: action.payload,
  });
};

const reducerDocReviews = (state, action) => {
  return updateObject(state, {
    reviews: action.payload,
  });
};

const reducerDocReviewsReset = (state, action) => {
  return updateObject(state, {
    reviews: [],
  });
};

const reducerDocEcert = (state, action) => {
  return updateObject(state, {
    ecert: action.payload,
  });
};

/**************************************************************************
 * Core del reducer
 */

export default function reducer(state = initialState, action) {
  switch (action.type) {
    case DOC_INIT:
      return reducerDocStart(state, action);
    case DOC_LOADING:
      return reducerDocLoading(state, action);
    case DOC_FAIL:
      return reducerDocFail(state, action);
    case DOC_SET:
      return reducerDocSet(state, action);
    case EMAIL_SET:
      return reducerEmailSet(state, action);
    case DOC_DATA:
      return reducerDocData(state, action);
    case DOC_UPDATED:
      return reducerDocUpdated(state, action);
    case DOC_BEFORE:
      return reducerDocBefore(state, action);
    case DOC_REVIEWS:
      return reducerDocReviews(state, action);
    case DOC_REVIEWS_RESET:
      return reducerDocReviewsReset(state, action);
    case DOC_ECERT:
      return reducerDocEcert(state, action);
    default:
      break;
  }
  return state;
}
