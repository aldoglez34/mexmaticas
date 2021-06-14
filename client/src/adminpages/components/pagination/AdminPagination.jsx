import React from "react";
import { Pagination } from "react-bootstrap";
import { func, number } from "prop-types";

import styles from "./adminpagination.module.scss";

const generatePages = (activePage, handleChangePage, pageCount) => {
  let pagination = [];
  for (let p = 1; p <= pageCount; p++) {
    pagination.push(
      <Pagination.Item
        active={p === activePage ? true : false}
        key={p}
        onClick={() => {
          handleChangePage(p);
          window.scrollTo(0, 0);
        }}
      >
        {p}
      </Pagination.Item>
    );
  }
  return pagination;
};

export const AdminPagination = React.memo(
  ({ activePage, handleChangePage, pageCount }) => {
    return (
      <Pagination className={styles.pagination}>
        {generatePages(activePage, handleChangePage, pageCount)}
      </Pagination>
    );
  }
);

AdminPagination.propTypes = {
  activePage: number.isRequired,
  handleChangePage: func.isRequired,
  pageCount: number,
};

AdminPagination.displayName = "AdminPagination";
