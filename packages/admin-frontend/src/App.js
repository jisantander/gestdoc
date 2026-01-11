import React, { Component } from "react";
import { BrowserRouter } from "react-router-dom";
import configureStore from "./config/configureStore";
import { Provider } from "react-redux";
import Routes from "./Routes";
import ScrollToTop from "./utils/ScrollToTop";
import ErrorBoundary from "./layout-components/ErrorBoundary";
import "./assets/base.scss";
import "./Fonts";

//bpmn css
import "bpmn-js/dist/assets/diagram-js.css";
import "bpmn-js/dist/assets/bpmn-font/css/bpmn-embedded.css";

const store = configureStore();
class App extends Component {
	render() {
		return (
			<ErrorBoundary>
				<Provider store={store}>
					<BrowserRouter basename="/app/">
						<ScrollToTop>
							<Routes />
						</ScrollToTop>
					</BrowserRouter>
				</Provider>
    		</ErrorBoundary>
		);
	}
}

export default App;
