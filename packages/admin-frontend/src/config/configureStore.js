import * as reduxModule from 'redux';
import { createStore, combineReducers, applyMiddleware, compose } from 'redux';
import thunk from 'redux-thunk';
import reducers from '../reducers';

export default function configureStore() {
	reduxModule.__DO_NOT_USE__ActionTypes.REPLACE = '@@redux/INIT';

	const composeEnhancers =
		process.env.NODE_ENV !== 'production' &&
		typeof window === 'object' &&
		window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__
			? window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__({
					// Specify extension’s options like name, actionsBlacklist, actionsCreators, serialize...
			  })
			: compose;

	const enhancer = composeEnhancers(applyMiddleware(thunk));
	return createStore(
		combineReducers({
			...reducers,
		}),
		enhancer
	);
}
