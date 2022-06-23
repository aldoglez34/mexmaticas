import React from "react";
import { get, isEmpty } from "lodash";
import { getAccessorValue } from "../utils/helpers";
import { AdminEditModal, IconButton } from "../components";

export const useAdminRow = () => {
  const getSvg = (svg) => {
    if (!svg) return;
    switch (svg) {
      case "anchor":
        return <i className="fas fa-paper-plane" />;
      case "edit":
        return <i className="fas fa-pen-alt" />;
      default:
        return <i className="fas fa-pen-alt" />;
    }
  };

  const renderIcon = (icon, item) => {
    // if there's a link then create the href
    if (icon.link) {
      return (
        <IconButton
          {...{
            hoverText: icon.hoverText ?? "",
            href: `${icon.link.url}${get(item, icon.link.urlAccessor)}`,
            icon: getSvg(icon.svg),
            isDisabled: icon.isDisabled,
          }}
        />
      );
    }

    // if it's a modal assign the content
    if (icon.modal) {
      return (
        <AdminEditModal
          Form={icon.modal.Form}
          formInitialText={icon.modal.initialValue}
          formLabel={icon.hoverText ?? ""}
          hoverText={icon.hoverText ?? ""}
          icon={getSvg(icon.svg)}
          modalTitle={icon.modal.title ?? ""}
          isDisabled={icon.isDisabled}
        />
      );
    }
  };

  const renderList = (list) => {
    if (!list.data || isEmpty(list.data)) return <span>-</span>;
    return (
      <ul>
        {list.data.map((item, idx) => {
          const value = getAccessorValue(item, list.accessor).trim();
          return (
            <li key={idx}>
              {value}
              {list.icon && renderIcon(list.icon, item)}
            </li>
          );
        })}
      </ul>
    );
  };

  return { renderIcon, renderList };
};
