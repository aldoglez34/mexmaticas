import React, { useEffect, useState } from "react";
import {
  AdminDataTemplate,
  AdminLayout,
  ListGroupItem,
  SearchForm,
} from "../../components";
import { fetchTeachers } from "../../services";
import { useDataUtils } from "../../hooks/useDataUtils";
import { ADMIN_PAGES } from "../../utils/constants";
import { isEmpty } from "lodash";
import { getFullName } from "../../utils/helpers";

export const AdminTeachersPage = () => {
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
    data: teachers,
    pageSize: PAGE_SIZE,
    searchBarAccessor: ["name", "firstSurname"],
    sortOptions: SORT_OPTIONS,
  });

  const optionsDropdown = [
    {
      text: "Nuevo Maestro",
      href: "/admin/teachers/new",
    },
  ];

  const mapItemFunc = (item) => (
    <ListGroupItem
      key={item._id}
      link={`/admin/teachers/edit/${item._id}`}
      title={getFullName(item.name, item.firstSurname, item.secondSurname)}
      content={
        <>
          <i className="fas fa-envelope mr-2" />
          {item.email}
        </>
      }
    />
  );

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
        isDataEmpty={isEmpty(teachers)}
        ref={searchRef}
        searchBarPlaceholder="Buscar por nombre de maestro..."
        sortOptions={SORT_OPTIONS}
      />
      <AdminDataTemplate
        {...{
          activePage,
          data: filtered,
          emptyMessage: "Lista de maestros vacía.",
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
