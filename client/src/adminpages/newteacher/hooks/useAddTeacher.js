import { useState } from "react";
import { firebaseAuth } from "../../../firebase/firebase";
import { registerNewTeacher } from "../../../services";
import { isEqual } from "lodash";

export const useAddTeacher = () => {
  const [isError, setIsError] = useState(false);

  const addTeacher = async (values) => {
    try {
      const admin = firebaseAuth.currentUser;
      console.log({ values, admin });

      // create user in firebase
      const fbRes = await firebaseAuth.createUserWithEmailAndPassword(
        values.email,
        values.password
      );

      // edit user display name
      await fbRes.user.updateProfile({
        displayName: "Teacher",
      });

      // push new user to database
      await registerNewTeacher({
        firebaseUID: fbRes.user.uid,
        name: values.name,
        firstSurname: values.firstSurname,
        secondSurname: values.secondSurname,
        email: values.email,
      });

      // loggin admin again
      await firebaseAuth.updateCurrentUser(admin);
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
