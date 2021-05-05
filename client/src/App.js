import React from "react";
import { BrowserRouter as Router } from "react-router-dom";
import Navigation from "./navigation";
import { withNavigation } from "./session";

const App = () => {
  return (
    <Router>
      <Navigation />
    </Router>
  );
};

export default withNavigation(App);
