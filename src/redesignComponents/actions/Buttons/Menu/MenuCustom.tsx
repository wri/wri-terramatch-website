import { Menu, MenuContent, MenuItem, MenuPositioner, MenuTrigger, Portal } from "@chakra-ui/react";
import { useT } from "@transifex/react";
import { FC, useState } from "react";

import Button from "@/redesignComponents/actions/Buttons/Button/Button";

import type { MenuContainerTyped, MenuCustomProps, MenuItemTyped, MenuTriggerTyped } from "./MenuCustom.types";

const TypedMenuTrigger = MenuTrigger as FC<MenuTriggerTyped>;
const TypedMenuPositioner = MenuPositioner as FC<MenuContainerTyped>;
const TypedMenuContent = MenuContent as FC<MenuContainerTyped>;
const TypedMenuItem = MenuItem as FC<MenuItemTyped>;

const MenuCustom: FC<MenuCustomProps> = ({ label, items, customTrigger }) => {
  const t = useT();
  const [open, setOpen] = useState(false);

  return (
    <Menu.Root open={open} onOpenChange={(e: { open: boolean }) => setOpen(e.open)}>
      <TypedMenuTrigger asChild>
        {customTrigger != null ? (
          customTrigger
        ) : (
          <Button variant="borderless" size="small">
            {label == null ? null : t(label)}
          </Button>
        )}
      </TypedMenuTrigger>
      <Portal>
        <TypedMenuPositioner>
          <TypedMenuContent>
            {items.map(item => (
              <TypedMenuItem
                key={item.value}
                value={item.value}
                textStyle="400"
                onClick={() => item.onClick?.()}
                color="neutral.900"
              >
                {item.startIcon}
                {t(item.label)}
                {item.endIcon}
              </TypedMenuItem>
            ))}
          </TypedMenuContent>
        </TypedMenuPositioner>
      </Portal>
    </Menu.Root>
  );
};

export default MenuCustom;
