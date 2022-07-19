import React from "react";
import { StudentLayout } from "../../components";
import { Image } from "react-bootstrap";

export const NoMatchPage = () => {
  return (
    <StudentLayout isContainer={false}>
      <div className="p-4 mt-4 text-center">
        <Image
          className="mb-3"
          height="135"
          src="/images/notfound.png"
          width="135"
        />
        <h1 className="display-4 mb-0">404</h1>
        <h4>Error, la página que estás buscando no existe</h4>
        <p>
          Regresa a nuestra{" "}
          <a href="/" className="text-success">
            página principal
          </a>
        </p>
      </div>
    </StudentLayout>
  );
};
