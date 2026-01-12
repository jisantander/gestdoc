import React from 'react';
import { createRoot } from 'react-dom/client';
import * as Sentry from '@sentry/react';
import App from './App';
import * as serviceWorker from './serviceWorker';

if (process.env.REACT_APP_ENV === 'production') {
	Sentry.init({
		dsn: process.env.REACT_APP_SENTRY,
		integrations: [
			new Sentry.BrowserTracing(),
			new Sentry.Replay()
		],
		autoSessionTracking: false,
		tracesSampleRate: 1.0,
		replaysSessionSampleRate: 0.1,
		replaysOnErrorSampleRate: 1.0,
	});
}

// React 18: createRoot instead of ReactDOM.render
const container = document.getElementById('root');
const root = createRoot(container);
root.render(
	<React.StrictMode>
		<App />
	</React.StrictMode>
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
