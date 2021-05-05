import React, { useState } from "react";
import {
  Accordion,
  Card,
  Col,
  Container,
  Image,
  Jumbotron,
  Row,
} from "react-bootstrap";
import Fade from "react-reveal/Fade";
import { ContactForm } from "./components";
import cn from "classnames";
import "./faqjumbotron.scss";

export const FAQJumbotron = () => {
  const [selected, setSelected] = useState();

  const questions = [
    {
      question: "¿Los cursos son exclusivos para estudiantes?",
      answer:
        "No, el contenido de MeXmáticas está diseñado y dirigido a todo público independientemente de la edad o grado educativo. Cualquier persona que quiera desarrollar su habilidad numérica puede suscribirse a nuestra plataforma.",
    },
    {
      question: "¿Cuántas veces puedo hacer uso del contenido de cada curso?",
      answer:
        "Al suscribirte al curso de tu elección, podrás hacer uso de los PDFs, ejercicios y videos de manera ilimitada.",
    },
    {
      question: "¿Puedo repetir un curso al terminarlo?",
      answer:
        "Sí. Todo el material que utilizaste durante el curso puede ser reusado cuantas veces quieras hasta que hayas comprendido por completo los temas incluso los exámenes serán diferentes cada vez que los tomes.",
    },
    {
      question:
        "¿Otorgan algún certificado o reconocimiento al concluir satisfactoriamente los cursos?",
      answer:
        "Por el momento no, sin embargo todos nuestros cursos están basados en el plan de estudios de la SEP.",
    },
    {
      question: "¿Cómo puedo pagar un curso?",
      answer:
        "Mediante una tarjeta de crédito o débito de cualquier banco, también es posible realizar una transferencia electrónica o a través de Pay Pal.",
    },
    {
      question:
        "¿Cómo me pongo en contacto con ustedes en caso de presentarse dudas?",
    },
  ];

  const LastQuestion = () => (
    <>
      <span className="mb-2">
        Para cualquier aclaración ya sean preguntas relacionadas al curso, dudas
        o servicios extras, te invitamos a llenar el siguiente formulario para
        poder darte una pronta y eficaz atención:
      </span>
      <Row>
        <Col md={{ offset: 2, span: 8 }}>
          <br />
          <ContactForm />
        </Col>
      </Row>
    </>
  );

  return (
    <>
      <Image src="/images/top.png" id="fj_image" />
      <Jumbotron className="fj_jumbo" fluid>
        <Container className="fj_paddingsides">
          <Fade>
            <h1 className="mb-4 pb-2 text-center" style={{ fontWeight: 600 }}>
              Preguntas Frecuentes
            </h1>
            <Accordion className="px-3 px-lg-0">
              {questions.map((q, idx) => {
                const icon =
                  selected === idx
                    ? "fas fa-times ml-auto plusSymbol"
                    : "fas fa-plus ml-auto plusSymbol";
                const questionClass =
                  selected === idx ? "fj_questionSelected" : "fj_question";
                const isLastQuestion = idx === questions.length - 1;
                return (
                  <Card key={idx} className="fj_accordionItem border rounded">
                    <Accordion.Toggle
                      as={Card.Header}
                      eventKey={idx}
                      className="fj_cardHeader"
                      onClick={() => {
                        if (selected !== idx) {
                          setSelected(idx);
                        } else {
                          setSelected();
                        }
                      }}
                    >
                      <div className={cn("d-flex", questionClass)}>
                        <strong>{q.question}</strong>
                        <i className={icon} />
                      </div>
                    </Accordion.Toggle>
                    <Accordion.Collapse eventKey={idx}>
                      <Card.Body className="fj_answer bg-light">
                        {isLastQuestion ? <LastQuestion /> : q.answer}
                      </Card.Body>
                    </Accordion.Collapse>
                  </Card>
                );
              })}
            </Accordion>
          </Fade>
        </Container>
      </Jumbotron>
    </>
  );
};
