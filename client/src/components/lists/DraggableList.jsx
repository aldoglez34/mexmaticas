import React, { memo, useEffect, useState } from "react";
import { ReactSortable } from "react-sortablejs";
import { func } from "prop-types";
import { isEmpty } from "lodash";
import { useAdminRow } from "../../hooks/useAdminRow";
import { listTypes } from "../rows/AdminRow";

import styles from "./draggablelist.module.scss";

export const DraggableList = memo(({ list = {}, handleOnChange }) => {
  const [state, setState] = useState([]);

  const { renderList } = useAdminRow();

  useEffect(() => setState(list?.data), [list]);

  // on change handler
  useEffect(() => {
    if (!isEmpty(state) && handleOnChange) handleOnChange(state);
  }, [handleOnChange, state]);

  if (isEmpty(state)) return;

  return (
    <ReactSortable list={state} setList={setState}>
      {renderList({ ...list, data: state }, styles.item)}
    </ReactSortable>
  );
});

DraggableList.propTypes = {
  list: listTypes.isRequired,
  handleOnChange: func.isRequired,
};
