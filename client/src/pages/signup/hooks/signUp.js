import { useState } from "react";
import { firebaseAuth } from "../../../firebase/firebase";
import { registerNewStudent } from "../../../services";
import { useSelector } from "react-redux";
import { isEqual } from "lodash";
import { getForwardUrl } from "../../../utils/helpers";

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
        displayName: `${values.name} ${values.firstSurname}`,
      });

      // push new user to database
      await registerNewStudent({
        firebaseUID: fbRes.user.uid,
        name: values.name,
        firstSurname: values.firstSurname,
        secondSurname: values.secondSurname,
        email: values.email,
      }).then((res) => res.data);

      // send verify email to user
      // send user to either the dashboard or the payment screen
      // depending on whether user has a purchase pending
      const url = getForwardUrl(purchase);

      await firebaseAuth.currentUser.sendEmailVerification({
        url,
        handleCodeInApp: true,
      });

      // logout user
      await firebaseAuth.signOut();
    } catch (err) {
      setIsError(true);

      if (isEqual(err?.code, "auth/email-already-in-use"))
        return alert("El correo ya está en uso. ");

      if (isEqual(err?.code, "auth/invalid-email"))
        return alert("El correo es inválido.");

      if (isEqual(err?.code, "auth/weak-password"))
        return alert("La contraseña es inválida.");

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
        const url = getForwardUrl(purchase);

        await firebaseAuth.currentUser.sendEmailVerification({
          url,
          handleCodeInApp: true,
        });

        alert("Correo enviado.");
      }
    } catch (error) {
      console.log(error);
    }
  };

  return { sendEmailVerification };
};
