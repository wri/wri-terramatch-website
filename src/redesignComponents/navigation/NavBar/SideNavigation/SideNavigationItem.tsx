import { Accordion as AccordionChakra, Button, Flex, Link, Text } from "@chakra-ui/react";
import classNames from "classnames";
import type { FC, KeyboardEvent, MouseEvent, ReactNode } from "react";

import MenuCustom from "@/redesignComponents/actions/Buttons/Menu/MenuCustom";
import { MenuItemOption } from "@/redesignComponents/actions/Buttons/Menu/MenuCustom.types";
import { ChevronDownIcon, MoreVertIcon, PlusIcon } from "@/redesignComponents/foundations/Icons";
import Badge from "@/redesignComponents/status/Badge/BadgeCustom";
import TextBadge from "@/redesignComponents/status/Badge/TextBadge";

interface SideNavigationItemProps {
  icon?: ReactNode;
  label?: string;
  notificationValue?: number;
  onAddClick?: () => void;
  MenuItems?: MenuItemOption[];
  href?: string;
  items?: {
    icon: ReactNode;
    label: string;
    onAddClick?: () => void;
    href?: string;
    MenuItems?: MenuItemOption[];
  }[];
  isCollapsed?: boolean;
}

const focusVisibleStyles = {
  _focusVisible: {
    outline: "none"
  },
  css: {
    "&:focus-visible [data-side-navigation-item-row]": {
      borderColor: "var(--chakra-colors-neutral-100)"
    }
  }
};

const interactiveItemProps = {
  ...focusVisibleStyles,
  "data-side-navigation-item": "trigger"
} as const;

const actionButtonClassName = "min-h-0 min-w-0 h-fit";

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

  const handleLinkKeyDown = (event: KeyboardEvent<HTMLAnchorElement>) => {
    if (event.key === "Enter") {
      event.currentTarget.click();
    }
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
        "hover:bg-theme-primary-500/40"
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

  const linkRow = (
    <Flex
      data-side-navigation-item-row
      className={classNames(
        "h-9 w-full items-center justify-between gap-2",
        "rounded-md border-2 border-theme-primary-800 px-3 py-2 text-theme-neutral-100",
        "hover:bg-theme-primary-500/40",
        "focus-within:border-theme-neutral-100 focus-within:ring-2 focus-within:ring-theme-primary-800"
      )}
    >
      <Link
        href={href}
        className="min-w-0 flex-1 focus:outline-none"
        onKeyDown={handleLinkKeyDown}
        {...focusVisibleStyles}
      >
        {itemMainContent}
      </Link>
      {isCollapsed ? null : itemActions}
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
                  <Flex
                    key={item.label}
                    className={classNames(
                      "w-full items-center justify-between gap-2 rounded-md border-2 border-transparent p-1",
                      "focus-within:border-theme-neutral-100 focus-within:ring-2 focus-within:ring-theme-primary-800",
                      "hover:bg-theme-primary-500/40"
                    )}
                    color="neutral.100"
                  >
                    <Link
                      href={item.href}
                      className="min-w-0 flex-1 focus:outline-none"
                      onKeyDown={handleLinkKeyDown}
                      {...focusVisibleStyles}
                    >
                      <Flex alignItems="center" gap={2}>
                        <Badge hasNotification={isCollapsed} notificationCount={notificationValue}>
                          {item.icon}
                        </Badge>
                        {item.label}
                      </Flex>
                    </Link>
                    {isCollapsed ? null : (
                      <Flex alignItems="center" gap={2}>
                        {item.onAddClick ? (
                          <Button onClick={item.onAddClick} className={actionButtonClassName}>
                            <PlusIcon boxSize={4} />
                          </Button>
                        ) : null}
                        {item.MenuItems ? (
                          <MenuCustom
                            customTrigger={
                              <Button onClick={handleMenuTriggerClick} className={actionButtonClassName}>
                                <MoreVertIcon boxSize={4} />
                              </Button>
                            }
                            items={item.MenuItems}
                          />
                        ) : null}
                      </Flex>
                    )}
                  </Flex>
                ))}
              </Flex>
            </Flex>
          </AccordionChakra.ItemContent>
        </AccordionChakra.Item>
      </AccordionChakra.Root>
    );
  }

  if (hasHref) {
    return linkRow;
  }

  return null;
};

export default SideNavigationItem;
