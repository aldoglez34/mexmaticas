import React, { memo, useEffect, useMemo, useState } from "react";
import { array, arrayOf, func, shape, string } from "prop-types";
import { Button, ScrollableDiv } from "../";
import { gte, isEmpty, isEqual, lt } from "lodash";
import { Form, Tab, Tabs } from "react-bootstrap";
import { convertToUpperCase, getAccessorValue } from "../../utils/helpers";
import { errorLogger } from "../../errors/errorLogger";

import styles from "./assigndata.module.scss";

export const AssignData = memo(
  ({
    accessors = {},
    allData = [],
    assignedData = [],
    canSearchBy,
    onSubmitData = {},
    tabLabels = ["Todos", "Asignados"],
  }) => {
    const [selectedItems, setSelectedItems] = useState([]);
    const [activeTab, setActiveTab] = useState(0);
    const [isLoading, setIsLoading] = useState(false);
    const [filtered, setFiltered] = useState([]);
    const [search, setSearch] = useState("");

    useEffect(() => setFiltered(allData), [allData]);

    useEffect(() => {
      if (!isEmpty(assignedData)) {
        const defaultData = assignedData.map((item) => ({
          value: item[accessors.value],
          label: item[accessors.label],
        }));
        setSelectedItems(defaultData);
      }
    }, [accessors.label, accessors.value, assignedData]);

    const tabs = useMemo(
      () => [
        { label: tabLabels[0], value: "all" },
        { label: tabLabels[1], value: "assigned" },
      ],
      [tabLabels]
    );

    const isItemSelected = (item) =>
      selectedItems.some((selected) =>
        isEqual(selected.value, item[accessors.value])
      );

    const handleSelectItem = (item) => {
      if (isItemSelected(item)) {
        setSelectedItems((prevState) =>
          prevState.filter(
            (selectedItem) =>
              !isEqual(selectedItem.value, item[accessors.value])
          )
        );
        return;
      }
      setSelectedItems((prevState) =>
        prevState.concat({
          value: item[accessors.value],
          label: item[accessors.label],
        })
      );
    };

    const handleSubmit = async () => {
      const { afterSubmit, getProps, onSubmit } = onSubmitData;
      if (!onSubmit || !getProps) return;
      setIsLoading(true);
      try {
        await onSubmit(getProps(selectedItems));
        afterSubmit && afterSubmit();
      } catch (err) {
        errorLogger(err);
      }
      !afterSubmit && setIsLoading(false);
    };

    const isFilterActive = useMemo(
      () => !isEqual(allData.length, filtered.length),
      [allData, filtered]
    );

    const handleOnChangeTab = (tab) => {
      if (canSearchBy) {
        if (!isEmpty(search)) setSearch("");
        if (isFilterActive) setFiltered(allData);
      }
      setActiveTab(tab);
    };

    useEffect(() => {
      if (isEmpty(allData)) return;

      if (lt(search.length, 3)) {
        if (isFilterActive) setFiltered(allData);
        return;
      }

      if (gte(search.length, 3)) {
        setFiltered(
          allData.filter((s) => {
            const value = getAccessorValue(s, canSearchBy).trim();
            return value.toUpperCase().includes(search.toUpperCase());
          })
        );
      }
    }, [allData, canSearchBy, isFilterActive, search]);

    const AllView = () => (
      <ScrollableDiv className="py-3 px-0">
        {filtered.map((item, idx) => {
          const isSelected = isItemSelected(item);
          return (
            <Button
              className="d-block"
              hoverText={!isSelected ? "Agregar curso" : ""}
              isActive={isSelected}
              isAnchor
              key={idx}
              onClick={() => handleSelectItem(item)}
            >
              {isSelected ? (
                <i className="fas fa-check mr-2" />
              ) : (
                <i className="far fa-circle mr-2" />
              )}
              {item[accessors.label]}
            </Button>
          );
        })}
      </ScrollableDiv>
    );

    const AssignedView = () => (
      <ScrollableDiv className="py-3 px-0">
        <ol className="pl-3">
          {selectedItems.map((selectedItem, idx) => (
            <li key={idx}>
              <strong>{selectedItem.label}</strong>
            </li>
          ))}
        </ol>
      </ScrollableDiv>
    );

    return (
      <>
        <Tabs
          activeKey={activeTab}
          className={styles.customTabs}
          onSelect={(tab) => handleOnChangeTab(tab)}
        >
          <Tab eventKey={0} title={convertToUpperCase(tabs[0].label)}>
            {canSearchBy && (
              <Form className="mt-4">
                <Form.Control
                  onChange={(str) => setSearch(str.target.value)}
                  placeholder="Buscar..."
                  type="text"
                  value={search}
                />
              </Form>
            )}
            <AllView />
          </Tab>
          <Tab eventKey={1} title={convertToUpperCase(tabs[1].label)}>
            <AssignedView />
          </Tab>
        </Tabs>
        <Button
          {...{
            isDisabled: isLoading,
            isLoading,
            isSubmit: true,
            onClick: handleSubmit,
          }}
        />
      </>
    );
  }
);

AssignData.propTypes = {
  accessors: shape({
    value: string,
    label: string,
  }),
  allData: array,
  assignedData: array,
  canSearchBy: string,
  tabLabels: arrayOf(string),
  onSubmitData: shape({
    afterSubmit: func,
    getProps: func,
    onSubmit: func,
  }),
};

AssignData.displayName = "AssignData";
