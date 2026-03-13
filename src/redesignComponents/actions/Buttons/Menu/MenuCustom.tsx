import { Menu, MenuContent, MenuItem, MenuPositioner, MenuTrigger, Portal } from "@chakra-ui/react";
import { FC, useState } from "react";

import Button from "@/redesignComponents/actions/Buttons/Button/Button";

interface MenuCustomProps {
  label: string;
  items: {
    label: string;
    value: string;
    startIcon?: React.ReactNode;
    endIcon?: React.ReactNode;
    onClick?: () => void;
  }[];
}

const MenuCustom: FC<MenuCustomProps> = ({ label, items }) => {
  const [open, setOpen] = useState(false);

  return (
    <Menu.Root open={open} onOpenChange={e => setOpen(e.open)}>
      <MenuTrigger asChild>
        <Button variant="borderless" size="small">
          {label}
        </Button>
      </MenuTrigger>
      <Portal>
        <MenuPositioner>
          <MenuContent>
            {items.map(item => (
              <MenuItem
                key={item.value}
                value={item.value}
                textStyle="400"
                onClick={() => item.onClick?.()}
                color="neutral.900"
              >
                {item.startIcon}
                {item.label}
                {item.endIcon}
              </MenuItem>
            ))}
          </MenuContent>
        </MenuPositioner>
      </Portal>
    </Menu.Root>
  );
};

export default MenuCustom;
