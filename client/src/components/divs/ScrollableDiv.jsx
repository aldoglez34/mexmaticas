import React, { memo } from "react";
import { any, string } from "prop-types";
import cn from "classnames";

import styles from "./scrollablediv.module.scss";

export const ScrollableDiv = memo(({ children, className }) => (
  <div className={cn(styles.divStyle, className)}>{children}</div>
));

ScrollableDiv.propTypes = {
  children: any,
  className: string,
};

ScrollableDiv.displayName = "ScrollableDiv";
