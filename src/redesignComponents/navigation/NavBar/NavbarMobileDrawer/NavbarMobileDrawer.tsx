import { Button, Flex, Text } from "@chakra-ui/react";
import { useT } from "@transifex/react";
import classNames from "classnames";
import React, { FC, MouseEvent } from "react";

import Drawer from "@/redesignComponents/containers/Drawer/Drawer";
import { CheckIcon, CloseIcon, LanguageIcon, MenuIcon } from "@/redesignComponents/foundations/Icons";
import SimpleDivider from "@/redesignComponents/miscellaneous/Dividers/SimpleDivider";
import { NavigationMenuItem } from "@/redesignComponents/navigation/NavBar/NavigationMenu/NavigationMenu";
import type { SideNavigationGroup } from "@/redesignComponents/navigation/NavBar/SideNavigation/SideNavigation";
import SideNavigationItem from "@/redesignComponents/navigation/NavBar/SideNavigation/SideNavigationItem";
import { SIDE_NAVIGATION_ROW_CLASS_NAME } from "@/redesignComponents/navigation/NavBar/SideNavigation/SideNavigationLinkItem";

import { NavbarLinkItem } from "../useNavbarData";

const drawerRowClassName = (isActive: boolean) =>
  classNames(
    SIDE_NAVIGATION_ROW_CLASS_NAME,
    "flex text-left",
    isActive ? "text-theme-primary-300" : "text-theme-neutral-100"
  );

const DrawerSection: FC<{ children: React.ReactNode }> = ({ children }) => (
  <Flex flexDirection="column" gap={1} px={2} py={2}>
    {children}
  </Flex>
);

export interface NavbarMobileDrawerProps {
  navLinks: NavbarLinkItem[];
  groups: SideNavigationGroup[];
  languageItems: NavigationMenuItem[];
  selectedLanguageIndex?: number;
  onLanguageSelect: (index: number) => void;
}

const NavbarMobileDrawer: FC<NavbarMobileDrawerProps> = ({
  navLinks,
  groups,
  languageItems,
  selectedLanguageIndex,
  onLanguageSelect
}) => {
  const t = useT();

  return (
    <Drawer
      placement="end"
      size="full"
      trigger={
        <Button
          aria-label={t("Open navigation menu")}
          className="!h-12 !min-w-0 !rounded-none !px-4 !text-theme-neutral-100 hover:!bg-theme-primary-700"
        >
          <MenuIcon boxSize={4} />
        </Button>
      }
    >
      {({ onClose }) => {
        // Side navigation items render their own links; close the drawer once any of them is followed.
        const handleLinkClick = (event: MouseEvent<HTMLDivElement>) => {
          if (event.target instanceof Element && event.target.closest("a") != null) {
            onClose();
          }
        };

        return (
          <Flex flexDirection="column" height="100%" className="bg-theme-primary-800">
            <Flex justifyContent="flex-end" px={2} py={2}>
              <Button
                aria-label={t("Close navigation menu")}
                className="!text-theme-neutral-100 hover:!bg-theme-primary-500/20"
                variant="ghost"
                onClick={onClose}
              >
                <CloseIcon boxSize={4} />
              </Button>
            </Flex>
            <Flex flexDirection="column" flex={1} overflowY="auto" onClick={handleLinkClick}>
              {navLinks.length > 0 ? (
                <>
                  <SimpleDivider backgroundColor="primary.700" />
                  <DrawerSection>
                    {navLinks.map(link => (
                      <button
                        key={link.label}
                        type="button"
                        className={drawerRowClassName(link.isActive === true)}
                        onClick={() => {
                          onClose();
                          link.onClick?.();
                        }}
                      >
                        <Text as="span" textStyle={link.isActive === true ? "400-bold" : "400"}>
                          {link.label}
                        </Text>
                      </button>
                    ))}
                  </DrawerSection>
                </>
              ) : null}
              {groups.map(group => (
                <React.Fragment key={group.id}>
                  <SimpleDivider backgroundColor="primary.700" />
                  <DrawerSection>
                    {group.links.map(link => (
                      <SideNavigationItem
                        key={link.label}
                        icon={link.icon}
                        label={link.label}
                        href={link.href}
                        activePaths={link.activePaths}
                        notificationValue={link.notificationValue}
                        onAddClick={link.onAddClick}
                        MenuItems={link.MenuItems}
                        items={link.items}
                      />
                    ))}
                  </DrawerSection>
                </React.Fragment>
              ))}
            </Flex>
            <SimpleDivider backgroundColor="primary.700" />
            <Flex alignItems="center" gap={2} px={4} pt={3.5} pb={1} color="neutral.100">
              <LanguageIcon boxSize={4} />
              <Text textStyle="400-bold" color="neutral.100">
                {t("Language")}
              </Text>
            </Flex>
            <DrawerSection>
              {languageItems.map((item, index) => {
                const isSelected = index === selectedLanguageIndex;
                return (
                  <button
                    key={item.label}
                    type="button"
                    aria-pressed={isSelected}
                    className={drawerRowClassName(isSelected)}
                    onClick={() => onLanguageSelect(index)}
                  >
                    <Text as="span" textStyle={isSelected ? "400-bold" : "400"}>
                      {item.label}
                    </Text>
                    {isSelected ? <CheckIcon boxSize={4} /> : null}
                  </button>
                );
              })}
            </DrawerSection>
          </Flex>
        );
      }}
    </Drawer>
  );
};

export default NavbarMobileDrawer;
