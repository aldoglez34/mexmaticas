import React from "react";
import AuthUserContext from "./context";
import { connect } from "react-redux";
import { firebaseAuth } from "../firebase/firebase";
import { loginStudent, logoutStudent } from "../redux/actions/student";
import { AdminSpinner } from "../adminpages/components";
import { isEqual } from "lodash";
import API from "../utils/API";

const withNavigation = (Component) => {
  class WithNavigation extends React.Component {
    state = {
      navigation: null,
    };

    componentDidMount() {
      firebaseAuth.onAuthStateChanged((user) => {
        // authenticated users (students or teacher)
        if (user?.displayName) {
          const isUnverifiedStudent =
            !isEqual(user.displayName, "Teacher") && !user.emailVerified;

          const isVerifiedStudent =
            !isEqual(user.displayName, "Teacher") && user.emailVerified;

          const isTeacher = isEqual(user.displayName, "Teacher");

          if (isUnverifiedStudent)
            return this.setState({ navigation: "Guest" });

          // TODO: change this to verified
          // if (isVerifiedStudent) {
          if (isUnverifiedStudent) {
            // set user data to redux if needed
            if (!this.props.user) {
              API.fetchStudentByUID(user.uid).then((res) =>
                this.props.loginStudent({
                  _id: res.data._id,
                  email: res.data.email,
                  firstSurname: res.data.firstSurname,
                  name: res.data.name,
                  secondSurname: res.data.secondSurname,
                })
              );
            }
            // return navigation
            return this.setState({ navigation: "Student" });
          }

          if (isTeacher) return this.setState({ navigation: "Teacher" });
        }

        // not authenticated users
        // logout user from redux if needed
        if (this.props.user) this.props.logoutStudent();

        // return default navigation
        return this.setState({ navigation: "Guest" });
      });
    }

    render() {
      return this.state.navigation ? (
        <AuthUserContext.Provider value={this.state.navigation}>
          <Component {...this.props} />
        </AuthUserContext.Provider>
      ) : (
        <AdminSpinner />
      );
    }
  }

  const mapStateToProps = (state) => {
    return {
      user: state.student,
    };
  };

  const mapDispatchToProps = {
    loginStudent,
    logoutStudent,
  };

  return connect(mapStateToProps, mapDispatchToProps)(WithNavigation);
};

export default withNavigation;
