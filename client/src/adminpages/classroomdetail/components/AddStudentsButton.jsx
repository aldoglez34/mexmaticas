import React, { useEffect, useState } from "react";
import { Button, Form, Modal } from "react-bootstrap";
import TeacherAPI from "../../../utils/TeacherAPI";
import { AdminSpinner } from "../../components";

export const AddStudentsButton = React.memo(() => {
  const [show, setShow] = useState(false);
  const [students, setStudents] = useState();

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  useEffect(() => {
    if (show) {
      TeacherAPI.t_fetchStudents()
        .then((res) => {
          const rawStudents = res.data
            .map(({ _id, email, firstSurname, name }) => ({
              _id,
              email: email.trim(),
              name: String(`${name} ${firstSurname}`).trim(),
            }))
            .sort((a, b) =>
              String(`${a.name}`).toUpperCase().trim() <
              String(`${b.name}`).toUpperCase().trim()
                ? -1
                : 1
            );
          setStudents(rawStudents);
        })
        .catch((err) => {
          console.log("err", err);
          alert(
            "Ocurrió un error al descargar los alumnos, intenta más tarde."
          );
        });
    }
  }, [show]);

  const handleSaveChanges = () => undefined;

  return (
    <>
      <Button className="mt-1" onClick={handleShow} variant="dark">
        <i className="fas fa-user-plus mr-2" />
        <span>Agregar Alumno</span>
      </Button>

      <Modal show={show} onHide={handleClose} backdrop="static">
        <Modal.Body className="bg-light rounded shadow text-center py-4">
          <div className="d-flex">
            <h3 className="mb-0 text-dark">Agregar Alumnos</h3>
            <Button
              variant="link"
              className="text-dark ml-auto"
              onClick={handleClose}
            >
              <i className="fas fa-times" />
            </Button>
          </div>
          <div className="my-3">
            <Form.Group controlId="exampleForm.ControlSelect2">
              {students ? (
                students.length ? (
                  <Form.Control
                    as="select"
                    multiple
                    style={{ height: "40rem" }}
                  >
                    {students.map((s) => (
                      <option key={s._id}>{`${s.name} - ${s.email}`}</option>
                    ))}
                  </Form.Control>
                ) : (
                  <em>No hay alumnos.</em>
                )
              ) : (
                <AdminSpinner />
              )}
            </Form.Group>
          </div>
          <Button block onClick={handleSaveChanges} size="lg" variant="dark">
            Guardar
          </Button>
        </Modal.Body>
      </Modal>
    </>
  );
});

AddStudentsButton.displayName = "AddStudentsButton";
