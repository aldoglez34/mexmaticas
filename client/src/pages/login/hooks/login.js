import { useState } from "react";
import { firebaseAuth } from "../../../firebase/firebase";
import API from "../../../utils/API";
import { useSelector } from "react-redux";
import { isEqual } from "lodash";
import fbApp from "firebase/app";

export const useLoginUser = () => {
  const [isError, setIsError] = useState(false);

  const loginUser = async (values) => {
    try {
      // set persistence in firebase
      await firebaseAuth.setPersistence(fbApp.auth.Auth.Persistence.LOCAL);

      // sign in user in firebase
      await firebaseAuth.signInWithEmailAndPassword(
        values.email,
        values.password
      );

      // fetch user info from database
      //   const dbStudent = await API.fetchStudentByUID(fbUser.user.uid).then(
      //     (res) => res.data
      //   );

      // if there's a purchase pending, redirect user to payment page
      //   if (purchase)
      //     window.location.href = `/payment/${purchase.school}/${purchase.courseId}`;

      // if not then send user to dashboard
      //   dispatch(loginStudent(dbStudent));
    } catch (err) {
      setIsError(true);
      console.log("err", err);
      firebaseAuth.signOut();
      alert(
        "Ha ocurrido un error, por favor verifica que tus datos sean correctos."
      );
    }

    return { isError };
  };

  return { loginUser };
};

export const useForgotPassword = () => {
  const [isError, setIsError] = useState(false);

  const forgotPassword = async (email) => {
    try {
      await firebaseAuth.sendPasswordResetEmail(email);
    } catch (err) {
      setIsError(true);
      console.log("err", err);
      alert("Ha ocurrido un error.");
    }

    return { isError };
  };

  return { forgotPassword };
};
