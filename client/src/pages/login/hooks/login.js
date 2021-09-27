import { useState } from "react";
import { firebaseAuth } from "../../../firebase/firebase";
import { isEqual } from "lodash";
import fbApp from "firebase/app";

export const useLoginUser = () => {
  const [isError, setIsError] = useState(false);

  const loginUser = async (values) => {
    try {
      await firebaseAuth.setPersistence(fbApp.auth.Auth.Persistence.LOCAL);

      await firebaseAuth.signInWithEmailAndPassword(
        values.email,
        values.password
      );
    } catch (err) {
      setIsError(true);

      if (isEqual(err?.code, "auth/invalid-email"))
        return alert("El correo es inválido.");

      if (isEqual(err?.code, "auth/user-disabled"))
        return alert("El usuario está deshabilitado.");

      if (isEqual(err?.code, "auth/user-not-found"))
        return alert("El correo no se ha encontrado.");

      if (isEqual(err?.code, "auth/wrong-password"))
        return alert("La contraseña es incorrecta.");

      return alert("Ha ocurrido un error.");
    }

    return { isError };
  };

  return { loginUser };
};

export const useForgotPassword = () => async (email) => {
  try {
    await firebaseAuth.sendPasswordResetEmail(email);
  } catch (err) {
    if (isEqual(err?.code, "auth/invalid-email"))
      return alert("El correo es inválido.");

    alert("Ha ocurrido un error.");
  }
};
