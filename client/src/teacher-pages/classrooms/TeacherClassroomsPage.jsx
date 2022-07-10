import React, { useEffect, useState } from "react";
import {
  AdminDataTemplate,
  ListGroupItem,
  SearchForm,
  TeacherLayout,
} from "../../components";
import { Button } from "react-bootstrap";
import { fetchTeacherClassrooms } from "../../services";
import { useDataUtils } from "../../hooks/useDataUtils";
import { isEmpty, isEqual } from "lodash";
import { ADMIN_PAGES } from "../../utils/constants";
import cn from "classnames";
import { useSelector } from "react-redux";
import { errorLogger } from "../../errors/errorLogger";

export const TeacherClassroomsPage = () => {
  const [classrooms, setClassrooms] = useState();
  const [activeFilter, setActiveFilter] = useState(undefined);

  const teacherId = useSelector((state) => state.teacher?._id);

  const {
    CLASSROOMS: { PAGE_SIZE, SORT_OPTIONS, FILTER_BUTTONS },
  } = ADMIN_PAGES;

  useEffect(() => {
    if (!teacherId) return;
    fetchTeacherClassrooms(teacherId)
      .then((res) => setClassrooms(res.data))
      .catch((err) => errorLogger(err));
  }, [teacherId]);

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

  const mapItemFunc = (item) => (
    <ListGroupItem
      key={item._id}
      link={`/teacher/classrooms/${item._id}`}
      title={item.name}
      content={
        <>
          <span className="d-block">
            <i className="fas fa-user-graduate mr-2" />
            {`${item.memberCount} alumnos`}
          </span>
          <span>
            <i className="fas fa-school mr-2" />
            {`[${item.school ?? ""}] ${item.institution ?? "Sin escuela"}`}
          </span>
        </>
      }
    />
  );

  return (
    <TeacherLayout
      buttons={filterButtons}
      leftBarActive="Salones"
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
    </TeacherLayout>
  );
};
