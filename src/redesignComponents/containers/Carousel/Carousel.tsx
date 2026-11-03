import { Box, Flex } from "@chakra-ui/react";
import { FC, ReactNode, useCallback, useEffect, useRef, useState } from "react";

import IconButton from "@/redesignComponents/actions/Buttons/IconButton/IconButton";
import { ChevronRightIcon } from "@/redesignComponents/foundations/Icons";

export interface CarouselProps {
  children: ReactNode;
  className?: string;
  gap?: number;
  scrollAmount?: number;
}

const fadeOverlayCss = (direction: "left" | "right") => ({
  background: `
    linear-gradient(
      to ${direction},
      white 0%,
      rgba(255,255,255,0.85) 40%,
      rgba(255,255,255,0) 100%
    )
  `,
  backdropFilter: "blur(0.125rem)",
  WebkitBackdropFilter: "blur(0.125rem)"
});

const Carousel: FC<CarouselProps> = ({ children, className, gap = 2, scrollAmount = 200 }) => {
  const scrollRef = useRef<HTMLDivElement>(null);

  const [showLeftButton, setShowLeftButton] = useState(false);
  const [showRightButton, setShowRightButton] = useState(false);

  const updateScrollButtons = useCallback(() => {
    const container = scrollRef.current;

    if (!container) return;

    const { scrollLeft, scrollWidth, clientWidth } = container;

    setShowLeftButton(scrollLeft > 0);
    setShowRightButton(scrollLeft + clientWidth < scrollWidth - 1);
  }, []);

  const scrollLeftHandler = useCallback(() => {
    scrollRef.current?.scrollBy({
      left: -scrollAmount,
      behavior: "smooth"
    });
  }, [scrollAmount]);

  const scrollRightHandler = useCallback(() => {
    scrollRef.current?.scrollBy({
      left: scrollAmount,
      behavior: "smooth"
    });
  }, [scrollAmount]);

  useEffect(() => {
    const container = scrollRef.current;

    if (!container) return;

    updateScrollButtons();

    container.addEventListener("scroll", updateScrollButtons);
    window.addEventListener("resize", updateScrollButtons);

    const resizeObserver = new ResizeObserver(updateScrollButtons);
    resizeObserver.observe(container);

    const content = container.firstElementChild;
    if (content) {
      resizeObserver.observe(content);
    }

    return () => {
      container.removeEventListener("scroll", updateScrollButtons);
      window.removeEventListener("resize", updateScrollButtons);
      resizeObserver.disconnect();
    };
  }, [children, updateScrollButtons]);

  return (
    <Flex align="center" gap={2} minW="0" position="relative" className={className}>
      {showLeftButton && (
        <>
          <Box
            position="absolute"
            left="1rem"
            top="0"
            bottom="0"
            w="1.5rem"
            zIndex={1}
            pointerEvents="none"
            css={fadeOverlayCss("right")}
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
        minW={0}
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
        <Flex gap={gap} minW="full" w="max-content">
          {children}
        </Flex>
      </Box>

      {showRightButton && (
        <>
          <Box
            position="absolute"
            right="1rem"
            top="0"
            bottom="0"
            w="1.5rem"
            zIndex={1}
            pointerEvents="none"
            css={fadeOverlayCss("left")}
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

export default Carousel;
