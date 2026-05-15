import { Box, Flex, FlexProps } from "@chakra-ui/react";
import React, { FC, useCallback, useEffect, useRef, useState } from "react";
import { twMerge } from "tailwind-merge";

import { resolveRemSizeValue } from "@/lib/sizing";
import { getThemedColor } from "@/lib/theme";
import { ArrowOutwardIcon } from "@/redesignComponents/foundations/Icons";

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
          background: isDragging
            ? `url('/icons/dash-blue.svg') repeat-x center`
            : isHovered
            ? getThemedColor("primary", 500)
            : getThemedColor("neutral", 500)
        }}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        <Box
          onMouseDown={handleMouseDown}
          className="shadow-md z-2 bg-theme-neutral-100 absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full border border-neutral-300 p-2.5"
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
