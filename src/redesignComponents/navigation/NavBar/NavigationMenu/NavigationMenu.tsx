import { Box, Flex, Text } from "@chakra-ui/react";
import { FC, ReactNode, useState } from "react";

import { CheckIcon } from "@/redesignComponents/foundations/Icons";

export interface NavigationMenuItem {
  label: string;
  caption?: string;
  icon?: ReactNode;
}

export interface NavigationMenuProps {
  variant: "mega" | "simple" | "list";
  items: NavigationMenuItem[];
  selectedIndex?: number;
  onSelect?: (index: number) => void;
}

const interactiveRowStyles = {
  cursor: "pointer",
  _hover: { bg: "neutral.100" },
  transition: "background 0.15s"
} as const;

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

const MegaMenuItem: FC<{ item: NavigationMenuItem; onClick?: () => void; showBorder?: boolean }> = ({
  item,
  onClick,
  showBorder = true
}) => (
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

const SimpleMenuItemRow: FC<{ item: NavigationMenuItem; onClick?: () => void }> = ({ item, onClick }) => (
  <Box {...interactiveRowStyles} onClick={onClick}>
    <Text textStyle="400" color="neutral.900" fontSize="14px">
      {item.label}
    </Text>
  </Box>
);

const ListMenuItemRow: FC<{
  item: NavigationMenuItem;
  isSelected: boolean;
  onClick?: () => void;
}> = ({ item, isSelected, onClick }) => (
  <Flex justifyContent="space-between" alignItems="center" {...interactiveRowStyles} onClick={onClick}>
    <Text textStyle="400" color="neutral.900" fontSize="14px" fontWeight={isSelected ? "700" : "400"}>
      {item.label}
    </Text>
    {isSelected && <CheckIcon color="accessible.controls-on-neutral-lights" boxSize={4} />}
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
      {items.map((item, index) => {
        switch (variant) {
          case "mega":
            return (
              <MegaMenuItem
                key={index}
                item={item}
                onClick={() => handleSelect(index)}
                showBorder={index !== items.length - 1}
              />
            );
          case "simple":
            return <SimpleMenuItemRow key={index} item={item} onClick={() => handleSelect(index)} />;
          case "list":
            return (
              <ListMenuItemRow
                key={index}
                item={item}
                isSelected={index === selected}
                onClick={() => handleSelect(index)}
              />
            );
          default:
            return null;
        }
      })}
    </MenuContainer>
  );
};

export default NavigationMenu;
