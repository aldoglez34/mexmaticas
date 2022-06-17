import React, { useState, useEffect } from "react";
import { Button, Image, Modal, Spinner, Table } from "react-bootstrap";
import { fetchTop10 } from "../../../../services";
import { string } from "prop-types";
import { useSelector } from "react-redux";
import { formatDate } from "../../../../utils/helpers";

export const Leaderboards = ({ topicId }) => {
  const [show, setShow] = useState(false);
  const [top10, setTop10] = useState();

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  const formattedDate = (date) => formatDate(date, "LL");

  const course = useSelector((state) => state.course);

  useEffect(() => {
    if (show) {
      fetchTop10(course._id, topicId)
        .then((res) => setTop10(res.data))
        .catch((err) => console.log(err));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [show]);

  return (
    <>
      <Button variant="danger" className="shadow-sm" onClick={handleShow}>
        <i className="fas fa-trophy mr-2" />
        Cuadro de honor
      </Button>

      <Modal show={show} onHide={handleClose}>
        <Modal.Body className="bg-light rounded shadow">
          <div className="text-center">
            <Image
              src="/images/trophy.png"
              lenght="75"
              width="75"
              className="mb-2 mt-3"
            />
            <h3>CUADRO DE HONOR</h3>
          </div>
          {top10 ? (
            top10.length ? (
              <>
                <Table size="sm" className="mt-3">
                  <thead>
                    <tr>
                      <th className="py-2 text-center bg-light border-top-0">
                        #
                      </th>
                      <th className="py-2 text-center bg-light border-top-0">
                        Puntos
                      </th>
                      <th className="py-2 text-center bg-light border-top-0">
                        Usuario
                      </th>
                      <th className="py-2 text-center bg-light border-top-0">
                        Fecha
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {top10.map((t, idx) => (
                      <tr key={t._id}>
                        <td className="text-center">{idx + 1}</td>
                        <td className="text-center">{t.score}</td>
                        <td className="text-center">{t.username}</td>
                        <td className="text-right">{formattedDate(t.date)}</td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
              </>
            ) : (
              <div className="my-4 text-center">
                <em className="text-muted">Vacío.</em>
              </div>
            )
          ) : (
            <div className="text-center mt-4 pt-4">
              <Spinner animation="border" variant="danger" />
            </div>
          )}
          <div className="text-center mt-4 mb-2">
            <Button
              variant="danger"
              className="shadow-sm"
              onClick={handleClose}
            >
              Salir
            </Button>
          </div>
        </Modal.Body>
      </Modal>
    </>
  );
};

Leaderboards.propTypes = {
  topicId: string.isRequired,
};
