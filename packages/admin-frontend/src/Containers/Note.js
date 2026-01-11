import React from "react";
import { Card, CardContent } from "@material-ui/core";
import tips from "../images/tips.svg";

export default function Note({ txt }) {
	return (
		<div className="my-center">
			<Card className="mb-5 card-box  Note">
				<div
					style={{
						display: "flex",
						placeContent: "center",
					}}
				>
					<img
						style={{
							height: "39px",
							marginTop: "-27px",
							zIndex: 9,
							position: "absolute",
							backgroundColor: "transparent",
						}}
						src={tips}
						alt="Tip"
					/>
				</div>
				<CardContent style={{ paddingLeft: "50px", paddingRight: "50px" }}>
					<div style={{ display: "flex", color: "#4a45a3", marginBottom: "0px" }}>
						<p style={{ fontWeight: "bold", marginRight: "5px", marginBottom: "0px" }}>Nota:</p>
						<p style={{ marginBottom: "0px" }}>{txt}</p>
					</div>
				</CardContent>
			</Card>
		</div>
	);
}
