import React from "react";
import { Image, Container, Row, Col } from "react-bootstrap";
import "./footer.scss";

export const MyFooter = () => {
  return (
    <footer id="myfooter" className="mt-auto">
      <Container>
        <Row>
          <Col md={3}>
            <h3 id="footerLogo" className="mb-0">
              MeXmáticas
            </h3>
            <p className="mb-2 text-light">
              <em>Matemáticas Simplificadas</em>
            </p>
            <p className="mb-1">
              <a
                href="https://www.instagram.com/mexmaticas/?hl=en"
                target="_blank"
                rel="noopener noreferrer"
              >
                <i
                  className="fab fa-instagram mr-3 socials"
                  title="Instagram"
                />
              </a>
              <a
                href="https://www.facebook.com/MeXmaticas/"
                target="_blank"
                rel="noopener noreferrer"
              >
                <i
                  className="fab fa-facebook-f mr-3 socials"
                  title="Facebook"
                />
              </a>
              <a
                href="https://www.youtube.com/mexmaticas"
                target="_blank"
                rel="noopener noreferrer"
              >
                <i className="fab fa-youtube socials" title="Youtube" />
              </a>
            </p>
            <small>MeXmáticas 2018 ©</small>
          </Col>
          <Col md={3} className="mt-3 mt-lg-1">
            <h5 className="footerTitle">
              <i className="far fa-id-card mr-2" />
              Contacto
            </h5>
            <p className="mb-0">M.C. Luis Rodrigo López Utrera</p>
            <p className="mb-0">229 909 1675</p>
            <p className="mb-0">mexmaticas23@gmail.com</p>
          </Col>
          <Col md={3} className="mt-3 mt-lg-1">
            <h5 className="footerTitle">
              <i className="fas fa-home mr-2" />
              Dirección
            </h5>
            <p className="mb-0">Avenida Graciano Sánchez #5</p>
            <p className="mb-0">Col. Ejido Primero de Mayo Sur</p>
            <p className="mb-0">Boca del Río, Veracruz</p>
          </Col>
          <Col md={3} className="mt-3 mt-lg-1">
            <h5 className="footerTitle">
              <i className="far fa-clock mr-2" />
              Horarios
            </h5>
            <p className="mb-0">Lunes a Viernes: 16:00 a 20:00</p>
            <p className="mb-0">Sábados: 10:00 a 14:00</p>
          </Col>
        </Row>
      </Container>
      <Image src="/images/footerback.png" className="w-100 footerImg" />
    </footer>
  );
};
