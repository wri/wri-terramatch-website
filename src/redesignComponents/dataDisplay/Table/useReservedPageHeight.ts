import { RefObject, useLayoutEffect, useState } from "react";

// The WriTable root renders [scroll area, footer with pagination]; the height is reserved on the scroll area
// (`& > div > div:first-of-type` in Table's css) so the pagination stays where it was.
const TABLE_SCROLL_AREA_SELECTOR = ":scope > div > div:first-of-type";

/**
 * Measures the table's scroll area whenever a full page is rendered, and returns that height so it can be reserved
 * on pages with fewer rows. Returns null while disabled, before a full page has been seen, or after the page size
 * changes (the previous measurement no longer applies).
 */
export const useReservedPageHeight = (
  wrapperRef: RefObject<HTMLElement>,
  dataByPage: unknown[],
  pageSize: number,
  enabled: boolean
) => {
  const [reserved, setReserved] = useState<{ pageSize: number; height: number } | null>(null);
  const isFullPage = dataByPage.length === pageSize;

  useLayoutEffect(() => {
    if (!enabled || !isFullPage) return;
    const scrollArea = wrapperRef.current?.querySelector<HTMLElement>(TABLE_SCROLL_AREA_SELECTOR);
    if (scrollArea == null) return;
    const height = scrollArea.getBoundingClientRect().height;
    setReserved(previous =>
      previous?.pageSize === pageSize && Math.abs(previous.height - height) < 1 ? previous : { pageSize, height }
    );
  }, [dataByPage, enabled, isFullPage, pageSize, wrapperRef]);

  return enabled && reserved?.pageSize === pageSize ? reserved.height : null;
};
