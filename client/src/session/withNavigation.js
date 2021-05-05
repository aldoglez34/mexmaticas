import React from "react";
import AuthUserContext from "./context";
import { connect } from "react-redux";
import { firebaseAuth } from "../firebase/firebase";
import { logoutStudent } from "../redux/actions/student";
import { AdminSpinner } from "../adminpages/components";

// higher order component
const withNavigation = (Component) => {
  class WithNavigation extends React.Component {
    state = {
      navigation: null,
    };

    componentDidMount() {
      firebaseAuth.onAuthStateChanged((fbUser) => {
        fbUser
          ? this.setState({ navigation: fbUser.displayName })
          : this.props.user
          ? this.setState({ navigation: "Guest" }, () =>
              this.props.logoutStudent()
            )
          : this.setState({ navigation: "Guest" });
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
    logoutStudent,
  };

  return connect(mapStateToProps, mapDispatchToProps)(WithNavigation);
};

export default withNavigation;
