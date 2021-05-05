import React from "react";
import { Col, Container, Row, Spinner } from "react-bootstrap";
import { useSelector } from "react-redux";
import { StudentLayout } from "../../components/Layout";
import {
  GoBackBttn,
  Grade,
  MyResults,
  ResultMsg,
  UnlockedExam,
} from "./components";

export const ResultsPage = () => {
  const exam = useSelector((state) => state.exam);

  return exam.results ? (
    <StudentLayout>
      <Container style={{ paddingBottom: "45px" }}>
        <Row>
          <Col md={{ offset: 3, span: 6 }}>
            <GoBackBttn topicName={exam.topicName} className="mt-4" />
            <Grade
              grade={exam.results.grade}
              corrects={exam.results.corrects}
              incorrects={exam.results.incorrects}
            />
            {!exam.results.hasExamBeenApprovedBefore && (
              <>
                <br />
                <ResultMsg grade={exam.results.grade} />
                <br />
              </>
            )}
            {!exam.results.hasExamBeenApprovedBefore &&
              (exam.results.unlockedExam ||
                exam.results.isFreestyleUnlocked) && (
                <>
                  <UnlockedExam
                    unlockedExam={exam.results.unlockedExam}
                    isFreestyleUnlocked={exam.results.isFreestyleUnlocked}
                  />
                  <br />
                </>
              )}
            <MyResults results={exam.results.answers} />
            <GoBackBttn topicName={exam.topicName} className="mt-2" />
          </Col>
        </Row>
      </Container>
    </StudentLayout>
  ) : (
    <div className="text-center mt-4 pt-4">
      <Spinner animation="border" variant="success" />
    </div>
  );
};
