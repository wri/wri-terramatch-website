import { Box, Button, Menu, MenuContent, MenuPositioner, MenuTrigger, Portal, Text } from "@chakra-ui/react";
import { MenuItem } from "@chakra-ui/react";
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
const TypedMenuItem = MenuItem as FC<MenuItemTyped>;

const Caret: FC<{ direction: "top" | "bottom" }> = ({ direction }) => {
  const isTop = direction === "top";
  return (
    <Box
      className={isTop ? "navbar-caret-top" : "navbar-caret-bottom"}
      ml="auto"
      pr="1.25rem"
      mb={isTop ? "-0.4375rem" : undefined}
      mt={isTop ? undefined : "-0.4375rem"}
      zIndex={1}
      position="relative"
    >
      <Box
        w="0.75rem"
        h="0.75rem"
        bg="white"
        borderTop={isTop ? "0.0625rem solid" : undefined}
        borderLeft={isTop ? "0.0625rem solid" : undefined}
        borderBottom={isTop ? undefined : "0.0625rem solid"}
        borderRight={isTop ? undefined : "0.0625rem solid"}
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
            "!text-theme-neutral-100 !h-fit w-fit items-center !gap-2 !rounded-none !px-4 !py-3",
            "hover:!bg-theme-primary-700",
            "active:!bg-theme-primary-800",
            "data-[state=open]:!bg-theme-primary-800",
            "disabled:!text-neutral-200",
            "outline-none",
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
                borderRadius="0.5rem"
                border="0.0625rem solid"
                borderColor="neutral.300"
                boxShadow="0 0.25rem 1rem rgba(0, 0, 0, 0.08)"
                p={3}
                minW={variant === "mega" ? "17.5rem" : "12.5rem"}
                display="flex"
                flexDirection="column"
                gap={2}
              >
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
                      variant={variant}
                      item={item}
                      isSelected={index === selectedIndex}
                      showBorder={false}
                    />
                  </TypedMenuItem>
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
