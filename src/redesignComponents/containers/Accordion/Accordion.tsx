import { Accordion as AccordionChakra, Box, Flex, useAccordionItemContext } from "@chakra-ui/react";
import type { ComponentType, FC } from "react";

import { ChevronDown, Minus, Plus } from "@/redesignComponents/foundations/Icons";

import { AccordionProps, AccordionVariant } from "./types";

const ICON_PROPS = {
  boxSize: 4,
  color: "neutral.900" as const
};

const variantStyles = {
  primary: {
    container: {
      background: "neutral.100",
      borderBottom: "1px solid",
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
    },
    icon: {
      component: ChevronDown as ComponentType<{ boxSize: number; color: string }>,
      props: ICON_PROPS
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
  }
};

const AccordionIconInner: FC<{ variant: AccordionVariant }> = ({ variant }) => {
  const { expanded } = useAccordionItemContext();
  if (variant === "secondary") {
    const IconComponent = expanded ? Minus : Plus;
    return <IconComponent boxSize={6} color={ICON_PROPS.color} />;
  }

  const { component: IconComponent, props } = variantStyles.primary.icon;
  return <IconComponent {...props} />;
};

const AccordionIcon: FC<{ variant: AccordionVariant }> = ({ variant }) => (
  <AccordionChakra.ItemIndicator>
    <AccordionIconInner variant={variant} />
  </AccordionChakra.ItemIndicator>
);

const Accordion: FC<AccordionProps> = ({ children, header, actions, variant = "primary", className }) => {
  const { container, header: headerStyles } = variantStyles[variant];

  const handleActionsClick = (e: React.MouseEvent) => {
    e.stopPropagation();
  };

  return (
    <Box className={className}>
      <AccordionChakra.Root multiple>
        <AccordionChakra.Item>
          <Flex {...container} gap={4}>
            <AccordionChakra.ItemTrigger css={{ outline: "none" }}>
              <Flex flex="1" alignItems="center" justifyContent="space-between" width="100%" {...headerStyles}>
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
