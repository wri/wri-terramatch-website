import { Accordion as AccordionChakra, Box, Flex } from "@chakra-ui/react";

import { ChevronDown } from "@/redesignComponents/foundations/Icons";

import { ExtendableCardProps } from "./types";

const Accordion = ({ children, header, actions }: ExtendableCardProps) => {
  const handleActionsClick = (e: React.MouseEvent) => {
    e.stopPropagation();
  };

  return (
    <Box padding={4}>
      <AccordionChakra.Root multiple>
        <AccordionChakra.Item>
          <Flex
            borderBottom="1px solid"
            borderColor="primary.900"
            paddingBottom={3}
            paddingTop={2}
            marginBottom={4}
            width="100%"
            alignItems="center"
            justifyContent="space-between"
            gap={4}
          >
            <AccordionChakra.ItemTrigger>
              <Flex gap={5} flex="1" alignItems="center" justifyContent="space-between" width="100%">
                <Flex gap={3} flex="1" alignItems="center" justifyContent="space-between" width="100%">
                  <Box flex="1" fontSize="20px" lineHeight="28px" color="primary.900">
                    {header}
                  </Box>
                  {actions && (
                    <Box display="flex" gap={3} alignItems="center" onClick={handleActionsClick} flexShrink={0}>
                      {actions}
                    </Box>
                  )}
                </Flex>
                <AccordionChakra.ItemIndicator>
                  <ChevronDown boxSize={4} color="neutral.900" />
                </AccordionChakra.ItemIndicator>
              </Flex>
            </AccordionChakra.ItemTrigger>
          </Flex>
          <AccordionChakra.ItemContent>{children}</AccordionChakra.ItemContent>
        </AccordionChakra.Item>
      </AccordionChakra.Root>
    </Box>
  );
};

export default Accordion;
