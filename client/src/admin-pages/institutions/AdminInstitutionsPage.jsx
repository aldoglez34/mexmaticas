import React, { useEffect, useState } from "react";
import {
  AdminLayout,
  AdminPagination,
  AdminSpinner,
  ListGroupItem,
  SearchForm,
} from "../../components";
import { ListGroup } from "react-bootstrap";
import { fetchInstitutions } from "../../services";
import { useDataUtils } from "../../hooks/useDataUtils";
import { ADMIN_PAGES } from "../../utils/constants";

export const AdminInstitutionsPage = () => {
  const [institutions, setInstitutions] = useState();

  const {
    INSTITUTIONS: { PAGE_SIZE, SORT_OPTIONS },
  } = ADMIN_PAGES;

  useEffect(() => {
    fetchInstitutions()
      .then((res) =>
        setInstitutions(
          res.data?.sort((a, b) => (a.createdAt > b.createdAt ? -1 : 1))
        )
      )
      .catch((err) => {
        console.log(err);
        alert("Ocurrió un error, vuelve a intentarlo.");
      });
  }, []);

  const {
    data: { activePage, filtered, limit, offset, pages, searchRef, sort },
    functions: {
      clearFilters,
      handleChangePage,
      handleFilterData,
      handleSortData,
    },
  } = useDataUtils({
    data: institutions,
    pageSize: PAGE_SIZE,
    searchBarAccessor: "name",
    sortOptions: SORT_OPTIONS,
  });

  const optionsDropdown = [
    {
      text: "Nueva Escuela",
      fn: () => (window.location.href = "/admin/institutions/new"),
    },
  ];

  return (
    <AdminLayout
      leftBarActive="Escuelas"
      optionsDropdown={optionsDropdown}
      topNavTitle="Escuelas"
    >
      <SearchForm
        activeSort={sort}
        clearFilters={clearFilters}
        handleFilter={handleFilterData}
        handleSort={handleSortData}
        ref={searchRef}
        searchBarPlaceholder="Buscar por nombre de escuela..."
        sortOptions={SORT_OPTIONS}
      />
      {filtered ? (
        filtered.length ? (
          <React.Fragment>
            <ListGroup>
              {filtered.slice(offset, limit).map((c) => (
                <ListGroupItem
                  key={c._id}
                  link={`/admin/institutions/edit/${c._id}`}
                >
                  <h4>{c.name}</h4>
                  {c.description && <span>{c.description}</span>}
                </ListGroupItem>
              ))}
            </ListGroup>
            {filtered.length > PAGE_SIZE && (
              <div className="mt-3">
                <AdminPagination
                  activePage={activePage}
                  handleChangePage={(p) => handleChangePage(p)}
                  pageCount={pages}
                />
              </div>
            )}
          </React.Fragment>
        ) : (
          <div className="text-center mt-4">No hay escuelas.</div>
        )
      ) : (
        <AdminSpinner />
      )}
    </AdminLayout>
  );
};
