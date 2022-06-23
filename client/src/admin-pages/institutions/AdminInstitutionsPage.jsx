import React, { useEffect, useState } from "react";
import {
  AdminDataTemplate,
  AdminLayout,
  ListGroupItem,
  SearchForm,
} from "../../components";
import { fetchInstitutions } from "../../services";
import { useDataUtils } from "../../hooks/useDataUtils";
import { ADMIN_PAGES } from "../../utils/constants";
import { isEmpty } from "lodash";

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
      href: "/admin/institutions/new",
    },
  ];

  const mapItemFunc = (item) => (
    <ListGroupItem key={item._id} link={`/admin/institutions/edit/${item._id}`}>
      <h4>{item.name}</h4>
      {item.description && <span>{item.description}</span>}
    </ListGroupItem>
  );

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
        isDataEmpty={isEmpty(institutions)}
      />
      <AdminDataTemplate
        {...{
          activePage,
          data: filtered,
          emptyMessage: "Lista de escuelas vacía.",
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
