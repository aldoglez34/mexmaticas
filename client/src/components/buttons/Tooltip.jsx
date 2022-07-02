import React, { memo } from "react";
import { OverlayTrigger, Tooltip as BootstrapTooltip } from "react-bootstrap";
import { string } from "prop-types";
import cn from "classnames";

import styles from "./tooltip.module.scss";

export const Tooltip = memo(({ className, text }) => (
  <OverlayTrigger
    placement="right"
    overlay={<BootstrapTooltip>{text}</BootstrapTooltip>}
    className="ml-3"
  >
    <i className={cn("fa fa-question-circle", styles.tooltip, className)} />
  </OverlayTrigger>
));

Tooltip.propTypes = {
  className: string,
  text: string.isRequired,
};

Tooltip.displayName = "Tooltip";
