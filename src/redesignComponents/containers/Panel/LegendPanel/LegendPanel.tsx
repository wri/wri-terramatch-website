import { Box, Flex, Text } from "@chakra-ui/react";
import { FC, ReactNode, useRef, useState } from "react";

import { useOnMount } from "@/hooks/useOnMount";
import Button from "@/redesignComponents/actions/Buttons/Button/Button";
import { ChevronDownIcon } from "@/redesignComponents/foundations/Icons";
import SimpleDivider from "@/redesignComponents/miscellaneous/Dividers/SimpleDivider";

type IndicatorType = "raster" | "line" | "point";

interface LegendItem {
  indicatorType?: IndicatorType;
  color?: string;
  icon?: ReactNode;
  caption?: string;
  attribute: string;
  showHideButton?: boolean;
  onHide?: () => void;
  onShow?: () => void;
  show?: boolean;
}

interface LegendPanelProps {
  legendItems: LegendItem[];
  title?: string;
}

const LegendPanel: FC<LegendPanelProps> = ({ legendItems, title = "Legend" }) => {
  const [open, setOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useOnMount(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  });

  return (
    <Box position="relative" display="inline-block" ref={containerRef}>
      <Box
        className="w-fit min-w-[13.75rem]"
        bg={"neutral.100"}
        onClick={() => setOpen(!open)}
        pt={2}
        pb={3}
        px={4}
        role="button"
        display={"flex"}
        justifyContent={"space-between"}
        alignItems={"center"}
        rounded={open ? "0.25rem 0.25rem 0 0" : "0.25rem"}
        tabIndex={0}
        aria-expanded={open}
      >
        <Text textStyle={"400-bold"} color={"primary.900"}>
          {title}
        </Text>
        <ChevronDownIcon
          boxSize={4}
          color={"neutral.800"}
          transform={open ? "rotate(-180deg)" : "rotate(0deg)"}
          transition={"transform 0.3s ease-in-out"}
        />
      </Box>

      {open && (
        <Box left={0} bg="white" borderRadius={"0 0 0.25rem 0.25rem"} minW="13.75rem" px={4} pb={3} zIndex={9999}>
          <Flex gap={3} flexDir={"column"}>
            <SimpleDivider />
            {legendItems.map((legendItem, index) => (
              <Box key={index}>
                <Flex align="center" gap={2} w="100%" justifyContent="space-between">
                  <Flex gap={2} alignItems="self-start">
                    <Flex h={4} w={4} justifyContent="center" alignItems="center">
                      {legendItem.indicatorType === "raster" ? (
                        <Box
                          h={4}
                          w={4}
                          bg={legendItem.color}
                          borderRadius="full"
                          border="0.0625rem solid"
                          borderColor="neutral.400"
                          flexShrink={0}
                        />
                      ) : legendItem.indicatorType === "line" ? (
                        <Box
                          h={"0.4rem"}
                          w={4}
                          bg={legendItem.color}
                          borderRadius="full"
                          border="0.0625rem solid"
                          borderColor="neutral.400"
                          flexShrink={0}
                        />
                      ) : (
                        <Flex
                          h={4}
                          w={4}
                          bg={legendItem.color}
                          borderRadius="full"
                          justifyContent="center"
                          alignItems="center"
                        >
                          {legendItem.icon}
                        </Flex>
                      )}
                    </Flex>

                    <Box textAlign={"start"}>
                      {legendItem.attribute && (
                        <Text textStyle={"300"} lineHeight={"normal"} color={"neutral.800"}>
                          {legendItem.attribute}
                        </Text>
                      )}
                      {legendItem.caption && (
                        <Text textStyle={"200"} color={"neutral.700"}>
                          {legendItem.caption}
                        </Text>
                      )}
                    </Box>
                  </Flex>

                  {legendItem.showHideButton ? (
                    <Button
                      size="small"
                      variant="borderless"
                      onClick={legendItem.show ? legendItem.onHide : legendItem.onShow}
                    >
                      {legendItem.show ? "Hide" : "Show"}
                    </Button>
                  ) : null}
                </Flex>
              </Box>
            ))}
          </Flex>
        </Box>
      )}
    </Box>
  );
};

export default LegendPanel;
