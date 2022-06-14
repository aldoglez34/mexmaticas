import React, { forwardRef } from "react";
import { Button, Col, Form } from "react-bootstrap";
import { array, func, string } from "prop-types";

export const SearchForm = forwardRef(
  (
    {
      activeSort,
      clearFilters,
      handleFilter,
      handleSort,
      searchBarPlaceholder = "Buscar...",
      sortOptions,
    },
    ref
  ) => (
    <Form className="mb-3">
      <Form.Row>
        <Col md="4" className="d-flex">
          <div className="d-flex align-items-center mr-2">
            <i className="fas fa-sort" style={{ fontSize: "19px" }} />
          </div>
          <Form.Control
            as="select"
            value={activeSort}
            onChange={(opt) => handleSort(opt.target.value)}
          >
            {sortOptions.map((so) => (
              <option key={so} value={so}>
                {so}
              </option>
            ))}
          </Form.Control>
        </Col>
        <Col md="8" className="d-flex">
          <div className="d-flex align-items-center mr-2">
            <i className="fas fa-search" style={{ fontSize: "19px" }} />
          </div>
          <Form.Control
            onChange={(str) => handleFilter(String(str.target.value))}
            placeholder={searchBarPlaceholder}
            type="text"
            ref={ref}
          />
          <Button
            className="ml-2"
            onClick={clearFilters}
            size="sm"
            title="Limpiar filtro"
            variant="dark"
          >
            <i className="fas fa-sync-alt px-1" />
          </Button>
        </Col>
      </Form.Row>
    </Form>
  )
);

SearchForm.propTypes = {
  activeSort: string,
  clearFilters: func.isRequired,
  handleFilter: func.isRequired,
  handleSort: func.isRequired,
  searchBarPlaceholder: string,
  sortOptions: array.isRequired,
};

SearchForm.displayName = "SearchForm";
