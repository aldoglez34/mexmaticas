import React, { useEffect, useState } from "react";
import { array, string } from "prop-types";
import { ReactSortable } from "react-sortablejs";
import { IconButton } from "../../../../components";
import { updateTopicOrder } from "../../../../services";
import cn from "classnames";

import styles from "./draggabletopics.module.scss";

export const DraggableTopics = ({ courseId, topics }) => {
  const [state, setState] = useState(topics);

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
      updateTopicOrder({ courseId, newList: changes })
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
  }, [courseId, state]);

  return state.length ? (
    <ul className="mb-1">
      <ReactSortable list={state} setList={setState}>
        {state.map((t) => (
          <li key={t._id}>
            <h5 className={cn("mb-0", styles.item)}>
              {t.name}
              <IconButton
                href={`/admin/courses/edit/topics/${courseId}/${t._id}`}
                icon={<i className="fas fa-arrow-alt-circle-right" />}
              />
            </h5>
          </li>
        ))}
      </ReactSortable>
    </ul>
  ) : (
    <h5>-</h5>
  );
};

DraggableTopics.propTypes = {
  courseId: string.isRequired,
  topics: array,
};
