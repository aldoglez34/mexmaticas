import React, { useState, useEffect } from "react";
import { NavDropdown, Badge } from "react-bootstrap";
import { useSelector, useDispatch } from "react-redux";
import * as studentActions from "../../../../../redux/actions/student";
import { firebaseAuth } from "../../../../../firebase/firebase";
import { fetchUnseeenMessages } from "../../../../../services";
import "./navbardropdowns.scss";

export const StudentDropdown = () => {
  const [unseen, setUnseen] = useState();

  const student = useSelector((state) => state.student);
  const zenMode = useSelector((state) => state.zenMode);
  const dispatch = useDispatch();

  const logout = () => {
    firebaseAuth
      .signOut()
      .then(() => {
        dispatch(studentActions.logoutStudent());
        alert("¡Adiós, vuelve pronto!");
      })
      .catch((error) => console.log(error));
  };

  useEffect(() => {
    fetchUnseeenMessages(student._id)
      .then((res) => setUnseen(res.data))
      .catch((err) => {
        console.log(err);
      });
  }, [student._id]);

  return (
    <NavDropdown
      id="navDropdownToggle"
      alignRight
      title={
        <span id="navDropdownText">
          {unseen > 0 ? (
            <Badge variant="danger" className="mr-1" title="Nuevos mensajes">
              {unseen}
            </Badge>
          ) : null}
          {student ? (
            zenMode ? (
              <s>{student.email}</s>
            ) : (
              <span>{student.email}</span>
            )
          ) : null}
          <i
            className="fas fa-chevron-down ml-1"
            style={{ fontSize: "13px" }}
          />
        </span>
      }
      disabled={zenMode}
    >
      <NavDropdown.Item href="/dashboard" className="dropdownItem">
        Mis cursos
      </NavDropdown.Item>
      <NavDropdown.Item href="/messages" className="dropdownItem">
        {unseen > 0 ? (
          <Badge variant="danger" className="mr-1" title="Nuevos mensajes">
            {unseen}
          </Badge>
        ) : null}
        Mis mensajes
      </NavDropdown.Item>
      <NavDropdown.Divider />
      <NavDropdown.Item onClick={logout} className="dropdownItem">
        Cerrar sesión
      </NavDropdown.Item>
    </NavDropdown>
  );
};
