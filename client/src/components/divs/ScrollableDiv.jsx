import React, { useLayoutEffect, useRef } from "react";
import { any, string } from "prop-types";
import cn from "classnames";

import styles from "./scrollablediv.module.scss";

export const ScrollableDiv = ({ children, className }) => {
  const divRef = useRef(null);

  useLayoutEffect(() => {
    const ref = divRef.current;
    ref.scrollTo({
      behavior: "smooth",
    });
    ref.scrollIntoView({
      behavior: "smooth",
    });
  }, [children, className]);

  return (
    <div className={cn(styles.divStyle, className)}>
      {children}
      <div ref={divRef}></div>
    </div>
  );
};

ScrollableDiv.propTypes = {
  children: any,
  className: string,
};

ScrollableDiv.displayName = "ScrollableDiv";
