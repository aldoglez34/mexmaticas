import React, { useEffect, useState } from "react";
import {
  AdminLayout,
  AdminPagination,
  AdminSpinner,
  ListGroupItem,
  SearchForm,
} from "../../components";
import { Button, ListGroup } from "react-bootstrap";
import { fetchClassrooms } from "../../services";
import { useDispatch } from "react-redux";
import { setTitle } from "../../redux/actions/admin";
import { useDataUtils } from "../../hooks/useDataUtils";
import { isEmpty, isEqual } from "lodash";
import cn from "classnames";

const PAGE_SIZE = 15;
const SORT_OPTIONS = [
  "Más Recientes",
  "Más Antiguos",
  "Por Nombre Asc",
  "Por Nombre Desc",
];
const FILTER_BUTTONS = [
  "Primaria",
  "Secundaria",
  "Preparatoria",
  "Universidad",
];

export const AdminClassroomsPage = () => {
  const dispatch = useDispatch();

  const [classrooms, setClassrooms] = useState();
  const [activeFilter, setActiveFilter] = useState(undefined);

  useEffect(() => {
    dispatch(setTitle("Salones"));
    fetchClassrooms()
      .then((res) =>
        setClassrooms(
          (res.data || []).sort((a, b) => (a.createdAt > b.createdAt ? -1 : 1))
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
    data: classrooms,
    filterButtons: { accessor: "school", activeFilter, setActiveFilter },
    pageSize: PAGE_SIZE,
    searchBarAccessor: "name",
    sortOptions: SORT_OPTIONS,
  });

  const filterButtons = (
    <div className="d-flex">
      {FILTER_BUTTONS.map((opt, idx) => (
        <Button
          active={isEqual(activeFilter, opt)}
          className={cn("shadow-sm", !isEqual(idx, 0) && "ml-2")}
          disabled={isEmpty(classrooms)}
          key={idx}
          onClick={() =>
            setActiveFilter(isEqual(opt, activeFilter) ? null : opt)
          }
          variant="outline-light"
        >
          {opt}
        </Button>
      ))}
    </div>
  );

  const optionsDropdown = [
    {
      text: "Nuevo Salón",
      fn: () => (window.location.href = "/admin/classrooms/new"),
    },
  ];

  return filtered ? (
    <AdminLayout
      buttons={filterButtons}
      leftBarActive="Salones"
      optionsDropdown={optionsDropdown}
    >
      <SearchForm
        activeSort={sort}
        clearFilters={clearFilters}
        handleFilter={handleFilterData}
        handleSort={handleSortData}
        ref={searchRef}
        searchBarPlaceholder="Buscar por nombre de salón..."
        sortOptions={SORT_OPTIONS}
      />
      {filtered.length ? (
        <>
          <ListGroup>
            {filtered.slice(offset, limit).map((c) => (
              <ListGroupItem
                key={c._id}
                link={`/admin/classrooms/edit/${c._id}`}
              >
                <h4>{c.name}</h4>
                {(c.teacher || []) && (
                  <span className="mb-1">
                    <i className="fas fa-graduation-cap mr-2" />
                    {String(
                      `${c.teacher?.name} ${c.teacher?.firstSurname} ${c.teacher?.secondSurname}`
                    ).trim()}
                  </span>
                )}
                <div>
                  <span className="mr-2">
                    <i className="fas fa-school mr-2" />
                    {c.institution?.name ?? "Sin escuela"}
                    {c.school && ` - ${c.school}`}
                  </span>
                  <span>
                    |
                    <i className="fas fa-user-graduate mr-2 ml-2" />
                    {(c.members || []).length}
                  </span>
                </div>
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
        <div className="text-center mt-4">No hay salones.</div>
      )}
    </AdminLayout>
  ) : (
    <AdminSpinner />
  );
};
