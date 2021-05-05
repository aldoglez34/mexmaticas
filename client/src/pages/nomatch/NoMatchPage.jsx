import React from "react";
import { Layout } from "../../components/Layout";
import { Image } from "react-bootstrap";

export const NoMatchPage = () => {
  return (
    <Layout>
      <div className="p-4 mt-4 text-center">
        <Image
          src="https://image.flaticon.com/icons/svg/2965/2965549.svg"
          width="135"
          height="135"
          className="mb-3"
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
    </Layout>
  );
};
