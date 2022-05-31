import React from "react";
import { Row, Col } from "react-bootstrap";
import { string, object } from "prop-types";
import { ExamsAccordion, HelpModal, PDFLInk, Leaderboards } from ".";

export const Topic = React.memo(({ courseName, topic }) => {
  return (
    <>
      {/* title */}
      <Row id={topic.name}>
        <Col>
          <h1 className="display-4 topicName mb-2" style={{ color: "#48bf84" }}>
            {topic.name}
          </h1>
          <div className="d-flex mb-2">
            <h3
              className="mb-0"
              style={{ backgroundColor: "#c6d9d7", color: "#212529" }}
            >
              {topic.subject}
            </h3>
          </div>
        </Col>
      </Row>
      {/* description, material and exams */}
      <Row>
        <Col lg={6}>
          <p className="mb-2">
            {topic.description &&
              topic.description.split("\\n").map((c) => {
                return (
                  <span key={c} className="d-block text-muted">
                    {String(c).trim()}
                  </span>
                );
              })}
          </p>
          <p className="my-3">
            <Leaderboards topicId={topic._id} />
          </p>
          <div className="mb-2">
            {topic.material
              .sort((a, b) => a.materialOrderNumber - b.materialOrderNumber)
              .map((m) => {
                return (
                  <div key={m._id} className="mb-1">
                    {m.type === "video" && (
                      <a
                        className="text-info"
                        href={m.link}
                        rel="noopener noreferrer"
                        target="_blank"
                      >
                        <i className="fas fa-video mr-2" />
                        {m.name}
                      </a>
                    )}
                    {m.type === "pdf" && (
                      <PDFLInk key={m._id} path={m.link} name={m.name} />
                    )}
                  </div>
                );
              })}
          </div>
        </Col>
        <Col lg={6} className="mt-2 mt-lg-0">
          <h4 className="mb-3" style={{ color: "#212529" }}>
            Exámenes
          </h4>
          <ExamsAccordion
            exams={topic.exams}
            reward={topic.reward}
            topicName={topic.name}
            topicId={topic._id}
            freestyle={{
              ...topic.freestyle,
              isAvailable: topic.hasReward,
              topicId: topic._id,
            }}
          />
          <div className="text-right mt-2">
            <HelpModal courseName={courseName} topic={topic.name} />
          </div>
        </Col>
      </Row>
    </>
  );
});

Topic.propTypes = {
  courseName: string.isRequired,
  topic: object.isRequired,
};

Topic.displayName = "Topic";
