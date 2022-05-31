import React from "react";
import { CardDeck, Container } from "react-bootstrap";
import Fade from "react-reveal/Fade";
import { OfferCard, SectionTitle } from "./components";
import "./threecolumns.scss";

export const ThreeColumns = () => {
  return (
    <Container className="tc_container">
      <Fade>
        <SectionTitle
          title="¿Qué Ofrecemos?"
          text="En MeXmáticas contamos con tres servicios para así poder llegar a más
          estudiantes a nivel local y nacional."
        />
        <CardDeck>
          <OfferCard
            img="/images/laptop.png"
            title="Cursos en Línea"
            text="Una manera innovadora de aprender matemáticas, nuestra
                plataforma en línea se acopla al programa educativo de la SEP."
          />
          <OfferCard
            img="/images/document.png"
            title="Método MeXmáticas"
            text="La mejor manera de aprender matemáticas desde sus cimientos, para
            que así seas el número uno en tu clase."
          />
          <OfferCard
            img="/images/chat.png"
            title="Clases de Regularización"
            text="Abarcamos temas de matemáticas para alumnos de cualquier
            nivel educativo, de manera presencial o en línea."
          />
        </CardDeck>
      </Fade>
    </Container>
  );
};
