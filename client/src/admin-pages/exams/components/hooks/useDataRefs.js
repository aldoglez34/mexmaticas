import { createRef, useMemo } from "react";
import { isEmpty } from "lodash";

export const useDataRefs = (data = []) => {
  const dataWithRefs = useMemo(() => {
    if (isEmpty(data)) return {};

    return data.map((item) => ({ ...item, ref: createRef() }));
  }, [data]);

  return { dataWithRefs };
};
