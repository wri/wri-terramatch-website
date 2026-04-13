import { Box, Button, Menu, MenuContent, MenuPositioner, MenuTrigger, Portal, Text } from "@chakra-ui/react";
import { css, Global } from "@emotion/react";
import { FC, ReactNode, useState } from "react";
import { twMerge } from "tailwind-merge";

import { ChevronDownIcon } from "@/redesignComponents/foundations/Icons";
import {
  NavigationMenuItem,
  NavigationMenuItemRow
} from "@/redesignComponents/navigation/NavBar/NavigationMenu/NavigationMenu";

export interface MenuTriggerTyped {
  children: ReactNode;
  asChild?: boolean;
}

export interface MenuContainerTyped {
  children: ReactNode;
  bg?: string;
  border?: string;
  p?: number;
  boxShadow?: string;
  borderRadius?: string;
  overflow?: string;
}

export interface MenuItemTyped {
  children: ReactNode;
  value?: string;
  pb?: number;
  borderBottom?: string;
  borderColor?: string;
  _hover?: Record<string, string>;
  _focus?: Record<string, string>;
  _focusVisible?: Record<string, string>;
  _highlighted?: Record<string, string>;
  cursor?: string;
  onClick?: () => void;
}

const TypedMenuTrigger = MenuTrigger as FC<MenuTriggerTyped>;
const TypedMenuPositioner = MenuPositioner as FC<MenuContainerTyped>;
const TypedMenuContent = MenuContent as FC<MenuContainerTyped>;

const Caret: FC<{ direction: "top" | "bottom" }> = ({ direction }) => {
  const isTop = direction === "top";
  return (
    <Box
      className={isTop ? "navbar-caret-top" : "navbar-caret-bottom"}
      ml="auto"
      pr="20px"
      mb={isTop ? "-7px" : undefined}
      mt={isTop ? undefined : "-7px"}
      zIndex={1}
      position="relative"
    >
      <Box
        w="12px"
        h="12px"
        bg="white"
        borderTop={isTop ? "1px solid" : undefined}
        borderLeft={isTop ? "1px solid" : undefined}
        borderBottom={isTop ? undefined : "1px solid"}
        borderRight={isTop ? undefined : "1px solid"}
        borderColor="neutral.300"
        transform="rotate(45deg)"
      />
    </Box>
  );
};

interface NavbarMenuButtonBaseProps {
  prefix?: ReactNode;
  label: ReactNode;
  suffix?: ReactNode;
  disabled?: boolean;
}

interface NavbarMenuProps extends NavbarMenuButtonBaseProps {
  items: NavigationMenuItem[];
  variant?: "mega" | "simple" | "list";
  selectedIndex?: number;
  onSelect?: (index: number) => void;
}

const NavbarMenu: FC<NavbarMenuProps> = ({
  items,
  prefix,
  label,
  disabled,
  variant = "simple",
  selectedIndex,
  onSelect
}) => {
  const [open, setOpen] = useState(false);

  return (
    <Menu.Root
      open={open}
      onOpenChange={(e: { open: boolean }) => setOpen(e.open)}
      positioning={{ placement: "bottom-end" }}
    >
      <TypedMenuTrigger asChild>
        <Button
          disabled={disabled}
          className={twMerge(
            "!h-fit w-fit items-center !gap-2 !rounded-none !px-4 !py-3 !text-theme-neutral-100",
            "hover:!bg-theme-primary-700",
            "active:!bg-theme-primary-800",
            "data-[state=open]:!bg-theme-primary-800",
            "focus-within:ring-2 focus-within:ring-theme-primary-700 focus-within:ring-offset-2",
            "focus:outline-none",
            "disabled:!text-neutral-200",
            disabled && "cursor-default"
          )}
        >
          {prefix}
          <Text textStyle="400">{label}</Text>
          <ChevronDownIcon boxSize={4} color="neutral.100" className={open ? "rotate-180" : "rotate-0"} />
        </Button>
      </TypedMenuTrigger>

      <Portal>
        <Global
          styles={css`
            [data-placement^="top"] .navbar-caret-top {
              display: none;
            }
            [data-placement^="bottom"] .navbar-caret-bottom {
              display: none;
            }
          `}
        />
        <TypedMenuPositioner overflow="visible">
          <TypedMenuContent bg="transparent" border="none" p={0} boxShadow="none" overflow="visible">
            <Box display="flex" flexDirection="column">
              <Caret direction="top" />
              <Box
                bg="white"
                borderRadius="8px"
                border="1px solid"
                borderColor="neutral.300"
                boxShadow="0 4px 16px rgba(0, 0, 0, 0.08)"
                p={3}
                minW={variant === "mega" ? "280px" : "200px"}
                display="flex"
                flexDirection="column"
                gap={2}
              >
                {items.map((item, index) => (
                  <NavigationMenuItemRow
                    key={index}
                    variant={variant}
                    item={item}
                    isSelected={index === selectedIndex}
                    showBorder={false}
                  />
                ))}
              </Box>
              <Caret direction="bottom" />
            </Box>
          </TypedMenuContent>
        </TypedMenuPositioner>
      </Portal>
    </Menu.Root>
  );
};

export default NavbarMenu;
