import React from "react";
import { Row, Col, Image } from "react-bootstrap";
import { bool, func, object, string } from "prop-types";
import { ExamsAccordion, HelpModal, PDFLInk, Leaderboards } from ".";

import styles from "./topic.module.scss";

export const Topic = React.memo(
  ({ courseName, getTeacherNames, isPartOfClassroom, topic }) => (
    <>
      {/* title */}
      <Row id={topic.name}>
        <Col>
          <p className={styles.topicName}>{topic.name}</p>
          <p className={styles.topicSubject}>{topic.subject}</p>
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
          {isPartOfClassroom && (
            <p className="my-3">
              <Leaderboards topicId={topic._id} />
            </p>
          )}
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
          <div className="d-flex align-items-center mb-3">
            <h4 className="mb-0">Exámenes</h4>
            <Image
              className="ml-2"
              height="35"
              src="/images/exams.png"
              width="35"
            />
          </div>
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
          {isPartOfClassroom && (
            <div className="text-right mt-2">
              <HelpModal
                {...{
                  courseName,
                  getTeacherNames,
                  topic: topic.name,
                  topicId: topic._id,
                }}
              />
            </div>
          )}
        </Col>
      </Row>
    </>
  )
);

Topic.propTypes = {
  courseName: string.isRequired,
  getTeacherNames: func,
  isPartOfClassroom: bool,
  topic: object.isRequired,
};

Topic.displayName = "Topic";
