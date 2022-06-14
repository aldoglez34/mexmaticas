import { useEffect, useRef, useState } from "react";
import { get, isEqual } from "lodash";

const getAccessor = (object, accessor) => {
  const accessorArr = Array.isArray(accessor) ? accessor : [accessor];
  return accessorArr.reduce(
    (acc, cv) => acc.concat(`${get(object, cv, "")} `),
    ""
  );
};

export const useDataUtils = ({
  data,
  filterButtons,
  pageSize,
  searchBarAccessor,
  sortOptions,
}) => {
  const [activePage, setActivePage] = useState(1);
  const [limit, setLimit] = useState(pageSize);
  const [offset, setOffset] = useState(0);
  const [sort, setSort] = useState(sortOptions[0].value);
  const [filtered, setFiltered] = useState();
  const [pages, setPages] = useState();

  const searchRef = useRef(null);

  useEffect(() => {
    setFiltered(data);
    setPages(Math.round((data || []).length / pageSize));
  }, [data, pageSize]);

  const handleFilterData = (criteria) => {
    setSort(sortOptions[0]);
    if (!isEqual(activePage, 1)) {
      setActivePage(1);
      setOffset(0);
      setLimit(pageSize);
      return;
    }
    if (criteria.length < 3) {
      setFiltered(data);
      return;
    }
    if (criteria.length >= 3) {
      // if there are filter buttons and one is active we have to clear it first
      const { setActiveFilter } = filterButtons || {};
      if (setActiveFilter) setActiveFilter(null);
      setFiltered(
        data.filter((s) => {
          const value = getAccessor(s, searchBarAccessor).trim();
          return value.toUpperCase().includes(criteria.toUpperCase());
        })
      );
    }
  };

  // handle filtering with top buttons
  useEffect(() => {
    const { accessor, activeFilter } = filterButtons || {};
    if (!accessor || !data) return;
    if (isEqual(activeFilter, null)) {
      setFiltered(data);
      return;
    }
    setFiltered(data.filter((d) => isEqual(d[accessor], activeFilter)));
    // eslint-disable-next-line
  }, [filterButtons?.activeFilter]);

  const handleSortData = (criteria) => {
    setSort(criteria);
    if (activePage !== 1) {
      setActivePage(1);
      setOffset(0);
      setLimit(pageSize);
    }
    // "Más Recientes"
    if (criteria === sortOptions[0]) {
      setFiltered((prevState) =>
        prevState.sort((a, b) => {
          const dateA = a.createdAt || a.registeredAt;
          const dateB = b.createdAt || b.registeredAt;
          return dateA > dateB ? -1 : 1;
        })
      );
      return;
    }
    // "Más Antiguos"
    if (criteria === sortOptions[1]) {
      setFiltered((prevState) =>
        prevState.sort((a, b) => {
          const dateA = a.createdAt || a.registeredAt;
          const dateB = b.createdAt || b.registeredAt;
          return dateA < dateB ? -1 : 1;
        })
      );
      return;
    }
    // "Por Nombre Asc"
    if (criteria === sortOptions[2]) {
      setFiltered((prevState) =>
        prevState.sort((a, b) => {
          const nameA = String(`${a.name} ${a.firstSurname}`)
            .replace(" undefined", "")
            .toUpperCase()
            .trim();
          const nameB = String(`${b.name} ${b.firstSurname}`)
            .replace(" undefined", "")
            .toUpperCase()
            .trim();
          return nameA < nameB ? -1 : 1;
        })
      );
      return;
    }
    // "Por Nombre Desc"
    if (criteria === sortOptions[3]) {
      setFiltered((prevState) =>
        prevState.sort((a, b) => {
          const nameA = String(`${a.name} ${a.firstSurname}`)
            .replace(" undefined", "")
            .toUpperCase()
            .trim();
          const nameB = String(`${b.name} ${b.firstSurname}`)
            .replace(" undefined", "")
            .toUpperCase()
            .trim();
          return nameA > nameB ? -1 : 1;
        })
      );
      return;
    }
    // "Por Email Asc"
    if (criteria === sortOptions[4]) {
      setFiltered((prevState) =>
        prevState.sort((a, b) =>
          String(a.email).toUpperCase().trim() <
          String(b.email).toUpperCase().trim()
            ? -1
            : 1
        )
      );
      return;
    }
    // "Por Email Desc"
    if (criteria === sortOptions[5])
      setFiltered((prevState) =>
        prevState.sort((a, b) =>
          String(a.email).toUpperCase().trim() >
          String(b.email).toUpperCase().trim()
            ? -1
            : 1
        )
      );
  };

  const clearFilters = () => {
    setSort(sortOptions[0]);
    setFiltered(data);
    searchRef.current.value = "";
    if (activePage !== 1) {
      setActivePage(1);
      setOffset(0);
      setLimit(pageSize);
    }
  };

  const handleChangePage = (p) => {
    setActivePage(p);
    if (p === 1) {
      setOffset(0);
      setLimit(pageSize);
      return;
    }
    if (p > 1) {
      const _offset = (p - 1) * pageSize;
      setOffset(_offset);
      setLimit(_offset + pageSize);
    }
  };

  return {
    data: { activePage, filtered, limit, offset, pages, searchRef, sort },
    functions: {
      clearFilters,
      handleChangePage,
      handleFilterData,
      handleSortData,
    },
  };
};
