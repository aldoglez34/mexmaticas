import React, { memo } from "react";
import { useLocation } from "react-router-dom";
import { HashLink as Link } from "react-router-hash-link";
import { useAdminRow } from "../../hooks/useAdminRow";
import { getAccessorValue } from "../../utils/helpers";
import { listTypes } from "../rows/AdminRow";

export const AnchorList = memo(({ list = {} }) => {
  const { pathname } = useLocation();
  const { renderIcon } = useAdminRow();

  const getTo = (name) => `${pathname}/#${name}`;

  return list.data.map((item, idx) => (
    <span className="d-block" key={idx}>
      <Link
        smooth
        title={`Ir a ${item.name}`}
        style={{ color: "#4d535a" }}
        to={getTo(item.name)}
      >
        {getAccessorValue(item, list.accessor).trim()}
      </Link>
      {list.icon && renderIcon(list.icon, item)}
    </span>
  ));
});

AnchorList.propTypes = {
  list: listTypes.isRequired,
};
