import React from "react";
import { AuthUserContext } from "../session";
import GuestNavigation from "./GuestNavigation";
import StudentNavigation from "./StudentNavigation";
import AdminNavigation from "./AdminNavigation";

const Navigation = React.memo(() => (
  <AuthUserContext.Consumer>
    {(navigation) => {
      return navigation === "Student" ? (
        <StudentNavigation />
      ) : navigation === "Teacher" ? (
        <AdminNavigation />
      ) : (
        <GuestNavigation />
      );
    }}
  </AuthUserContext.Consumer>
));

export default Navigation;
