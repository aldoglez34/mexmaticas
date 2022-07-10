import React, { useEffect, useState } from "react";
import {
  AdminDataTemplate,
  AdminLayout,
  ListGroupItem,
  SearchForm,
} from "../../components";
import { Button } from "react-bootstrap";
import { fetchClassrooms } from "../../services";
import { useDataUtils } from "../../hooks/useDataUtils";
import { isEmpty, isEqual } from "lodash";
import { ADMIN_PAGES } from "../../utils/constants";
import cn from "classnames";
import { getFullName } from "../../utils/helpers";

export const AdminClassroomsPage = () => {
  const [classrooms, setClassrooms] = useState();
  const [activeFilter, setActiveFilter] = useState(undefined);

  const {
    CLASSROOMS: { PAGE_SIZE, SORT_OPTIONS, FILTER_BUTTONS },
  } = ADMIN_PAGES;

  useEffect(() => {
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
      href: "/admin/classrooms/new",
    },
  ];

  const mapItemFunc = (item) => (
    <ListGroupItem
      key={item._id}
      link={`/admin/classrooms/edit/${item._id}`}
      title={item.name}
      content={
        <>
          {item.teacher && (
            <span className="mb-1">
              <i className="fas fa-user-tie mr-2" />
              {getFullName(
                item.teacher?.name,
                item.teacher?.firstSurname,
                item.teacher?.secondSurname
              )}
            </span>
          )}
          <span className="d-block">
            <i className="fas fa-user-graduate mr-2" />
            {`${(item.members || []).length} alumnos`}
          </span>
          <span>
            <i className="fas fa-school mr-2" />
            {`[${item.school ?? ""}] ${
              item.institution?.name ?? "Sin escuela"
            }`}
          </span>
        </>
      }
    />
  );

  return (
    <AdminLayout
      buttons={filterButtons}
      leftBarActive="Salones"
      optionsDropdown={optionsDropdown}
      topNavTitle="Salones"
    >
      <SearchForm
        activeSort={sort}
        clearFilters={clearFilters}
        handleFilter={handleFilterData}
        handleSort={handleSortData}
        isDataEmpty={isEmpty(classrooms)}
        ref={searchRef}
        searchBarPlaceholder="Buscar por nombre de salón..."
        sortOptions={SORT_OPTIONS}
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
