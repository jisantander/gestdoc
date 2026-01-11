import React from "react";
import { BrowserRouter } from "react-router-dom";
import configureStore from "./config/configureStore";
import { Provider } from "react-redux";
import Routes from "./Routes.js";
//import Footer from 'pages/Footer';
import ErrorBoundary from "./components/ErrorBoundary";

const store = configureStore();

function App() {
  return (
    <ErrorBoundary>
      <Provider store={store}>
        <div style={{ paddingBottom: "248px" }}>
          <BrowserRouter>
            <Routes />
          </BrowserRouter>
        </div>
      </Provider>
    </ErrorBoundary>
  );
}

export default App;
