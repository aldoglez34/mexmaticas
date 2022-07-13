import React, { useCallback, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { isEqual } from "lodash";
import {
  AdminNavigation,
  GuestNavigation,
  StudentNavigation,
  TeacherNavigation,
} from "./navigation";
import { AdminSpinner } from "./components";
import { fetchStudentByUID } from "./services";
import { firebaseAuth } from "./firebase/firebase";
import { loginStudent, logoutStudent } from "./redux/actions/student";
import { USERS } from "./utils/constants";

const App = () => {
  const [navigation, setNavigation] = useState();

  const reduxStudent = useSelector((state) => state.student);

  const dispatch = useDispatch();

  const handleIsGuest = useCallback(() => {
    // logout student/teacher from redux if needed
    if (reduxStudent) dispatch(logoutStudent());
    setNavigation(USERS.GUEST);
  }, [dispatch, reduxStudent]);

  const logoutUser = useCallback(() => {
    if (reduxStudent) dispatch(logoutStudent());
    setNavigation(USERS.GUEST);
  }, [dispatch, reduxStudent]);

  const handleIsStudent = useCallback(
    (emailVerified, uid) => {
      if (!emailVerified) {
        logoutUser();
        return;
      }

      if (emailVerified) {
        if (!reduxStudent)
          fetchStudentByUID(uid).then(({ data }) =>
            dispatch(
              loginStudent({
                _id: data._id,
                email: data.email,
                firstSurname: data.firstSurname,
                isDeleted: data.isDeleted,
                name: data.name,
                secondSurname: data.secondSurname,
              })
            )
          );
        setNavigation(USERS.STUDENT);
      }
    },
    [dispatch, logoutUser, reduxStudent]
  );

  const handleIsTeacher = useCallback(() => setNavigation(USERS.TEACHER), []);

  const handleIsAdmin = useCallback(() => setNavigation(USERS.ADMIN), []);

  useEffect(() => {
    firebaseAuth.onAuthStateChanged(async (user) => {
      if (reduxStudent?.isDeleted) {
        alert("Ocurrió un error.");
        firebaseAuth.signOut();
        logoutUser();
        return;
      }

      const { displayName, uid, emailVerified } = user || {};

      // guest would be true if no displayName returned in the user, which means no active session
      const isGuest = !displayName;
      // these two below are pretty straight forward, if it's "Teacher" or "Admin"
      const isTeacher = isEqual(displayName, USERS.TEACHER);
      const isAdmin = isEqual(displayName, USERS.ADMIN);
      // student would be true only if there's a displayName, which means there's an active session
      // and displayName isn't "Teacher" or "Admin", usually for students the displayName is their actual name
      // the purpose of this is customizing the emails with their full names
      const isStudent = (displayName && !isTeacher && !isAdmin) || false;

      switch (true) {
        case isGuest:
          handleIsGuest();
          break;
        case isStudent:
          handleIsStudent(emailVerified, uid);
          break;
        case isTeacher:
          handleIsTeacher();
          break;
        case isAdmin:
          handleIsAdmin();
          break;
        default:
          handleIsGuest();
          break;
      }
    });
  }, [
    handleIsAdmin,
    handleIsGuest,
    handleIsStudent,
    handleIsTeacher,
    logoutUser,
    reduxStudent,
  ]);

  const getNavigation = () => {
    if (isEqual(navigation, USERS.GUEST)) return <GuestNavigation />;
    if (isEqual(navigation, USERS.STUDENT)) return <StudentNavigation />;
    if (isEqual(navigation, USERS.TEACHER)) return <TeacherNavigation />;
    if (isEqual(navigation, USERS.ADMIN)) return <AdminNavigation />;
  };

  return navigation ? getNavigation() : <AdminSpinner />;
};

export default App;
