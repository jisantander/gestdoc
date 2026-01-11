import React from "react";
import { FormControlLabel, Checkbox } from "@material-ui/core";

export default function IsNotificable({ element, handleChange, updatePropertie }) {
	return (
		<FormControlLabel
			control={
				<Checkbox
					id="notification"
					checked={element.businessObject.notification}
					onChange={(e) => {
						console.log(e);
						handleChange(e);
						updatePropertie(e.target.checked, "notification");
					}}
					name="notification"
					color="primary"
				/>
			}
			label="Notificar al finalizar"
		/>
	);
}
