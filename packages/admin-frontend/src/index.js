import React from 'react';
import ReactDOM from 'react-dom';
import * as Sentry from '@sentry/react';
import { Integrations } from '@sentry/tracing';
import App from './App';
import * as serviceWorker from './serviceWorker';

if (process.env.REACT_APP_ENV === 'production') {
	Sentry.init({
		dsn: process.env.REACT_APP_SENTRY,
		integrations: [new Integrations.BrowserTracing()],
		autoSessionTracking: false,

		// We recommend adjusting this value in production, or using tracesSampler
		// for finer control
		tracesSampleRate: 1.0,
	});
}

ReactDOM.render(<App />, document.getElementById('root'));

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
