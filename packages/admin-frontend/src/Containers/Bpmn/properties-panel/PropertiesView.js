import React, { Component } from "react";
import "./PropertiesView.css";
import PropertiesHandler from "./PropertiesHandler";

export default class PropertiesView extends Component {
	constructor(props) {
		super(props);
		this.state = {
			selectedElements: [],
			element: null,
		};
	}

	componentDidMount() {
		const { modeler } = this.props;

		modeler.on("selection.changed", (e) => {
			this.setState({
				selectedElements: e.newSelection,
				element: e.newSelection[0],
			});
		});

		modeler.on("element.changed", (e) => {
			const { element } = e;
			const { element: currentElement } = this.state;

			if (!currentElement) {
				return;
			}
			// update panel, if currently selected element changed
			if (element.id === currentElement.id) {
				this.setState({
					element,
				});
			}
		});
	}

	render() {
		const { modeler, form, docs, emails, htmls, users } = this.props;
		const { selectedElements, element } = this.state;
		return (
			<div>
				{selectedElements.length === 1 && (
					<PropertiesHandler
						form={form}
						docs={docs}
						emails={emails}
						modeler={modeler}
						element={element}
						htmls={htmls}
						users={users}
					/>
				)}
				{selectedElements.length === 0 && (
					<span>Por favor selecciona un elemento para asignarle una funcionalidad.</span>
				)}
				{selectedElements.length > 1 && <span>Por favor selecciona un solo elemento.</span>}
			</div>
		);
	}
}
