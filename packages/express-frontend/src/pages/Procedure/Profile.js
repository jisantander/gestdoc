import React from "react";
import Button from "@material-ui/core/Button";
import Menu from "@material-ui/core/Menu";
import MenuItem from "@material-ui/core/MenuItem";
import { useSelector } from "react-redux";
import Avatar from "@material-ui/core/Avatar";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import { authLogout } from "../../reducers/auth";
import { useDispatch } from "react-redux";

export default function Profile() {
  const [anchorEl, setAnchorEl] = React.useState(null);

  const { name, surname, /*email, Profile,*/ picture } = useSelector(({ auth }) => auth);

  const dispatch = useDispatch();

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const openDashboard = () => {
    //href  Open DASHBOARD
    window.open("https://admin.gestdoc.cl/");
    setAnchorEl(null);
  };

  const closeSesion = () => {
    //Sesion

    dispatch(authLogout());
    setAnchorEl(null);
  };

  return (
    <div className="avatar-profile">
      <Button
        style={{ marginTop: "25px", marginRight: "55px" }}
        color="secondary"
        aria-controls="simple-menu"
        aria-haspopup="true"
        onClick={handleClick}
      >
        <div>
          <h3 style={{ color: "#fff", margin: "0px", marginRight: "15px" }}>{name + " " + surname}</h3>
          <h5 style={{ color: "#fff", margin: "0px" }}>
            opciones <ExpandMoreIcon style={{ marginBottom: "-8px" }} />{" "}
          </h5>
        </div>
        <Avatar style={{ left: -7 }} alt={`foto de perfil ${name + " " + surname}`} src={picture} />
      </Button>
      <Menu id="simple-menu" anchorEl={anchorEl} keepMounted open={Boolean(anchorEl)} onClose={handleClose}>
        <MenuItem onClick={openDashboard}>Abrir mi dashboard</MenuItem>
        <MenuItem onClick={closeSesion}>Cerrar sesión </MenuItem>
      </Menu>
    </div>
  );
}
