import { Accordion as AccordionChakra, Box, Flex } from "@chakra-ui/react";
import SVG from "react-inlinesvg";

import chevronDownIcon from "@/assets/icons/chevron-down.svg";
import { getThemedColor } from "@/lib/theme";

import { ExtendableCardProps } from "./types";

const Accordion = ({ children, header }: ExtendableCardProps) => (
  <Box padding={4}>
    <AccordionChakra.Root multiple>
      <AccordionChakra.Item>
        <Flex
          borderBottom="1px solid"
          borderColor={getThemedColor("primary", 900)}
          paddingBottom={3}
          paddingTop={2}
          width="100%"
          alignItems="center"
          justifyContent="space-between"
          gap={4}
        >
          <AccordionChakra.ItemTrigger>
            <Flex gap={3} flex="1" overflow="hidden" alignItems="center">
              {header}
            </Flex>
          </AccordionChakra.ItemTrigger>
          <AccordionChakra.ItemIndicator>
            <SVG
              src={chevronDownIcon}
              width={16}
              height={16}
              style={{
                color: getThemedColor("neutral", 700)
              }}
            />
          </AccordionChakra.ItemIndicator>
        </Flex>
        <AccordionChakra.ItemContent>{children}</AccordionChakra.ItemContent>
      </AccordionChakra.Item>
    </AccordionChakra.Root>
  </Box>
);

export default Accordion;
