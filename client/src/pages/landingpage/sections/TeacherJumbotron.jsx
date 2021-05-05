import React, { useEffect } from "react";
import { Col, Container, Jumbotron, Row } from "react-bootstrap";
import Fade from "react-reveal/Fade";
import YouTubePlayer from "youtube-player";
import "./teacherjumbotron.scss";

export const TeacherJumbotron = () => {
  useEffect(() => {
    // var player1, firstStateChange;
    var player1;

    player1 = YouTubePlayer("player-2", {
      videoId: "LssEXs7noKQ",
      width: 450,
      height: 250,
    });

    player1
      // Play video is a Promise.
      // 'playVideo' is queued and will execute as soon as player is ready.
      //   .playVideo()
      .stopVideo()
      .then(() => {
        // console.log("Iniciando video 2");
      });
  }, []);

  return (
    <Jumbotron className="teacherJumbo" fluid>
      <Container>
        <Row>
          <Col lg={7} className="d-flex align-items-center mt-3 mt-lg-0">
            <Fade cascade>
              <blockquote className="blockquote mb-0">
                <p className="lead mb-1 text-muted mb-1">FUNDADOR</p>
                <h2 style={{ color: "#4e545b" }}>
                  "Nuestro compromiso con cada uno de los cursos se refleja en
                  los resultados obtenidos."
                </h2>
                <footer className="blockquote-footer mb-3 mb-md-0">
                  M.C. Luis Rodrigo López Utrera
                </footer>
              </blockquote>
            </Fade>
          </Col>
          <Col lg={5} className="d-flex align-items-center">
            <div id="player-2"></div>
          </Col>
        </Row>
      </Container>
    </Jumbotron>
  );
};
