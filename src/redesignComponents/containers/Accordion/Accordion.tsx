import { Accordion as AccordionChakra, Box, Flex } from "@chakra-ui/react";
import type { FC, MouseEvent, PointerEvent as ReactPointerEvent } from "react";
import { useCallback, useRef, useState } from "react";

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
        "var(--Border-Radius-300, 0.25rem) var(--Border-Radius-300, 0.25rem) var(--Border-Radius-100, 0) var(--Border-Radius-100, 0)",
      borderTop: "var(--Border-Width-200, 0.125rem) solid var(--Neutrals-300, #E7E6E6)"
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
  onOpenChange,
  isScrollable = true
}) => {
  const { container, header: headerStyles } = variantStyles[variant];
  const isControlled = open !== undefined;
  const [uncontrolledOpen, setUncontrolledOpen] = useState(defaultOpen);
  const isOpen = isControlled ? open : uncontrolledOpen;
  const onOpenChangeRef = useRef(onOpenChange);
  onOpenChangeRef.current = onOpenChange;

  const setIsOpen = useCallback(
    (nextOpen: boolean) => {
      if (!isControlled) {
        setUncontrolledOpen(nextOpen);
      }
      onOpenChangeRef.current?.(nextOpen);
    },
    [isControlled]
  );

  const handleTriggerPointerDown = useCallback((event: ReactPointerEvent<HTMLButtonElement>) => {
    const button = event.currentTarget;
    if (document.activeElement === button) {
      button.blur();
    }
    button.focus();
  }, []);

  const handleTriggerClick = useCallback(() => {
    setIsOpen(!isOpen);
  }, [isOpen, setIsOpen]);

  const handleActionsClick = (event: MouseEvent<HTMLDivElement>) => {
    event.stopPropagation();
  };

  return (
    <Box
      className={className}
      css={{
        ...(isScrollable
          ? {
              "& [data-scope='accordion'][data-part='item-content']": {
                margin: "0 -2rem",
                padding: "0 2rem"
              }
            }
          : {}),
        "& [data-scope='accordion'][data-part='item']": {
          overflow: "visible"
        },
        ...(variant === "tertiary"
          ? {
              "& [data-scope='accordion'][data-part='item'][data-state='open'] > [data-accordion-header]": {
                borderRadius:
                  "var(--Border-Radius-300, 0.25rem) var(--Border-Radius-300, 0.25rem) var(--Border-Radius-100, 0) var(--Border-Radius-100, 0)",
                borderTop: "var(--Border-Width-300, 0.25rem) solid var(--Primary-500, #78CAED)",
                background: "var(--Primary-100, #F7FBFD)"
              }
            }
          : {}),
        ...(variant === "quaternary"
          ? {
              "& [data-scope='accordion'][data-part='item'][data-state='open'] > [data-accordion-header]": {
                borderBottom: "var(--Border-Width-100, 0.0625rem) solid var(--Neutrals-300, #E7E6E6) !important",
                borderTop: "none !important",
                background: "neutral.100 !important"
              }
            }
          : {})
      }}
    >
      <AccordionChakra.Root multiple collapsible value={isOpen ? [ACCORDION_ITEM_VALUE] : []}>
        <AccordionChakra.Item value={ACCORDION_ITEM_VALUE}>
          <Flex {...container} gap={4} className={classNameHeader} alignItems="center" data-accordion-header="">
            <AccordionChakra.ItemTrigger
              onPointerDown={handleTriggerPointerDown}
              onClick={handleTriggerClick}
              css={{
                outline: "none",
                flex: 1,
                minWidth: 0,
                display: "flex",
                alignItems: "center",
                gap: "1rem",
                width: "100%",
                cursor: "pointer"
              }}
            >
              <Flex flex="1" alignItems="center" width="100%" minWidth={0} {...headerStyles}>
                <Box flex="1" fontSize="1.25rem" lineHeight="1.75rem" color="primary.900" minWidth={0}>
                  {header}
                </Box>
              </Flex>
              {actions != null ? (
                <Box
                  display="flex"
                  gap={3}
                  alignItems="center"
                  flexShrink={0}
                  onClick={handleActionsClick}
                  onPointerDown={event => event.stopPropagation()}
                >
                  {actions}
                </Box>
              ) : null}
              <Box flexShrink={0}>
                <AccordionIcon variant={variant} />
              </Box>
            </AccordionChakra.ItemTrigger>
          </Flex>

          <AccordionChakra.ItemContent>{children}</AccordionChakra.ItemContent>
        </AccordionChakra.Item>
      </AccordionChakra.Root>
    </Box>
  );
};

export default Accordion;
