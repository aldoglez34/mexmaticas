import React, { useState, useEffect } from "react";
import {
  AdminDataTemplate,
  AdminLayout,
  ListGroupItem,
  SearchForm,
} from "../../components";
import { Badge, Button } from "react-bootstrap";
import { fetchCourses } from "../../services";
import { ADMIN_PAGES } from "../../utils/constants";
import { isEmpty, isEqual } from "lodash";
import { useDataUtils } from "../../hooks/useDataUtils";
import cn from "classnames";

export const AdminCoursesPage = () => {
  const [courses, setCourses] = useState();
  const [activeFilter, setActiveFilter] = useState(undefined);

  const {
    COURSES: { PAGE_SIZE, FILTER_BUTTONS },
  } = ADMIN_PAGES;

  useEffect(() => {
    fetchCourses()
      .then((res) => setCourses(res.data))
      .catch((err) => {
        console.log(err);
        alert("Ocurrió un error, vuelve a intentarlo.");
      });
  }, []);

  const {
    data: { activePage, filtered, limit, offset, pages, searchRef },
    functions: { clearFilters, handleChangePage, handleFilterData },
  } = useDataUtils({
    data: courses,
    filterButtons: { accessor: "school", activeFilter, setActiveFilter },
    pageSize: PAGE_SIZE,
    searchBarAccessor: "name",
  });

  const filterButtons = (
    <div className="d-flex">
      {FILTER_BUTTONS.map((opt, idx) => (
        <Button
          active={isEqual(activeFilter, opt)}
          className={cn("shadow-sm", !isEqual(idx, 0) && "ml-2")}
          disabled={isEmpty(courses)}
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
      text: "Nuevo Curso",
      href: "/admin/courses/new",
    },
  ];

  const mapItemFunc = (item) => (
    <ListGroupItem
      key={item._id}
      link={`/admin/courses/edit/${item._id}`}
      title={item.name}
      content={
        <>
          <span>{item.school}</span>
          <div>
            <Badge variant={item.isActive ? "success" : "danger"}>
              {item.isActive ? "Activo" : "No activo"}
            </Badge>
          </div>
        </>
      }
    />
  );

  return (
    <AdminLayout
      buttons={filterButtons}
      leftBarActive="Cursos"
      optionsDropdown={optionsDropdown}
      topNavTitle="Cursos"
    >
      <SearchForm
        clearFilters={clearFilters}
        handleFilter={handleFilterData}
        isDataEmpty={isEmpty(courses)}
        ref={searchRef}
        searchBarPlaceholder="Buscar por nombre de curso..."
      />
      <AdminDataTemplate
        {...{
          activePage,
          data: filtered,
          emptyMessage: "Lista de salones vacía.",
          handleChangePage,
          limit,
          mapItemFunc,
          offset,
          pages,
          pageSize: PAGE_SIZE,
        }}
      />
    </AdminLayout>
  );
};
