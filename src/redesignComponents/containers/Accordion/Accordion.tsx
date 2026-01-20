import { Accordion as AccordionChakra, Box, Flex } from "@chakra-ui/react";

import { getThemedColor } from "@/lib/theme";
import { ChevronDown } from "@/redesignComponents/foundations/Icons";

import { ExtendableCardProps } from "./types";

const Accordion = ({ children, header, actions }: ExtendableCardProps) => (
  <Box padding={4}>
    <AccordionChakra.Root multiple>
      <AccordionChakra.Item>
        <Flex
          borderBottom="1px solid"
          borderColor={getThemedColor("primary", 900)}
          paddingBottom={3}
          paddingTop={2}
          marginBottom={4}
          width="100%"
          alignItems="center"
          justifyContent="space-between"
          gap={4}
        >
          <AccordionChakra.ItemTrigger>
            <Flex gap={3} flex="1" overflow="hidden" alignItems="center" justifyContent="space-between">
              {header}
              <Flex gap={3} alignItems="center">
                {actions && (
                  <Box
                    onClick={e => {
                      e.stopPropagation();
                    }}
                    display="flex"
                    gap={3}
                    alignItems="center"
                  >
                    {actions}
                  </Box>
                )}
                <AccordionChakra.ItemIndicator>
                  <ChevronDown boxSize={4} color={getThemedColor("neutral", 900)} />
                </AccordionChakra.ItemIndicator>
              </Flex>
            </Flex>
          </AccordionChakra.ItemTrigger>
        </Flex>
        <AccordionChakra.ItemContent>{children}</AccordionChakra.ItemContent>
      </AccordionChakra.Item>
    </AccordionChakra.Root>
  </Box>
);

export default Accordion;
