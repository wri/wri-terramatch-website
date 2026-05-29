import { Accordion as AccordionChakra, Box, Flex } from "@chakra-ui/react";
import type { FC, SyntheticEvent } from "react";

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

  const stopTriggerActivation = (e: SyntheticEvent) => {
    e.stopPropagation();
  };

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
          overflow: "hidden"
        }
      }}
    >
      <AccordionChakra.Root
        multiple
        {...(isControlled
          ? { value: open ? [ACCORDION_ITEM_VALUE] : [], onValueChange: handleValueChange }
          : { defaultValue: defaultOpen ? [ACCORDION_ITEM_VALUE] : [] })}
      >
        <AccordionChakra.Item value={ACCORDION_ITEM_VALUE}>
          <Flex {...container} gap={4} className={classNameHeader} alignItems="center">
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
                <AccordionIcon variant={variant} />
              </Flex>
            </AccordionChakra.ItemTrigger>
            {actions != null ? (
              <Box
                display="flex"
                gap={3}
                alignItems="center"
                flexShrink={0}
                onClick={stopTriggerActivation}
                onPointerDown={stopTriggerActivation}
              >
                {actions}
              </Box>
            ) : null}
          </Flex>

          <AccordionChakra.ItemContent>{children}</AccordionChakra.ItemContent>
        </AccordionChakra.Item>
      </AccordionChakra.Root>
    </Box>
  );
};

export default Accordion;
