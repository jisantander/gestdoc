import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { useHistory } from "react-router-dom";

import { authLogout, deleteSession } from "../reducers/auth";

export default function Logout() {
	const dispatch = useDispatch();
	const history = useHistory();

	useEffect(() => {
		dispatch(deleteSession());
		dispatch(authLogout());
		history.push("/");
		// eslint-disable-next-line
	}, []);
	return null;
}
