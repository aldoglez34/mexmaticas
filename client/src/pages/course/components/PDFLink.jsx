import React, { useState, useEffect } from "react";
import { firebaseStorage } from "../../../firebase/firebase";

export const PDFLInk = React.memo(({ path, name, ...props }) => {
  const [firebaseUrl, setFirebaseUrl] = useState();

  useEffect(() => {
    const storageRef = firebaseStorage.ref();

    storageRef
      .child(path)
      .getDownloadURL()
      .then((url) => setFirebaseUrl(url))
      .catch((err) => {
        console.log(err);
        alert("Ocurrió un error al cargar la imagen.");
      });
  }, [path]);

  return (
    firebaseUrl && (
      <p className="mb-1" {...props}>
        <a
          className="text-info"
          href={firebaseUrl}
          rel="noopener noreferrer"
          target="_blank"
        >
          <i className="fas fa-file-pdf mr-2" />
          {name}
        </a>
      </p>
    )
  );
});
