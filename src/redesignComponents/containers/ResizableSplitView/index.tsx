import { Box } from "@chakra-ui/react";
import { FC, PropsWithChildren, ReactNode, useCallback, useRef, useState } from "react";

import { ArrowOutwardIcon } from "@/redesignComponents/foundations/Icons";

type RenderProps = {
  topHeight: number;
  onMouseDown: () => void;
};

type ResizableSplitViewProps = {
  children: (props: RenderProps) => ReactNode;
  initialTopHeight?: number;
  min?: number;
  max?: number;
};

type TopProps = {
  height: number;
  onMouseDown: () => void;
};

type BottomProps = {};

type ResizableSplitViewComponent = FC<ResizableSplitViewProps> & {
  Top: FC<PropsWithChildren<TopProps>>;
  Bottom: FC<PropsWithChildren<BottomProps>>;
};

const ResizableSplitView = (({ children, initialTopHeight = 60, min = 30, max = 85 }) => {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [topHeight, setTopHeight] = useState<number>(initialTopHeight);
  const isDragging = useRef(false);

  const handleMouseDown = useCallback(() => {
    isDragging.current = true;
  }, []);

  const handleMouseMove = useCallback(
    (e: React.MouseEvent) => {
      if (!isDragging.current || !containerRef.current) return;

      const rect = containerRef.current.getBoundingClientRect();
      const newHeight = ((e.clientY - rect.top) / rect.height) * 100;

      if (newHeight > min && newHeight < max) {
        setTopHeight(newHeight);
      }
    },
    [min, max]
  );

  const handleMouseUp = useCallback(() => {
    isDragging.current = false;
  }, []);

  return (
    <Box
      ref={containerRef}
      h="100%"
      display="flex"
      flexDirection="column"
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
    >
      {children({
        topHeight,
        onMouseDown: handleMouseDown
      })}
    </Box>
  );
}) as ResizableSplitViewComponent;

ResizableSplitView.Top = function Top({ height, children, onMouseDown }: PropsWithChildren<TopProps>) {
  return (
    <Box h={`${height}%`} position="relative">
      {children}

      <Box position="absolute" bottom="-25px" left="0" right="0" w="100%" h="50px" zIndex={10}>
        <Box
          position="absolute"
          w="100%"
          h="0px"
          border="1px dashed"
          borderColor="primary.800"
          top="50%"
          transform="translateY(-50%)"
        />

        <Box
          as="button"
          aria-label="Resize panels"
          onMouseDown={onMouseDown}
          position="absolute"
          top="50%"
          left="50%"
          transform="translate(-50%, -50%)"
          display="flex"
          alignItems="center"
          justifyContent="center"
          cursor="pointer"
          bg="transparent"
          border="none"
          outline="none"
          _hover={{ transform: "translate(-50%, -50%) scale(1.05)" }}
          transition="transform 0.2s"
        >
          <Box
            h={10}
            w={10}
            shadow="md"
            bg="neutral.100"
            border="1px solid"
            borderColor="primary.800"
            borderRadius="full"
            display="flex"
            alignItems="center"
            justifyContent="center"
          >
            <ArrowOutwardIcon color="primary.800" />
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

ResizableSplitView.Bottom = function Bottom({ children }: PropsWithChildren<BottomProps>) {
  return (
    <Box flex="1" overflow="auto" bg="gray.50">
      {children}
    </Box>
  );
};

export default ResizableSplitView;
