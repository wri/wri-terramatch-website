import { Box, Flex, Menu, MenuItem, Text } from "@chakra-ui/react";
import { FC, ReactNode, useState } from "react";

import { CheckIcon } from "@/redesignComponents/foundations/Icons";

import { MenuItemTyped } from "../NavbarMenu/NavbarMenu";

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

const TypedMenuItem = MenuItem as FC<MenuItemTyped>;

export const NavigationMenuItemRow: FC<NavigationMenuItemRowProps> = ({
  variant,
  item,
  isSelected = false,
  showBorder = false,
  onClick
}) => {
  if (variant === "mega") {
    return (
      <Flex pb={2} gap={2} alignItems="baseline" {...interactiveRowStyles} onClick={onClick}>
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
      <Flex justifyContent="space-between" w="full" alignItems="center" {...interactiveRowStyles} onClick={onClick}>
        <Text textStyle="400" color="neutral.900" fontSize="0.875rem" fontWeight={isSelected ? "700" : "400"}>
          {item.label}
        </Text>
        {isSelected && <CheckIcon color="accessible.controls-on-neutral-lights" boxSize={4} />}
      </Flex>
    );
  }

  return (
    <Box {...interactiveRowStyles} onClick={onClick}>
      <Text textStyle="400" color="neutral.900" fontSize="0.875rem">
        {item.label}
      </Text>
    </Box>
  );
};

const MenuContainer: FC<{ children: ReactNode; minW?: string }> = ({ children, minW = "12.5rem" }) => (
  <Flex
    bg="white"
    borderRadius="0.5rem"
    border="0.0625rem solid"
    borderColor="neutral.300"
    boxShadow="0 0.25rem 1rem rgba(0, 0, 0, 0.08)"
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
    <Menu.Root>
      <MenuContainer minW={variant === "mega" ? "17.5rem" : "12.5rem"}>
        {items.map((item, index) => (
          <TypedMenuItem
            key={index}
            value={String(index)}
            pb={variant === "mega" ? 2 : undefined}
            borderBottom={variant === "mega" && index !== items.length - 1 ? "0.0625rem solid" : "none"}
            borderColor="neutral.300"
            _hover={{ backgroundColor: "primary.500/20", outline: "none" }}
            _highlighted={{
              outline: "0.125rem solid",
              outlineColor: "primary.700",
              backgroundColor: "neutral.100"
            }}
            cursor="pointer"
            onClick={() => onSelect?.(index)}
          >
            <NavigationMenuItemRow
              key={index}
              variant={variant}
              item={item}
              isSelected={index === selected}
              showBorder={variant === "mega" && index !== items.length - 1}
              onClick={() => handleSelect(index)}
            />
          </TypedMenuItem>
        ))}
      </MenuContainer>
    </Menu.Root>
  );
};

export default NavigationMenu;
