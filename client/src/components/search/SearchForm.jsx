import React, { forwardRef } from "react";
import { Button, Col, Form } from "react-bootstrap";
import { array, bool, func, string } from "prop-types";

export const SearchForm = forwardRef(
  (
    {
      activeSort,
      clearFilters,
      handleFilter,
      handleSort,
      isDataEmpty,
      searchBarPlaceholder = "Buscar...",
      sortOptions,
    },
    ref
  ) => {
    const canSort = Boolean(activeSort && handleSort && sortOptions);
    return (
      <Form className="mb-3">
        <Form.Row>
          {canSort && (
            <Col md="4" className="d-flex">
              <div className="d-flex align-items-center mr-2">
                <i className="fas fa-sort" style={{ fontSize: "19px" }} />
              </div>
              <Form.Control
                as="select"
                disabled={isDataEmpty}
                onChange={(opt) => handleSort(opt.target.value)}
                value={activeSort}
              >
                {sortOptions.map((so) => (
                  <option key={so} value={so}>
                    {so}
                  </option>
                ))}
              </Form.Control>
            </Col>
          )}
          <Col {...(canSort ? { md: "8" } : {})} className="d-flex">
            <div className="d-flex align-items-center mr-2">
              <i className="fas fa-search" style={{ fontSize: "19px" }} />
            </div>
            <Form.Control
              disabled={isDataEmpty}
              onChange={(str) => handleFilter(String(str.target.value))}
              placeholder={searchBarPlaceholder}
              ref={ref}
              type="text"
            />
            <Button
              className="ml-2"
              onClick={clearFilters}
              size="sm"
              title="Limpiar filtro"
              variant="dark"
              disabled={isDataEmpty}
            >
              <i className="fas fa-sync-alt px-1" />
            </Button>
          </Col>
        </Form.Row>
      </Form>
    );
  }
);

SearchForm.propTypes = {
  activeSort: string,
  clearFilters: func.isRequired,
  handleFilter: func.isRequired,
  handleSort: func,
  isDisabled: bool,
  searchBarPlaceholder: string,
  sortOptions: array,
};

SearchForm.displayName = "SearchForm";
