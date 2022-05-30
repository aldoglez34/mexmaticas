import { useState } from "react";
import { registerNewTeacher } from "../../../services";
import { isEqual } from "lodash";
import fbApp from "firebase/app";
import {
  firebaseDevConfig,
  firebaseProdConfig,
} from "../../../firebase/firebase";

export const useAddTeacher = () => {
  const [isError, setIsError] = useState(false);

  // TODO: refactor this to use Firebase Functions to create the new teacher
  const addTeacher = async (values) => {
    try {
      // create a temporary firebase auth
      let temporaryFirebaseApp;
      if (isEqual(process.env.NODE_ENV, "production")) {
        temporaryFirebaseApp = fbApp
          .initializeApp(firebaseProdConfig, "temp")
          .auth();
      } else {
        temporaryFirebaseApp = fbApp
          .initializeApp(firebaseDevConfig, "temp")
          .auth();
      }

      // create user in firebase using temporary firebase auth
      await temporaryFirebaseApp.createUserWithEmailAndPassword(
        values.email,
        values.password
      );

      // edit user display name
      await temporaryFirebaseApp.currentUser.updateProfile({
        displayName: "Teacher",
      });

      // push new user to database
      await registerNewTeacher({
        firebaseUID: temporaryFirebaseApp.currentUser.uid,
        name: values.name,
        firstSurname: values.firstSurname,
        secondSurname: values.secondSurname,
        email: values.email,
      });

      // delete and signout temporary firebase auth
      await temporaryFirebaseApp.delete();
      await temporaryFirebaseApp.signOut();

      // send admin back to teachers page
      window.location.href = "/admin/teachers";
    } catch (err) {
      setIsError(true);

      if (isEqual(err?.code, "auth/email-already-in-use"))
        return alert("El correo ya está en uso.");

      if (isEqual(err?.code, "auth/invalid-email"))
        return alert("El correo es inválido.");

      if (isEqual(err?.code, "auth/weak-password"))
        return alert("La contraseña es inválida.");

      return alert("Ocurrió un error");
    }

    return { isError };
  };

  return { addTeacher };
};
