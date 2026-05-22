import { Box, Flex, FlexProps } from "@chakra-ui/react";
import React, { FC, useCallback, useEffect, useRef, useState } from "react";
import { twMerge } from "tailwind-merge";

import { resolveRemSizeValue } from "@/lib/sizing";
import { getThemedColor } from "@/lib/theme";
import { ArrowOutwardIcon } from "@/redesignComponents/foundations/Icons";

const DASH_BLUE_SVG =
  '<svg width="12" height="2" viewBox="0 0 12 2" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M2.99999 2.00039C2.17499 2.00039 1.49023 2.00003 0.881247 2.00003C0 2.00039 0 1.27539 0 1.00039C0 0.725392 -0.00976562 0 0.990234 0C1.99023 0 2.17499 0.000391938 2.99999 0.000391938C3.82498 0.000391938 4.49023 2.89753e-05 4.99023 2.89753e-05C5.99023 0 5.99998 0.725392 5.99998 1.00039C5.99998 1.27539 5.99998 2.00039 4.99023 2.00003C4.49023 1.99985 3.82498 2.00039 2.99999 2.00039Z" fill="#11688D"/></svg>';

const DASH_BLUE_BACKGROUND_IMAGE = `url("data:image/svg+xml,${encodeURIComponent(DASH_BLUE_SVG)}")`;

type ResizableBoxProps = FlexProps & {
  initialHeight?: number;
  minHeight?: number;
  maxHeight?: number;
};

const ResizableBox: FC<ResizableBoxProps> = ({
  children,
  className,
  initialHeight = 80,
  minHeight = 40,
  maxHeight = 225,
  ...props
}) => {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const rootFontSizeRef = useRef(16);
  const [isDragging, setIsDragging] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [heightUnits, setHeightUnits] = useState<number>(initialHeight);

  const pxToUnits = useCallback((value: number) => value / (0.25 * rootFontSizeRef.current), []);

  const clampHeightUnits = useCallback(
    (nextHeight: number) => Math.min(maxHeight, Math.max(minHeight, nextHeight)),
    [maxHeight, minHeight]
  );

  const handleMouseDown = useCallback((event: React.MouseEvent<HTMLDivElement>) => {
    event.preventDefault();
    setIsDragging(true);
  }, []);

  const handleMouseEnter = useCallback(() => {
    setIsHovered(true);
  }, []);

  const handleMouseLeave = useCallback(() => {
    setIsHovered(false);
  }, []);

  useEffect(() => {
    setHeightUnits(initialHeight);
  }, [initialHeight]);

  useEffect(() => {
    const computedRootFontSize = window.getComputedStyle(document.documentElement).fontSize;
    const parsedRootFontSize = Number.parseFloat(computedRootFontSize);
    if (!Number.isNaN(parsedRootFontSize)) {
      rootFontSizeRef.current = parsedRootFontSize;
    }
  }, []);

  useEffect(() => {
    if (!isDragging) return;

    const handleMouseMove = (event: MouseEvent) => {
      if (!containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      const nextHeightUnits = clampHeightUnits(pxToUnits(event.clientY - rect.top));
      setHeightUnits(nextHeightUnits);
    };

    const handleMouseUp = () => {
      setIsDragging(false);
    };

    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mouseup", handleMouseUp);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleMouseUp);
    };
  }, [clampHeightUnits, isDragging, pxToUnits]);

  return (
    <Flex
      ref={containerRef}
      className={twMerge("relative flex-col", className)}
      h={resolveRemSizeValue(heightUnits)}
      minH={resolveRemSizeValue(minHeight)}
      maxH={resolveRemSizeValue(maxHeight)}
      {...props}
    >
      {children}

      <Box
        className="relative h-[0.188rem] shrink-0"
        style={{
          background: isDragging ? `${DASH_BLUE_BACKGROUND_IMAGE} repeat-x center` : undefined,
          backgroundColor: isDragging
            ? undefined
            : isHovered
            ? getThemedColor("primary", 500)
            : getThemedColor("neutral", 500)
        }}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        <Box
          onMouseDown={handleMouseDown}
          className="shadow-md z-2 absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full border border-neutral-300 bg-theme-neutral-100 p-2.5"
          style={{
            display: isDragging || isHovered ? "block" : "none",
            cursor: isDragging ? "grabbing" : isHovered ? "grab" : "default"
          }}
        >
          <ArrowOutwardIcon color={isDragging ? "primary.800" : "primary.500"} boxSize={5} />
        </Box>
      </Box>
    </Flex>
  );
};

export default ResizableBox;
