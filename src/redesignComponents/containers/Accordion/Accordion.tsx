import { Accordion as AccordionChakra, Box, Flex } from "@chakra-ui/react";
import type { ComponentType } from "react";
import { useEffect, useRef, useState } from "react";

import { ChevronDown, Minus, Plus } from "@/redesignComponents/foundations/Icons";

import { ExtendableCardProps } from "./types";

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
    }
  },
  header: {
    gap: 3
  }
};

const useAccordionState = () => {
  const ref = useRef<HTMLDivElement>(null);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const getItemElement = (element: HTMLElement | null) => {
      return element?.closest("[data-state]") ?? element?.closest("[data-accordion-item]");
    };

    const updateState = () => {
      const itemElement = getItemElement(ref.current) ?? getItemElement(ref.current?.parentElement ?? null);
      if (itemElement) {
        const state = itemElement.getAttribute("data-state");
        setIsOpen(state === "open");
      }
    };

    updateState();

    const observer = new MutationObserver(updateState);
    const itemElement = getItemElement(ref.current);

    if (itemElement) {
      observer.observe(itemElement, {
        attributes: true,
        attributeFilter: ["data-state"]
      });
    }

    return () => observer.disconnect();
  }, []);

  return { isOpen, ref };
};

const AccordionIcon = ({ variant }: { variant: "primary" | "secondary" }) => {
  const { isOpen, ref } = useAccordionState();

  if (variant === "secondary") {
    const IconComponent = isOpen ? Minus : Plus;
    return (
      <div ref={ref}>
        <IconComponent boxSize={6} color={ICON_PROPS.color} />
      </div>
    );
  }

  const { component: IconComponent, props } = variantStyles.primary.icon;
  return <IconComponent {...props} />;
};

const Accordion = ({ children, header, actions, variant = "primary", className }: ExtendableCardProps) => {
  const containerStyles = variantStyles[variant].container;

  const handleActionsClick = (e: React.MouseEvent) => {
    e.stopPropagation();
  };

  return (
    <Box className={className}>
      <AccordionChakra.Root multiple>
        <AccordionChakra.Item>
          <Flex {...containerStyles} gap={4}>
            <AccordionChakra.ItemTrigger css={{ outline: "none" }}>
              <Flex flex="1" alignItems="center" justifyContent="space-between" width="100%" {...variantStyles.header}>
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
                  <AccordionIcon variant={variant} />
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
