import React from "react";
import { string } from "prop-types";
import cn from "classnames";

import styles from "./sectiontitle.module.scss";

export const SectionTitle = React.memo(({ title, text }) => {
  return (
    <div>
      <h1
        className={cn(
          "mb-4",
          "text-left",
          "text-md-center",
          styles.sectionTitle
        )}
      >
        {title}
      </h1>
      <p
        className={cn(
          "pb-3",
          "text-left",
          "text-md-center",
          styles.sectionText
        )}
      >
        {text}
      </p>
    </div>
  );
});

SectionTitle.propTypes = {
  text: string.isRequired,
  title: string.isRequired,
};
