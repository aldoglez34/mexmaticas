import React, { useState, useEffect } from "react";
import { Col, Container, ListGroup, Row, Spinner, Tab } from "react-bootstrap";
import Fade from "react-reveal/Fade";
import { SectionTitle, HomeCard } from "./components";
import { fetchLandingPageCourses } from "../../../services";
import "./ourcourses.scss";

export const OurCourses = () => {
  const [courses, setCourses] = useState();

  useEffect(() => {
    fetchLandingPageCourses()
      .then((res) => {
        setCourses(res.data);
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);

  return (
    <Container className="oc_jumbo">
      <Fade>
        {/* title */}
        <SectionTitle
          title="Nuestros Cursos"
          text="Cursos de matemáticas para los siguientes niveles educativos."
        />
        {/* content */}
        {courses ? (
          courses.length ? (
            <Tab.Container defaultActiveKey={`#${courses[0].school}`}>
              <Row>
                <Col md={5}>
                  <ListGroup className="mb-3 mb-md-0">
                    {courses.map((c, idx) => {
                      return (
                        <ListGroup.Item
                          key={idx}
                          action
                          href={"#" + c.school}
                          className="courseMenuItem shadow-sm rounded border border-lignt"
                        >
                          <h4 className="mb-0" style={{ fontWeight: 900 }}>
                            <i
                              className="fas fa-graduation-cap mr-3"
                              style={{ color: "#49bf84" }}
                            />
                            {c.school}
                          </h4>
                        </ListGroup.Item>
                      );
                    })}
                  </ListGroup>
                </Col>
                <Col md={7}>
                  <Tab.Content>
                    {courses.map((c, idx) => {
                      return (
                        <Tab.Pane key={idx} eventKey={`#${c.school}`}>
                          <HomeCard
                            courses={c.courses.map((cc) => {
                              return {
                                title: cc.name,
                                list: [...cc.topicsSummary],
                              };
                            })}
                            link={`/courses/${c.school}`}
                          />
                        </Tab.Pane>
                      );
                    })}
                  </Tab.Content>
                </Col>
              </Row>
            </Tab.Container>
          ) : (
            <></>
          )
        ) : (
          <div className="text-center" style={{ margin: "150px 0px" }}>
            <Spinner animation="border" role="status" />
          </div>
        )}
      </Fade>
    </Container>
  );
};
