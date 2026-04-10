import {
  Box,
  Button,
  Flex,
  Menu,
  MenuContent,
  MenuItem,
  MenuPositioner,
  MenuTrigger,
  Portal,
  Text
} from "@chakra-ui/react";
import { FC, ReactNode, useState } from "react";
import { twMerge } from "tailwind-merge";

import { CheckIcon } from "@/redesignComponents/foundations/Icons";
import { NavigationMenuItem } from "@/redesignComponents/navigation/NavBar/NavigationMenu/NavigationMenu";

interface MenuTriggerTyped {
  children: ReactNode;
  asChild?: boolean;
}

interface MenuContainerTyped {
  children: ReactNode;
  bg?: string;
  border?: string;
  p?: number;
  boxShadow?: string;
  borderRadius?: string;
  overflow?: string;
}

interface MenuItemTyped {
  children: ReactNode;
  value?: string;
  pb?: number;
  borderBottom?: string;
  borderColor?: string;
  _hover?: Record<string, string>;
  cursor?: string;
  onClick?: () => void;
}

const TypedMenuTrigger = MenuTrigger as FC<MenuTriggerTyped>;
const TypedMenuPositioner = MenuPositioner as FC<MenuContainerTyped>;
const TypedMenuContent = MenuContent as FC<MenuContainerTyped>;
const TypedMenuItem = MenuItem as FC<MenuItemTyped>;

const Caret: FC = () => (
  <Box pl="20px" mb="-7px" zIndex={1} position="relative">
    <Box
      w="12px"
      h="12px"
      bg="white"
      borderTop="1px solid"
      borderLeft="1px solid"
      borderColor="neutral.300"
      transform="rotate(45deg)"
    />
  </Box>
);

interface NavbarMenuButtonBaseProps {
  prefix?: ReactNode;
  label: string;
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
  suffix,
  disabled,
  variant = "simple",
  selectedIndex,
  onSelect
}) => {
  const [open, setOpen] = useState(false);

  return (
    <Menu.Root open={open} onOpenChange={(e: { open: boolean }) => setOpen(e.open)}>
      <TypedMenuTrigger asChild>
        <Button
          disabled={disabled}
          className={twMerge(
            "!text-theme-neutral-100 !h-fit w-fit items-center !gap-2 !rounded-none !px-4 !py-3",
            "hover:!bg-theme-primary-700",
            "active:!bg-theme-primary-800",
            "data-[state=open]:!bg-theme-primary-800",
            "focus-within:ring-theme-primary-700 focus-within:ring-2 focus-within:ring-offset-2",
            "focus:outline-none",
            "disabled:!text-neutral-200",
            disabled && "cursor-default"
          )}
        >
          {prefix}
          <Text textStyle="400">{label}</Text>
          {suffix}
        </Button>
      </TypedMenuTrigger>

      <Portal>
        <TypedMenuPositioner>
          <TypedMenuContent bg="transparent" border="none" p={0} boxShadow="none" overflow="visible">
            <Box>
              <Caret />
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
                {items.map((item, index) => {
                  if (variant === "mega") {
                    return (
                      <TypedMenuItem
                        key={index}
                        value={String(index)}
                        pb={2}
                        borderBottom={index !== items.length - 1 ? "1px solid" : "none"}
                        borderColor="neutral.300"
                        _hover={{ bg: "neutral.100" }}
                        cursor="pointer"
                        onClick={() => onSelect?.(index)}
                      >
                        <Flex gap={2} alignItems="baseline">
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
                      </TypedMenuItem>
                    );
                  }

                  if (variant === "list") {
                    const isSelected = index === selectedIndex;
                    return (
                      <TypedMenuItem
                        key={index}
                        value={String(index)}
                        _hover={{ bg: "neutral.100" }}
                        cursor="pointer"
                        onClick={() => onSelect?.(index)}
                      >
                        <Flex justifyContent="space-between" alignItems="center" w="full">
                          <Text
                            textStyle="400"
                            color="neutral.900"
                            fontSize="14px"
                            fontWeight={isSelected ? "700" : "400"}
                          >
                            {item.label}
                          </Text>
                          {isSelected && <CheckIcon color="accessible.controls-on-neutral-lights" boxSize={4} />}
                        </Flex>
                      </TypedMenuItem>
                    );
                  }

                  return (
                    <TypedMenuItem
                      key={index}
                      value={String(index)}
                      _hover={{ bg: "neutral.100" }}
                      cursor="pointer"
                      onClick={() => onSelect?.(index)}
                    >
                      <Text textStyle="400" color="neutral.900" fontSize="14px">
                        {item.label}
                      </Text>
                    </TypedMenuItem>
                  );
                })}
              </Box>
            </Box>
          </TypedMenuContent>
        </TypedMenuPositioner>
      </Portal>
    </Menu.Root>
  );
};

export default NavbarMenu;
