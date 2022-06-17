import React, { useState, useEffect } from "react";
import { AdminLayout, AdminPagination, AdminSpinner } from "../../components";
import { ListGroup } from "react-bootstrap";
import { fetchMessages } from "../../services";
import { ItemModal } from "./components";
import { useDispatch } from "react-redux";
import { setTitle } from "../../redux/actions/admin";

const PAGE_SIZE = 15;

export const AdminMessagesPage = () => {
  const dispatch = useDispatch();

  const [pages, setPages] = useState();
  const [activePage, setActivePage] = useState(1);
  const [limit, setLimit] = useState(PAGE_SIZE);
  const [offset, setOffset] = useState(0);
  const [messages, setMessages] = useState();
  const [filtered, setFiltered] = useState();
  const [filter, setFilter] = useState();

  useEffect(() => {
    dispatch(setTitle("Mensajes"));
    fetchMessages()
      .then((res) => {
        setMessages(res.data);
        setFiltered(res.data);
        setPages(Math.round(res.data.length / PAGE_SIZE));
      })
      .catch((err) => {
        console.log(err);
      });
  }, [dispatch]);

  const filterMessages = (criteria) => {
    switch (criteria) {
      case "New":
        setFilter(criteria === filter ? null : criteria);
        setFiltered(
          criteria === filter ? messages : messages.filter((msg) => !msg.seen)
        );
        break;
      default:
        setFilter(criteria === filter ? null : criteria);
        setFiltered(
          criteria === filter
            ? messages
            : messages.filter((msg) => msg.source === criteria)
        );
    }
  };

  const handleChangePage = (p) => {
    setActivePage(p);
    if (p === 1) {
      setOffset(0);
      setLimit(PAGE_SIZE);
    }
    if (p > 1) {
      const _offset = (p - 1) * PAGE_SIZE;
      setOffset(_offset);
      setLimit(_offset + PAGE_SIZE);
    }
  };

  return filtered ? (
    <AdminLayout leftBarActive="Mensajes" expanded>
      {filtered.length ? (
        <>
          <ListGroup>
            {filtered.slice(offset, limit).map((m) => (
              <ItemModal key={m._id} message={m} />
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
        <div className="text-center mt-4">No hay mensajes.</div>
      )}
    </AdminLayout>
  ) : (
    <AdminSpinner />
  );
};
