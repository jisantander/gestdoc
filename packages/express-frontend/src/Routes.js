import React, { useEffect } from "react";
import { ThemeProvider } from "@material-ui/styles";
import MuiTheme from "./theme";
import { Switch, Route, Redirect, useLocation } from "react-router-dom";
import Homepage from "./pages/Home/Homepage";
import PageError404 from "./pages/PageError404";
import DocumentScanned from "./pages/DocumentScanned";
import ProcedurePage from "./pages/Procedure";
import SignupPage from "./pages/Signup";
import LogoutPage from "./pages/Logout";
import OrdersPage from "./pages/Orders";
import ProfilePage from "./pages/Profile";
import ShortPage from "./pages/Short";
import QuickCreatePage from "./pages/QuickCreate";
import { authCheckState } from "./reducers/auth";
import { useDispatch } from "react-redux";
import Validation from "pages/Validation";
import ChangePassword from "pages/Procedure/Change_password";

export default function Routes() {
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(authCheckState());
    // eslint-disable-next-line
  }, []);

  const location = useLocation();
  return (
    <ThemeProvider theme={MuiTheme}>
      <Switch>
        <Redirect exact from="/" to="/Homepage" />
        <Route path="/Homepage" component={Homepage} />
        <Route path={["/signaturedoc/:transaction"]}>
          <Switch location={location} key={location.pathname}>
            <DocumentScanned />
          </Switch>
        </Route>
        <Route path={["/procedure/:transaction/:participant", "/procedure/:transaction"]}>
          <Switch location={location} key={location.pathname}>
            <ProcedurePage />
          </Switch>
        </Route>
        <Route path={["/signup"]}>
          <Switch location={location} key={location.pathname}>
            <SignupPage />
          </Switch>
        </Route>
        <Route path={["/orders"]}>
          <Switch location={location} key={location.pathname}>
            <OrdersPage />
          </Switch>
        </Route>
        <Route path={["/profile"]}>
          <Switch location={location} key={location.pathname}>
            <ProfilePage />
          </Switch>
        </Route>
        <Route path={["/p/:short"]}>
          <Switch location={location} key={location.pathname}>
            <ShortPage />
          </Switch>
        </Route>
        <Route path={["/q/:short"]}>
          <Switch location={location} key={location.pathname}>
            <QuickCreatePage />
          </Switch>
        </Route>
        <Route path={["/logout"]}>
          <Switch location={location} key={location.pathname}>
            <LogoutPage />
          </Switch>
        </Route>
        <Route path={["/verification_email/:slug"]}>
          <Switch location={location} key={location.pathname}>
            <Validation />
          </Switch>
        </Route>
        <Route path={["/forgot_email/:slug"]}>
          <Switch location={location} key={location.pathname}>
            <ChangePassword />
          </Switch>
        </Route>
        <Route component={PageError404} />
      </Switch>
    </ThemeProvider>
  );
}
