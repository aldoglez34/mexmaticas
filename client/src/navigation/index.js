import React from "react";
import { AuthUserContext } from "../session";
import GuestNavigation from "./GuestNavigation";
import StudentNavigation from "./StudentNavigation";
import AdminNavigation from "./AdminNavigation";
import { isEqual } from "lodash";

const Navigation = () => (
  <AuthUserContext.Consumer>
    {(navigation) => {
      // console.log("navigation", navigation);
      if (isEqual(navigation, "Student")) return <StudentNavigation />;
      if (isEqual(navigation, "Teacher")) return <AdminNavigation />;
      if (isEqual(navigation, "Guest")) return <GuestNavigation />;
    }}
  </AuthUserContext.Consumer>
);

export default Navigation;
