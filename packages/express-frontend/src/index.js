import React from "react";
import { createRoot } from "react-dom/client";
import * as Sentry from "@sentry/react";
import "./index.css";
import App from "./App";
import reportWebVitals from "./reportWebVitals";
import Footer from "pages/Footer";

if (process.env.REACT_APP_ENV === "production") {
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
const container = document.getElementById("root");
const root = createRoot(container);
root.render(
  <React.StrictMode>
    <App />
    <Footer />
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
