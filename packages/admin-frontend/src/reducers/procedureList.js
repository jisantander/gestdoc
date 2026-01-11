import updateObject from "../utils/updateObject";

/**************************************************************************
 * Se definen los action types
 */

export const PROCEDURE_LIST = "PROCEDURE_LIST";

/**************************************************************************
 * Se definen los actions
 */

export const setProcedureList = (procedures) => {
	return {
		type: PROCEDURE_LIST,
		procedures: procedures,
	};
};

/**************************************************************************
 * Se definen los reducers
 */

const reducerProcedureList = (state, action) => {
	return updateObject(state, { procedures: action.procedures });
};

/**************************************************************************
 * Core del reducer
 */

export default function reducer(
	state = {
		procedures: [],
	},
	action
) {
	switch (action.type) {
		case PROCEDURE_LIST:
			return reducerProcedureList(state, action);
		default:
			break;
	}
	return state;
}
