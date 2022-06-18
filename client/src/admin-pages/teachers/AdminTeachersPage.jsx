import React, { useEffect, useState } from "react";
import {
  AdminLayout,
  AdminPagination,
  AdminSpinner,
  ListGroupItem,
  SearchForm,
} from "../../components";
import { ListGroup } from "react-bootstrap";
import { fetchTeachers } from "../../services";
import { useDispatch } from "react-redux";
import { useDataUtils } from "../../hooks/useDataUtils";
import { ADMIN_PAGES } from "../../utils/constants";

export const AdminTeachersPage = () => {
  const dispatch = useDispatch();

  const [teachers, setTeachers] = useState();

  const {
    TEACHERS: { PAGE_SIZE, SORT_OPTIONS },
  } = ADMIN_PAGES;

  useEffect(() => {
    fetchTeachers()
      .then((res) =>
        setTeachers(
          (res.data || []).sort((a, b) =>
            a.registeredAt > b.registeredAt ? -1 : 1
          )
        )
      )
      .catch((err) => {
        console.log(err);
        alert("Ocurrió un error, vuelve a intentarlo.");
      });
  }, [dispatch]);

  const {
    data: { activePage, filtered, limit, offset, pages, searchRef, sort },
    functions: {
      clearFilters,
      handleChangePage,
      handleFilterData,
      handleSortData,
    },
  } = useDataUtils({
    data: teachers,
    pageSize: PAGE_SIZE,
    searchBarAccessor: ["name", "firstSurname"],
    sortOptions: SORT_OPTIONS,
  });

  const optionsDropdown = [
    {
      text: "Nuevo Maestro",
      fn: () => (window.location.href = "/admin/teachers/new"),
    },
  ];

  return (
    <AdminLayout
      leftBarActive="Maestros"
      optionsDropdown={optionsDropdown}
      topNavTitle="Maestros"
    >
      <SearchForm
        activeSort={sort}
        clearFilters={clearFilters}
        handleFilter={handleFilterData}
        handleSort={handleSortData}
        ref={searchRef}
        searchBarPlaceholder="Buscar por nombre de maestro..."
        sortOptions={SORT_OPTIONS}
      />
      {filtered ? (
        filtered.length ? (
          <>
            <ListGroup>
              {filtered.slice(offset, limit).map((s) => (
                <ListGroupItem
                  key={s._id}
                  link={`/admin/teachers/edit/${s._id}`}
                >
                  <h4>{String(`${s.name} ${s.firstSurname}`).trim()}</h4>
                  <span>
                    <i className="fas fa-graduation-cap mr-2" />
                    {s.email}
                  </span>
                  {s.classroom?.name && (
                    <span>
                      <i className="fas fa-users mr-2" />
                      {s.classroom.name}
                    </span>
                  )}
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
          </>
        ) : (
          <div className="text-center mt-4">No hay maestros.</div>
        )
      ) : (
        <AdminSpinner />
      )}
    </AdminLayout>
  );
};
