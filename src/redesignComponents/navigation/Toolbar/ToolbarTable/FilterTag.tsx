import { Box, Flex } from "@chakra-ui/react";
import { FC, useEffect, useRef, useState } from "react";

import IconButton from "@/redesignComponents/actions/Buttons/IconButton/IconButton";
import { ChevronRightIcon } from "@/redesignComponents/foundations/Icons";

import FilterTagItem from "./FilterTagItem";

interface FilterTagProps {
  selectedFilters?: (string | string[])[];
}

const FilterTag: FC<FilterTagProps> = ({ selectedFilters }) => {
  const scrollRef = useRef<HTMLDivElement>(null);

  const [showLeftButton, setShowLeftButton] = useState(false);
  const [showRightButton, setShowRightButton] = useState(false);

  const updateScrollButtons = () => {
    const container = scrollRef.current;

    if (!container) return;

    const { scrollLeft, scrollWidth, clientWidth } = container;

    setShowLeftButton(scrollLeft > 0);

    setShowRightButton(scrollLeft + clientWidth < scrollWidth - 1);
  };

  useEffect(() => {
    updateScrollButtons();

    const container = scrollRef.current;

    if (!container) return;

    container.addEventListener("scroll", updateScrollButtons);

    window.addEventListener("resize", updateScrollButtons);

    return () => {
      container.removeEventListener("scroll", updateScrollButtons);
      window.removeEventListener("resize", updateScrollButtons);
    };
  }, [selectedFilters]);

  if (!selectedFilters?.length) {
    return null;
  }

  const scrollLeftHandler = () => {
    scrollRef.current?.scrollBy({
      left: -200,
      behavior: "smooth"
    });
  };

  const scrollRightHandler = () => {
    scrollRef.current?.scrollBy({
      left: 200,
      behavior: "smooth"
    });
  };

  return (
    <Flex align="center" gap={2} maxW="60vw" position="relative">
      {showLeftButton && (
        <>
          <Box
            position="absolute"
            left="32px"
            top="0"
            bottom="0"
            w="24px"
            zIndex={1}
            pointerEvents="none"
            css={{
              background: `
      linear-gradient(
        to right,
        white 0%,
        rgba(255,255,255,0.85) 40%,
        rgba(255,255,255,0) 100%
      )
    `,
              backdropFilter: "blur(2px)",
              WebkitBackdropFilter: "blur(2px)"
            }}
          />

          <IconButton
            variant="borderless"
            size="small"
            onClick={scrollLeftHandler}
            icon={<ChevronRightIcon className="!rotate-180" boxSize={4} />}
          />
        </>
      )}

      <Box
        ref={scrollRef}
        overflowX="auto"
        overflowY="hidden"
        whiteSpace="nowrap"
        flex="1"
        className="scroll-smooth"
        css={{
          scrollbarWidth: "none",
          msOverflowStyle: "none",
          "&::-webkit-scrollbar": {
            display: "none",
            width: 0,
            height: 0
          }
        }}
      >
        <Flex gap={2}>
          {selectedFilters.map((filter, index) => (
            <FilterTagItem label={filter} key={index} />
          ))}
        </Flex>
      </Box>

      {showRightButton && (
        <>
          <Box
            position="absolute"
            right="32px"
            top="0"
            bottom="0"
            w="24px"
            zIndex={1}
            pointerEvents="none"
            css={{
              background: `
      linear-gradient(
        to left,
        white 0%,
        rgba(255,255,255,0.85) 40%,
        rgba(255,255,255,0) 100%
      )
    `,
              backdropFilter: "blur(2px)",
              WebkitBackdropFilter: "blur(2px)"
            }}
          />

          <IconButton
            variant="borderless"
            size="small"
            onClick={scrollRightHandler}
            icon={<ChevronRightIcon boxSize={4} />}
          />
        </>
      )}
    </Flex>
  );
};

export default FilterTag;
