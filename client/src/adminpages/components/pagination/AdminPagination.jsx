import React from "react";
import { Pagination } from "react-bootstrap";
import { func, number } from "prop-types";

const generatePages = (activePage, handleChangePage, pageCount) => {
  let pagination = [];
  for (let i = 1; i <= pageCount; i++) {
    pagination.push(
      <Pagination.Item
        active={i === activePage ? true : false}
        className="itemsStyle"
        key={i}
        onClick={() => {
          handleChangePage(i);
          window.scrollTo(0, 0);
        }}
      >
        {i}
      </Pagination.Item>
    );
  }
  return pagination;
};

export const AdminPagination = React.memo(
  ({ activePage, handleChangePage, pageCount }) => {
    return (
      <Pagination>
        {generatePages(activePage, handleChangePage, pageCount)}
      </Pagination>
    );
  }
);

AdminPagination.propTypes = {
  activePage: number.isRequired,
  handleChangePage: func.isRequired,
  pageCount: number.isRequired,
};

AdminPagination.displayName = "AdminPagination";
