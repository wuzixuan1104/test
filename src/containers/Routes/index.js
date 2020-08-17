import React from "react";
import { Router, Route, Redirect } from "react-router-dom";

import Home from "../HomePage";
import history from "./history";
import PropTypes from 'prop-types';

const Routes = () => (
  <Router history={history} component={Home}>
    <div>
      <PrivateRoute exact path="/" component={Home} />
      <Route path="/home" component={Home} />
    </div>
  </Router>
);

const PrivateRoute = ({ component: Component, ...rest }) => (
  <Route
    {...rest}
    render={props =>
      localStorage.getItem("user") ? (
        <Component {...props} />
      ) : (
        <Redirect
          to={{ pathname: "/", state: { from: props.location } }}
        />
      )
    }
  />
);

PrivateRoute.propTypes = {
  component: PropTypes.any
  // location: PropTypes.any
};

export default Routes;
