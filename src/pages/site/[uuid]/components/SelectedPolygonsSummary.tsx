import { Box, Text } from "@chakra-ui/react";
import { useT } from "@transifex/react";
import { FC, useEffect, useLayoutEffect, useMemo, useRef, useState } from "react";

import Button from "@/redesignComponents/actions/Buttons/Button/Button";
import { ChevronRightIcon } from "@/redesignComponents/foundations/Icons";

import { PolygonTableRow } from "./PolygonTableRow";

export type SelectedPolygonsSummaryProps = {
  selectedPolygons: PolygonTableRow[];
  open?: boolean;
};

const computeHiddenPolygonCount = (polygons: PolygonTableRow[], measureEl: HTMLElement): number => {
  if (polygons.length === 0) {
    return 0;
  }

  const setMeasureText = (count: number) => {
    measureEl.textContent = polygons
      .slice(0, count)
      .map(polygon => polygon.polygonName)
      .join(", ");
  };

  setMeasureText(polygons.length);
  if (measureEl.scrollHeight <= measureEl.clientHeight) {
    return 0;
  }

  let visibleCount = 0;
  for (let i = 1; i <= polygons.length; i++) {
    setMeasureText(i);
    if (measureEl.scrollHeight > measureEl.clientHeight) {
      visibleCount = i - 1;
      return polygons.length - visibleCount;
    }
    visibleCount = i;
  }

  return polygons.length - visibleCount;
};

const SelectedPolygonsSummary: FC<SelectedPolygonsSummaryProps> = ({ selectedPolygons, open }) => {
  const t = useT();
  const [isExpanded, setIsExpanded] = useState(false);
  const [hiddenCount, setHiddenCount] = useState(0);
  const measureRef = useRef<HTMLSpanElement>(null);

  const polygonNamesText = useMemo(
    () => selectedPolygons.map(polygon => polygon.polygonName).join(", "),
    [selectedPolygons]
  );

  useEffect(() => {
    if (!open) {
      setIsExpanded(false);
    }
  }, [open]);

  useLayoutEffect(() => {
    if (isExpanded) {
      setHiddenCount(0);
      return;
    }

    const measureEl = measureRef.current;
    if (measureEl == null) {
      return;
    }

    const updateHiddenCount = () => {
      setHiddenCount(computeHiddenPolygonCount(selectedPolygons, measureEl));
    };

    updateHiddenCount();
    window.addEventListener("resize", updateHiddenCount);
    return () => window.removeEventListener("resize", updateHiddenCount);
  }, [isExpanded, selectedPolygons]);

  const showMoreButton = !isExpanded && hiddenCount > 0;

  return (
    <Box className="relative w-full">
      <Text
        as="span"
        textStyle="400"
        color="primary.900"
        className={`relative break-all ${isExpanded ? "line-clamp-none" : "line-clamp-2"}`}
      >
        {polygonNamesText}
        {showMoreButton && (
          <Button
            className="absolute right-0 top-full !h-6 -translate-y-full !bg-theme-neutral-100 !py-0 hover:!bg-[#e4f4fb]"
            as={"span"}
            rightIcon={<ChevronRightIcon />}
            variant="borderless"
            onClick={() => setIsExpanded(true)}
          >
            {t("+{count} More", { count: hiddenCount })}
          </Button>
        )}
      </Text>
      <span
        ref={measureRef}
        aria-hidden
        className="pointer-events-none absolute left-0 top-0 w-full break-all text-[0.875rem] leading-normal text-theme-primary-900 opacity-0 line-clamp-2"
      />
    </Box>
  );
};

export default SelectedPolygonsSummary;
