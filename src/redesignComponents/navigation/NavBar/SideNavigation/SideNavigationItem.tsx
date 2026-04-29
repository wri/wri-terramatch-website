import { Accordion as AccordionChakra, Button, Flex, Text } from "@chakra-ui/react";
import classNames from "classnames";
import type { FC, KeyboardEvent, MouseEvent, ReactNode } from "react";

import MenuCustom from "@/redesignComponents/actions/Buttons/Menu/MenuCustom";
import { MenuItemOption } from "@/redesignComponents/actions/Buttons/Menu/MenuCustom.types";
import { ChevronDownIcon, MoreVertIcon, PlusIcon } from "@/redesignComponents/foundations/Icons";
import Badge from "@/redesignComponents/status/Badge/BadgeCustom";
import TextBadge from "@/redesignComponents/status/Badge/TextBadge";

import SideNavigationLinkItem from "./SideNavigationLinkItem";

type SideNavigationChildItem = {
  icon: ReactNode;
  label: string;
  href: string;
  notificationValue?: number;
  onAddClick?: () => void;
  MenuItems?: MenuItemOption[];
};

const actionButtonClassName = "min-h-0 min-w-0 h-fit";

interface SideNavigationItemProps {
  icon?: ReactNode;
  label?: string;
  notificationValue?: number;
  onAddClick?: () => void;
  MenuItems?: MenuItemOption[];
  href?: string;
  items?: SideNavigationChildItem[];
  isCollapsed?: boolean;
}

const interactiveItemProps = {
  _focusVisible: {
    outline: "none"
  },
  css: {
    "&:focus-visible [data-side-navigation-item-row]": {
      borderColor: "var(--chakra-colors-neutral-100)"
    }
  },
  "data-side-navigation-item": "trigger"
} as const;

const SideNavigationItem: FC<SideNavigationItemProps> = props => {
  const {
    icon,
    label = "",
    notificationValue = 0,
    onAddClick = undefined,
    MenuItems = [],
    href = "",
    items = [],
    isCollapsed = false
  } = props;
  const hasItems = items.length > 0;
  const hasHref = Boolean(href);

  const handleAddClick = (event: MouseEvent<HTMLButtonElement>) => {
    event.stopPropagation();
    onAddClick?.();
  };

  const handleMenuTriggerClick = (event: MouseEvent<HTMLButtonElement>) => {
    event.stopPropagation();
  };

  const handleAccordionRootKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    if (event.key !== "Enter") {
      return;
    }

    const target = event.target as HTMLElement;
    const isActionKeyEvent = Boolean(target.closest("[data-side-navigation-item-actions]"));

    if (isActionKeyEvent) {
      return;
    }

    const trigger = target.closest('[data-side-navigation-item="trigger"]') as HTMLElement | null;

    if (!trigger) {
      return;
    }

    event.preventDefault();
    trigger.click();
  };

  const itemMainContent = (
    <Flex alignItems="center" gap={2}>
      <Badge hasNotification={isCollapsed} notificationCount={notificationValue}>
        {icon}
      </Badge>
      {isCollapsed ? null : (
        <>
          <Text textStyle="400">{label}</Text>
          {notificationValue > 0 ? (
            <TextBadge variant="error" className="py-0">
              {notificationValue}
            </TextBadge>
          ) : null}
        </>
      )}
    </Flex>
  );

  const itemActions = (
    <Flex alignItems="center" gap={2} data-side-navigation-item-actions>
      {onAddClick ? (
        <Button onClick={handleAddClick} className={actionButtonClassName}>
          <PlusIcon boxSize={4} />
        </Button>
      ) : null}
      {MenuItems.length > 0 ? (
        <MenuCustom
          customTrigger={
            <Button onClick={handleMenuTriggerClick} className={actionButtonClassName}>
              <MoreVertIcon boxSize={4} />
            </Button>
          }
          items={MenuItems}
        />
      ) : null}
    </Flex>
  );

  const itemRow = (
    <Flex
      data-side-navigation-item-row
      className={classNames(
        "h-9 w-full items-center justify-between gap-2",
        "rounded-md border-2 border-theme-primary-800 px-3 py-2 text-theme-neutral-100",
        "hover:bg-theme-primary-500/20",
        "active:bg-theme-primary-500/40"
      )}
    >
      {itemMainContent}
      <Flex alignItems="center" gap={2}>
        {isCollapsed ? null : itemActions}
        {hasItems && !isCollapsed ? (
          <AccordionChakra.ItemIndicator>
            <ChevronDownIcon boxSize={4} color="neutral.100" />
          </AccordionChakra.ItemIndicator>
        ) : null}
      </Flex>
    </Flex>
  );

  if (hasItems) {
    return (
      <AccordionChakra.Root collapsible onKeyDown={handleAccordionRootKeyDown}>
        <AccordionChakra.Item value={label || "side-navigation-item"}>
          <AccordionChakra.ItemTrigger {...interactiveItemProps}>{itemRow}</AccordionChakra.ItemTrigger>
          <AccordionChakra.ItemContent>
            <Flex>
              <div className="mr-1 ml-5 w-[0.125rem] shrink-0 bg-theme-neutral-100" />
              <Flex flexDirection="column" gap={1} width="100%">
                {items.map(item => (
                  <SideNavigationLinkItem
                    key={item.label}
                    icon={item.icon}
                    label={item.label}
                    href={item.href ?? ""}
                    onAddClick={item.onAddClick}
                    MenuItems={item.MenuItems}
                    isCollapsed={isCollapsed}
                    notificationValue={item.notificationValue}
                  />
                ))}
              </Flex>
            </Flex>
          </AccordionChakra.ItemContent>
        </AccordionChakra.Item>
      </AccordionChakra.Root>
    );
  }

  if (hasHref) {
    return (
      <SideNavigationLinkItem
        icon={icon}
        label={label}
        href={href}
        onAddClick={onAddClick}
        MenuItems={MenuItems}
        isCollapsed={isCollapsed}
        notificationValue={notificationValue}
      />
    );
  }

  return null;
};

export default SideNavigationItem;
