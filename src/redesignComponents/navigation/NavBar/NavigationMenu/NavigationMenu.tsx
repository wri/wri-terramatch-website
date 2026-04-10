import { Box, Flex, Text } from "@chakra-ui/react";
import { FC, ReactNode, useState } from "react";

import { CheckIcon } from "@/redesignComponents/foundations/Icons";

export interface NavigationMenuItem {
  label: string;
  caption?: string;
  icon?: ReactNode;
}

export interface NavigationMenuItemRowProps {
  variant: "mega" | "simple" | "list";
  item: NavigationMenuItem;
  isSelected?: boolean;
  showBorder?: boolean;
  onClick?: () => void;
}

export interface NavigationMenuProps {
  variant: "mega" | "simple" | "list";
  items: NavigationMenuItem[];
  selectedIndex?: number;
  onSelect?: (index: number) => void;
}

const interactiveRowStyles = {
  cursor: "pointer",
  transition: "background 0.15s"
} as const;

export const NavigationMenuItemRow: FC<NavigationMenuItemRowProps> = ({
  variant,
  item,
  isSelected = false,
  showBorder = false,
  onClick
}) => {
  if (variant === "mega") {
    return (
      <Flex
        pb={2}
        gap={2}
        alignItems="baseline"
        {...interactiveRowStyles}
        onClick={onClick}
        borderBottom={showBorder ? "1px solid" : "none"}
        borderBottomColor="neutral.300"
      >
        {item.icon}
        <Box>
          <Text textStyle="400" color="neutral.900">
            {item.label}
          </Text>
          {item.caption && (
            <Text textStyle="300" color="neutral.700">
              {item.caption}
            </Text>
          )}
        </Box>
      </Flex>
    );
  }

  if (variant === "list") {
    return (
      <Flex justifyContent="space-between" alignItems="center" {...interactiveRowStyles} onClick={onClick}>
        <Text textStyle="400" color="neutral.900" fontSize="14px" fontWeight={isSelected ? "700" : "400"}>
          {item.label}
        </Text>
        {isSelected && <CheckIcon color="accessible.controls-on-neutral-lights" boxSize={4} />}
      </Flex>
    );
  }

  return (
    <Box {...interactiveRowStyles} onClick={onClick}>
      <Text textStyle="400" color="neutral.900" fontSize="14px">
        {item.label}
      </Text>
    </Box>
  );
};

const MenuContainer: FC<{ children: ReactNode; minW?: string }> = ({ children, minW = "200px" }) => (
  <Flex
    bg="white"
    borderRadius="8px"
    border="1px solid"
    borderColor="neutral.300"
    boxShadow="0 4px 16px rgba(0, 0, 0, 0.08)"
    p={3}
    minW={minW}
    flexDirection="column"
    gap={2}
  >
    {children}
  </Flex>
);

const NavigationMenu: FC<NavigationMenuProps> = ({ variant, items, selectedIndex, onSelect }) => {
  const [selected, setSelected] = useState(selectedIndex ?? -1);

  const handleSelect = (index: number) => {
    setSelected(index);
    onSelect?.(index);
  };

  return (
    <MenuContainer minW={variant === "mega" ? "280px" : "200px"}>
      {items.map((item, index) => (
        <NavigationMenuItemRow
          key={index}
          variant={variant}
          item={item}
          isSelected={index === selected}
          showBorder={variant === "mega" && index !== items.length - 1}
          onClick={() => handleSelect(index)}
        />
      ))}
    </MenuContainer>
  );
};

export default NavigationMenu;
