import { Accordion as AccordionChakra, Box, Flex } from "@chakra-ui/react";
import { useEffect, useRef, useState } from "react";

import { ChevronDown } from "@/redesignComponents/foundations/Icons";

import { ExtendableCardProps } from "./types";

const Accordion = ({ children, header, actions }: ExtendableCardProps) => {
  const refActions = useRef<HTMLDivElement>(null);
  const [actionsWidth, setActionsWidth] = useState(0);

  useEffect(() => {
    if (refActions.current) {
      setActionsWidth(refActions.current.offsetWidth);
    }
  }, []);

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
            position="relative"
          >
            <AccordionChakra.ItemTrigger>
              <Flex gap={5} flex="1" alignItems="center" justifyContent="space-between">
                <Box
                  marginRight={actions ? actionsWidth + 12 : 0}
                  width="full"
                  fontSize="20px"
                  lineHeight="28px"
                  color="primary.900"
                >
                  {header}
                </Box>
                <AccordionChakra.ItemIndicator>
                  <ChevronDown boxSize={4} color="neutral.900" />
                </AccordionChakra.ItemIndicator>
              </Flex>
            </AccordionChakra.ItemTrigger>
            {actions && (
              <Box
                display="flex"
                gap={3}
                alignItems="center"
                position="absolute"
                top="50%"
                height="full"
                paddingTop={2}
                paddingBottom={3}
                transform="translateY(-50%)"
                right={9}
                zIndex={10}
                ref={refActions}
              >
                {actions}
              </Box>
            )}
          </Flex>
          <AccordionChakra.ItemContent>{children}</AccordionChakra.ItemContent>
        </AccordionChakra.Item>
      </AccordionChakra.Root>
    </Box>
  );
};

export default Accordion;
