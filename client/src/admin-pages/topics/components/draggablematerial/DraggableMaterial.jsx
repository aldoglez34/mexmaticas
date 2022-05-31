import React, { useEffect, useState } from "react";
import { array, func, string } from "prop-types";
import { ReactSortable } from "react-sortablejs";
import { AdminDangerModal } from "../../../../components";
import { updateMaterialOrder } from "../../../../services";

import styles from "./draggablematerial.module.scss";

export const DraggableMaterial = ({
  courseId,
  handleDeleteMaterialItem,
  material,
  topicId,
}) => {
  const [state, setState] = useState(material);

  useEffect(() => {
    const changes = state.reduce((acc, cv, idx) => {
      if (cv.id !== idx + 1)
        acc.push({
          _id: cv._id,
          name: cv.name,
          lastId: cv.id,
          newOrderNumber: idx + 1,
        });
      return acc;
    }, []);

    if (changes.length)
      updateMaterialOrder({ courseId, newList: changes, topicId })
        .then(() => {
          console.log("OK");
        })
        .catch((err) => {
          if (err.response && err.response.data) {
            alert(err.response.data);
          } else {
            alert("Ocurrió un error en el servidor");
          }
        });
  }, [courseId, state, topicId]);

  return state.length ? (
    <ul className="mb-1">
      <ReactSortable list={state} setList={setState}>
        {state.map((m) => (
          <li key={m._id}>
            <strong className={styles.item}>
              {m.type === "video" && <i className="fas fa-video mr-2" />}
              {m.type === "pdf" && <i className="fas fa-file-pdf mr-2" />}
              {m.name}
              <AdminDangerModal
                variant="transparent"
                deleteFn={() => handleDeleteMaterialItem(m.type, m._id, m.link)}
                icon={<i className="fas fa-times" />}
                modalText={`¿Estás seguro que deseas borrar este ${m.type}?`}
              />
            </strong>
          </li>
        ))}
      </ReactSortable>
    </ul>
  ) : (
    <h5>-</h5>
  );
};

DraggableMaterial.propTypes = {
  courseId: string.isRequired,
  handleDeleteMaterialItem: func.isRequired,
  material: array,
  topicId: string.isRequired,
};
