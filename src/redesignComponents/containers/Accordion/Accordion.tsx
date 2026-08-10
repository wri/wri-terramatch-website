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
  tertiary: {
    container: {
      background: "neutral.100",
      paddingX: 4,
      paddingY: 3,
      marginBottom: 4,
      width: "100%",
      alignItems: "center",
      justifyContent: "space-between",
      borderRadius:
        "var(--Border-Radius-300, 4px) var(--Border-Radius-300, 4px) var(--Border-Radius-100, 0) var(--Border-Radius-100, 0)",
      borderTop: "var(--Border-Width-200, 2px) solid var(--Neutrals-300, #E7E6E6)"
    },
    header: {
      gap: 2
    }
  },
  quaternary: {
    container: {
      background: "neutral.100",
      padding: 4,
      marginBottom: 4,
      width: "100%",
      alignItems: "center",
      justifyContent: "space-between"
    },
    header: {
      gap: 2
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

const ACCORDION_ITEM_VALUE = "default-item";

const Accordion: FC<AccordionProps> = ({
  children,
  header,
  actions,
  variant = "primary",
  className,
  classNameHeader,
  defaultOpen = false,
  open,
  onOpenChange
}) => {
  const { container, header: headerStyles } = variantStyles[variant];
  const isControlled = open !== undefined;

  const handleValueChange = (details: { value: string[] }) => {
    onOpenChange?.(details.value.includes(ACCORDION_ITEM_VALUE));
  };

  return (
    <Box
      className={className}
      css={{
        "& [data-scope='accordion'][data-part='item-content']": {
          margin: "0 -2rem",
          padding: "0 2rem"
        },
        "& [data-scope='accordion'][data-part='item']": {
          overflow: "visible"
        },
        ...(variant === "tertiary"
          ? {
              "& [data-scope='accordion'][data-part='item'][data-state='open'] > [data-accordion-header]": {
                borderRadius:
                  "var(--Border-Radius-300, 4px) var(--Border-Radius-300, 4px) var(--Border-Radius-100, 0) var(--Border-Radius-100, 0)",
                borderTop: "var(--Border-Width-300, 4px) solid var(--Primary-500, #78CAED)",
                background: "var(--Primary-100, #F7FBFD)"
              }
            }
          : {}),
        ...(variant === "quaternary"
          ? {
              "& [data-scope='accordion'][data-part='item'][data-state='open'] > [data-accordion-header]": {
                borderBottom: "var(--Border-Width-100, 1px) solid var(--Neutrals-300, #E7E6E6) !important",
                borderTop: "none !important",
                background: "neutral.100 !important"
              }
            }
          : {})
      }}
    >
      <AccordionChakra.Root
        multiple
        {...(isControlled
          ? { value: open ? [ACCORDION_ITEM_VALUE] : [], onValueChange: handleValueChange }
          : {
              defaultValue: defaultOpen ? [ACCORDION_ITEM_VALUE] : [],
              onValueChange: handleValueChange
            })}
      >
        <AccordionChakra.Item value={ACCORDION_ITEM_VALUE}>
          <Flex {...container} gap={4} className={classNameHeader} alignItems="center" data-accordion-header="">
            <AccordionChakra.ItemTrigger
              css={{
                outline: "none",
                flex: 1,
                minWidth: 0
              }}
            >
              <Flex flex="1" alignItems="center" width="100%" {...headerStyles}>
                <Box flex="1" fontSize="1.25rem" lineHeight="1.75rem" color="primary.900">
                  {header}
                </Box>
              </Flex>
            </AccordionChakra.ItemTrigger>
            {actions != null ? (
              <Box display="flex" gap={3} alignItems="center" flexShrink={0}>
                {actions}
              </Box>
            ) : null}
            <AccordionChakra.ItemTrigger
              css={{ outline: "none", flexShrink: 0, cursor: "pointer", width: "fit-content" }}
            >
              <AccordionIcon variant={variant} />
            </AccordionChakra.ItemTrigger>
          </Flex>

          <AccordionChakra.ItemContent>{children}</AccordionChakra.ItemContent>
        </AccordionChakra.Item>
      </AccordionChakra.Root>
    </Box>
  );
};

export default Accordion;
