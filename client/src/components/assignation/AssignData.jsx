import React, { memo, useCallback, useMemo, useState } from "react";
import { array, shape, string } from "prop-types";
import { Button } from "../";
import { isEqual } from "lodash";
import cn from "classnames";
import { convertToUpperCase } from "../../utils/helpers";

import styles from "./assigndata.module.scss";

export const AssignData = memo(
  ({ allData = {}, assignedData = {}, accessors = {}, buttonLabels = [] }) => {
    const [selectedItems, setSelectedItems] = useState([]);
    const [activeButton, setActiveButton] = useState("all");

    const isItemSelected = (item) =>
      selectedItems.some((selected) =>
        isEqual(selected.value, item[accessors.value])
      );

    const buttons = useMemo(
      () => [
        { label: buttonLabels[0] || "", value: "all" },
        { label: buttonLabels[1] || "", value: "assigned" },
      ],
      [buttonLabels]
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

    const getButtonClassname = (value) =>
      isEqual(value, activeButton)
        ? styles.activeButton
        : styles.inactiveButton;

    const renderButtons = useCallback(
      () =>
        buttons.map((btn, idx) => (
          <Button
            className={getButtonClassname(btn.value)}
            key={idx}
            onClick={() => setActiveButton(btn.value)}
          >
            {convertToUpperCase(btn.label)}
          </Button>
        )),
      [activeButton, buttons]
    );

    const renderAllView = () => (
      <div className="mb-2">
        {(allData.data || []).map((item, idx) => {
          const isSelected = isItemSelected(item);
          return (
            <Button
              className={cn("d-block", isSelected && styles.activeItem)}
              isAnchor
              key={idx}
              onClick={() => handleSelectItem(item)}
            >
              {isSelected && <i className="fas fa-check mr-2" />}
              {item[accessors.label]}
            </Button>
          );
        })}
      </div>
    );

    const renderAssignedView = () => (
      <div className="mb-2">
        <ol className="pl-3">
          {selectedItems.map((selectedItem, idx) => (
            <li key={idx}>
              <strong>{selectedItem.label}</strong>
            </li>
          ))}
        </ol>
      </div>
    );

    return (
      <>
        <div className="d-flex justify-content-around mb-2">
          {renderButtons()}
        </div>
        {isEqual(activeButton, buttons[0].value) && renderAllView()}
        {isEqual(activeButton, buttons[1].value) && renderAssignedView()}
        <Button isSubmit />
      </>
    );
  }
);

const dataType = shape({
  data: array,
  title: string,
});

AssignData.propTypes = {
  accessors: shape({
    value: string,
    label: string,
  }),
  allData: dataType,
  assignedData: dataType,
};

AssignData.displayName = "AssignData";
