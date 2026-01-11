import React from "react";
import { FormControlLabel, Checkbox } from "@material-ui/core";

export default function PossibiltyBack({ element, handleChange, updatePropertie }) {
	return (
		<FormControlLabel
			control={
				<Checkbox
					id="back"
					checked={element.businessObject.back}
					onChange={(e) => {
						console.log(e);
						handleChange(e);
						updatePropertie(e.target.checked, "back");
					}}
					name="back"
					color="primary"
				/>
			}
			label="Es posible retroceder"
		/>
	);
}
