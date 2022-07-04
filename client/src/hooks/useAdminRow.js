import React from "react";
import { isEmpty, isEqual } from "lodash";
import { getAccessorValue } from "../utils/helpers";
import {
  Button,
  DraggableList,
  IconButton,
  ModalIconButton,
} from "../components";
import cn from "classnames";

export const useAdminRow = () => {
  const renderIcon = (icon, item) => {
    const isLink = !!icon.getLink;
    const isFunc = !!icon.onClick;
    const isModal = !!icon.modal;

    if (isLink || isFunc) {
      return (
        <IconButton
          {...{
            hoverText: icon.hoverText,
            isDisabled: icon.isDisabled,
            svg: icon.svg,
            ...(isLink && { href: icon.getLink(item) }),
            ...(isFunc && { onClick: () => icon.onClick(item) }),
          }}
        />
      );
    }

    if (isModal) {
      const { Form, initialValue, size, title } = icon.modal;
      return (
        <ModalIconButton
          {...{
            Form: !isEqual(typeof Form, "function") ? Form : Form(item),
            formLabel: icon.hoverText,
            hoverText: icon.hoverText,
            isDisabled: icon.isDisabled,
            modalTitle: !isEqual(typeof title, "function")
              ? title
              : title(item),
            svg: icon.svg,
            ...(initialValue && { formInitialText: initialValue }),
            ...(size && { size }),
          }}
        />
      );
    }
  };

  const renderList = (list, className) => {
    if (isEmpty(list.data)) return <span>-</span>;
    return list.data.map((item, idx) => {
      if (item.hasRef) {
        const scrollToRef = () => item.ref.current.scrollIntoView();
        return (
          <React.Fragment key={idx}>
            <Button hoverText="Ir a preguntas" isAnchor onClick={scrollToRef}>
              {getAccessorValue(item, list.accessor).trim()}
            </Button>
            {list.icon && renderIcon(list.icon, item)}
          </React.Fragment>
        );
      }
      return (
        <span className={cn("d-block", className)} key={idx}>
          {getAccessorValue(item, list.accessor).trim()}
          {list.icon && renderIcon(list.icon, item)}
        </span>
      );
    });
  };

  const renderDraggableList = (list) => {
    if (isEmpty(list.data)) return <span>-</span>;
    return <DraggableList list={list} handleOnChange={list.onOrderChange} />;
  };

  return { renderDraggableList, renderIcon, renderList };
};
