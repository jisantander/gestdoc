import React, { useState } from "react";
import { useSelector } from "react-redux";

import clsx from "clsx";

import { Container, Button } from "@material-ui/core";

import { NavLink } from "react-router-dom";

export default function LivePreviewExample() {
  const isAuth = useSelector(({ auth }) => auth.token !== null);
  const [collapse, setCollapse] = useState(false);
  const toggle = () => setCollapse(!collapse);

  return (
    <>
      <Container style={{ marginTop: "10px" }}>
        <div>
          <div className="app-nav-logo">
            <NavLink to="/Homepage">
              <div className="app-nav-logo--text">
                <span>GestDoc</span>
              </div>
            </NavLink>
          </div>
          <div className="header-nav-actions flex-grow-0 flex-lg-grow-1">
            <span className="d-none d-lg-block">
              {isAuth ? (
                <Button
                  component={NavLink}
                  to="/orders"
                  className="rounded-sm text-nowrap font-size-xs font-weight-bold text-uppercase shadow-second-sm btn-warning"
                >
                  Ver mis Trámites
                </Button>
              ) : (
                <Button
                  component={NavLink}
                  to="/signin"
                  className="rounded-sm text-nowrap font-size-xs font-weight-bold text-uppercase shadow-second-sm btn-warning"
                >
                  Inicia sesión
                </Button>
              )}
            </span>
          </div>
        </div>
      </Container>
      <div className={clsx("collapse-page-trigger", { "is-active": collapse })} onClick={toggle} />
    </>
  );
}
