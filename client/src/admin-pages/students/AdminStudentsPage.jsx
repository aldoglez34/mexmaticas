import React, { useEffect, useState } from "react";
import {
  AdminLayout,
  AdminPagination,
  AdminSpinner,
  ListGroupItem,
  SearchForm,
} from "../../components";
import { ListGroup } from "react-bootstrap";
import { fetchStudents } from "../../services";
import { useDispatch } from "react-redux";
import { setTitle } from "../../redux/actions/admin";
import { useDataUtils } from "../../hooks/useDataUtils";

const PAGE_SIZE = 15;
const SORT_OPTIONS = [
  "Más Recientes",
  "Más Antiguos",
  "Por Nombre Asc",
  "Por Nombre Desc",
  "Por Email Asc",
  "Por Email Desc",
];

export const AdminStudentsPage = () => {
  const dispatch = useDispatch();

  const [students, setStudents] = useState();

  useEffect(() => {
    dispatch(setTitle("Alumnos"));
    fetchStudents()
      .then((res) =>
        setStudents(
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
    data: students,
    pageSize: PAGE_SIZE,
    searchBarAccessor: ["name", "firstSurname"],
    sortOptions: SORT_OPTIONS,
  });

  return (
    <AdminLayout leftBarActive="Alumnos">
      <SearchForm
        activeSort={sort}
        clearFilters={clearFilters}
        handleFilter={handleFilterData}
        handleSort={handleSortData}
        ref={searchRef}
        searchBarPlaceholder="Buscar por nombre de alumno..."
        sortOptions={SORT_OPTIONS}
      />
      {filtered ? (
        filtered.length ? (
          <>
            <ListGroup>
              {filtered.slice(offset, limit).map((s) => (
                <ListGroupItem key={s._id} link={`/admin/students/${s._id}`}>
                  <h4>{String(`${s.name} ${s.firstSurname}`).trim()}</h4>
                  <span>
                    <i className="fas fa-user-graduate mr-2" />
                    {s.email}
                  </span>
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
          <div className="text-center mt-4">No hay alumnos.</div>
        )
      ) : (
        <AdminSpinner />
      )}
    </AdminLayout>
  );
};
