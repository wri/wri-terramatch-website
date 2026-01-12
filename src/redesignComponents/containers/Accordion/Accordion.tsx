import { Accordion as AccordionChakra, Box, Flex } from "@chakra-ui/react";

import { getThemedColor } from "@/lib/theme";
import { ChevronDown } from "@/redesignComponents/foundations/Icons";

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
            <Flex gap={3} flex="1" overflow="hidden" alignItems="center" justifyContent="space-between">
              {header}
              <AccordionChakra.ItemIndicator>
                <ChevronDown boxSize={6} color={getThemedColor("neutral", 900)} />
              </AccordionChakra.ItemIndicator>
            </Flex>
          </AccordionChakra.ItemTrigger>
        </Flex>
        <AccordionChakra.ItemContent>{children}</AccordionChakra.ItemContent>
      </AccordionChakra.Item>
    </AccordionChakra.Root>
  </Box>
);

export default Accordion;
