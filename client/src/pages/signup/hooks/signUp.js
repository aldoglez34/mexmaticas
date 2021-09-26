import { useState } from "react";
import { firebaseAuth } from "../../../firebase/firebase";
import API from "../../../utils/API";
import { useSelector } from "react-redux";
import { isEqual } from "lodash";

export const useSignUpUser = () => {
  const [isError, setIsError] = useState(false);

  const purchase = useSelector((state) => state.purchase);

  const signUpUser = async (values) => {
    try {
      // create user in firebase
      const fbRes = await firebaseAuth.createUserWithEmailAndPassword(
        values.email,
        values.password
      );

      // edit user display name to customize the verification email
      await fbRes.user.updateProfile({
        displayName: `${values.firstSurname} ${values.secondSurname}`,
      });

      // push new user to database
      await API.registerNewStudent({
        firebaseUID: fbRes.user.uid,
        name: values.name,
        firstSurname: values.firstSurname,
        secondSurname: values.secondSurname,
        email: values.email,
      }).then((res) => res.data);

      // send verify email to user
      // send user to either the dashboard or the payment screen
      // depending on whether user has a purchase pending
      await firebaseAuth.currentUser.sendEmailVerification({
        url: purchase
          ? `http://localhost:3000/payment/${purchase.school}/${purchase.courseId}`
          : "http://localhost:3000/dashboard",
        handleCodeInApp: true,
      });
    } catch (err) {
      setIsError(true);
      console.log("err", err);
      firebaseAuth.signOut();
      if (isEqual(err.code, "auth/email-already-in-use"))
        return alert("Este correo ya está en uso");
      return alert("Ocurrió un error");
    }

    return { isError };
  };

  return { signUpUser };
};

export const useSendEmailVerification = () => {
  const purchase = useSelector((state) => state.purchase);

  const sendEmailVerification = async () => {
    try {
      if (firebaseAuth.currentUser) {
        await firebaseAuth.currentUser.sendEmailVerification({
          url: purchase
            ? `http://localhost:3000/payment/${purchase.school}/${purchase.courseId}`
            : "http://localhost:3000/dashboard",
          handleCodeInApp: true,
        });

        alert("Nuevo correo enviado");
      }
    } catch (error) {
      console.log(error);
    }
  };

  return { sendEmailVerification };
};
