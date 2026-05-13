import { Accordion as AccordionChakra, Box, Flex } from "@chakra-ui/react";
import type { FC } from "react";

import { ChevronDownIcon } from "@/redesignComponents/foundations/Icons";

import { AccordionProps, AccordionVariant } from "./types";

const variantStyles = {
  primary: {
    container: {
      background: "neutral.100",
      borderBottom: "0.0625rem solid",
      borderColor: "primary.900",
      paddingBottom: 3,
      paddingTop: 2,
      marginBottom: 4,
      width: "100%",
      alignItems: "center",
      justifyContent: "space-between"
    },
    header: {
      gap: 5
    }
  },
  secondary: {
    container: {
      background: "neutral.200",
      paddingX: 4,
      paddingBottom: 4,
      paddingTop: 3,
      marginBottom: 4,
      width: "100%",
      alignItems: "center",
      justifyContent: "space-between"
    },
    header: {
      gap: 3
    }
  },
  borderless: {
    container: {
      background: "neutral.100",
      padding: 4
    },
    header: {
      gap: 2
    }
  }
};

const AccordionIconInner: FC<{ variant: AccordionVariant }> = ({ variant }) => {
  if (variant === "secondary") {
    return <ChevronDownIcon boxSize={4} color="neutral.900" />;
  }

  return <ChevronDownIcon boxSize={4} color="neutral.900" />;
};

const AccordionIcon: FC<{ variant: AccordionVariant }> = ({ variant }) => (
  <AccordionChakra.ItemIndicator>
    <AccordionIconInner variant={variant} />
  </AccordionChakra.ItemIndicator>
);

const Accordion: FC<AccordionProps> = ({
  children,
  header,
  actions,
  variant = "primary",
  className,
  classNameHeader,
  defaultOpen = false
}) => {
  const { container, header: headerStyles } = variantStyles[variant];

  const handleActionsClick = (e: React.MouseEvent) => {
    e.stopPropagation();
  };

  return (
    <Box className={className}>
      <AccordionChakra.Root multiple defaultValue={defaultOpen ? ["default-item"] : []}>
        <AccordionChakra.Item value="default-item">
          <Flex {...container} gap={4} className={classNameHeader}>
            <AccordionChakra.ItemTrigger css={{ outline: "none" }}>
              <Flex flex="1" alignItems="center" justifyContent="space-between" width="100%" {...headerStyles}>
                <Flex gap={3} flex="1" alignItems="center" justifyContent="space-between" width="100%">
                  <Box flex="1" fontSize="1.25rem" lineHeight="1.75rem" color="primary.900">
                    {header}
                  </Box>

                  {actions && (
                    <Box display="flex" gap={3} alignItems="center" onClick={handleActionsClick} flexShrink={0}>
                      {actions}
                    </Box>
                  )}
                </Flex>

                <AccordionIcon variant={variant} />
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
