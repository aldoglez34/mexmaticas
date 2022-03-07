import React from "react";
import { BrowserRouter as Router } from "react-router-dom";
import Navigation from "./navigation";
import { withNavigation } from "./session";
import { APP_VERSION } from "./constants/constants";

const App = () => {
  console.log(`RELEASE v${APP_VERSION}`);
  return (
    <Router>
      <Navigation />
    </Router>
  );
};

export default withNavigation(App);
