import { type RefObject, useEffect, useState } from "react";

import { HIDDEN_STICKY_COLUMN_EDGE_STYLES } from "@/redesignComponents/dataDisplay/Table/tableStyles";

type UsePolygonTableStickyStylesParams = {
  scrollContainerRef: RefObject<HTMLDivElement>;
  /** The scroll container mounts and changes with these, so the listener is re-attached when they change. */
  isLoading: boolean;
  isEmpty: boolean;
  rowCount: number;
};

/** Hides the sticky column edge until the table is scrolled horizontally. */
export const usePolygonTableStickyStyles = ({
  scrollContainerRef,
  isLoading,
  isEmpty,
  rowCount
}: UsePolygonTableStickyStylesParams) => {
  const [isStickyActive, setIsStickyActive] = useState(false);

  useEffect(() => {
    const scrollContainer = scrollContainerRef.current;
    if (scrollContainer == null) {
      return;
    }

    const handleScroll = () => {
      setIsStickyActive(scrollContainer.scrollLeft > 0);
    };

    handleScroll();
    scrollContainer.addEventListener("scroll", handleScroll);
    return () => scrollContainer.removeEventListener("scroll", handleScroll);
  }, [scrollContainerRef, isLoading, isEmpty, rowCount]);

  return isStickyActive ? undefined : HIDDEN_STICKY_COLUMN_EDGE_STYLES;
};
