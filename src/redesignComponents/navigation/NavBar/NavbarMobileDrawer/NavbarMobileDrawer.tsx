import { Box, Button, Flex, Text } from "@chakra-ui/react";
import { useT } from "@transifex/react";
import { useRouter } from "next/router";
import { FC, ReactNode } from "react";

import Drawer from "@/redesignComponents/containers/Drawer/Drawer";
import { CheckIcon, CloseIcon, LanguageIcon, MenuIcon } from "@/redesignComponents/foundations/Icons";
import SimpleDivider from "@/redesignComponents/miscellaneous/Dividers/SimpleDivider";
import { NavigationMenuItem } from "@/redesignComponents/navigation/NavBar/NavigationMenu/NavigationMenu";
import type { SideNavigationGroup } from "@/redesignComponents/navigation/NavBar/SideNavigation/SideNavigation";
import { useIsRouteActive } from "@/redesignComponents/navigation/NavBar/SideNavigation/useIsRouteActive";
import NumberBadge from "@/redesignComponents/status/Badge/NumberBadge";

import { NavbarLinkItem } from "../useNavbarData";

const DRAWER_ITEM_CLASS_NAME =
  "flex w-full cursor-pointer items-center gap-2 rounded-md px-3 py-2 text-left hover:bg-theme-primary-500/20";

type DrawerLinkEntry = {
  icon?: ReactNode;
  label: string;
  href: string;
  activePaths?: string[];
  notificationValue?: number;
};

const flattenGroupLinks = (group: SideNavigationGroup): DrawerLinkEntry[] =>
  group.links.flatMap(link => [
    ...(link.href != null && link.href.length > 0 ? [{ ...link, href: link.href }] : []),
    ...(link.items ?? [])
  ]);

interface DrawerLinkProps extends DrawerLinkEntry {
  onNavigate: () => void;
}

const DrawerLink: FC<DrawerLinkProps> = ({ icon, label, href, activePaths, notificationValue = 0, onNavigate }) => {
  const t = useT();
  const router = useRouter();
  const isActive = useIsRouteActive(href, activePaths);
  const color = isActive ? "primary.700" : "neutral.900";

  const handleClick = () => {
    onNavigate();
    router.push(href);
  };

  return (
    <button type="button" className={DRAWER_ITEM_CLASS_NAME} onClick={handleClick}>
      <Flex alignItems="center" color={color}>
        {icon}
      </Flex>
      <Text as="span" textStyle={isActive ? "400-bold" : "400"} color={color}>
        {t(label)}
      </Text>
      <NumberBadge count={notificationValue} />
    </button>
  );
};

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
  const linkGroups = groups.map(group => ({ id: group.id, links: flattenGroupLinks(group) }));

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
      {({ onClose }) => (
        <Flex flexDirection="column" height="100%" bg="neutral.100">
          <Flex justifyContent="flex-end" p={2}>
            <Button
              aria-label={t("Close navigation menu")}
              className="!min-w-0 !text-theme-neutral-900"
              variant="ghost"
              onClick={onClose}
            >
              <CloseIcon boxSize={4} />
            </Button>
          </Flex>
          <Flex flexDirection="column" flex={1} overflowY="auto" px={2} gap={1}>
            {navLinks.map(link => (
              <button
                key={link.label}
                type="button"
                className={DRAWER_ITEM_CLASS_NAME}
                onClick={() => {
                  onClose();
                  link.onClick?.();
                }}
              >
                <Text
                  as="span"
                  textStyle={link.isActive === true ? "400-bold" : "400"}
                  color={link.isActive === true ? "primary.700" : "neutral.900"}
                >
                  {link.label}
                </Text>
              </button>
            ))}
            {linkGroups.map((group, index) => (
              <Flex key={group.id} flexDirection="column" gap={1}>
                {navLinks.length > 0 || index > 0 ? <SimpleDivider backgroundColor="neutral.300" /> : null}
                {group.links.map(link => (
                  <DrawerLink key={link.href} {...link} onNavigate={onClose} />
                ))}
              </Flex>
            ))}
          </Flex>
          <Box p={2}>
            <SimpleDivider backgroundColor="neutral.300" />
            <Flex alignItems="center" gap={2} px={3} pt={3} pb={1} color="neutral.700">
              <LanguageIcon boxSize={4} />
              <Text textStyle="300-bold" color="neutral.700">
                {t("Language")}
              </Text>
            </Flex>
            {languageItems.map((item, index) => (
              <button
                key={item.label}
                type="button"
                className={DRAWER_ITEM_CLASS_NAME}
                onClick={() => onLanguageSelect(index)}
              >
                <Text
                  as="span"
                  flex={1}
                  textStyle={index === selectedLanguageIndex ? "400-bold" : "400"}
                  color="neutral.900"
                >
                  {item.label}
                </Text>
                {index === selectedLanguageIndex ? (
                  <CheckIcon color="accessible.controls-on-neutral-lights" boxSize={4} />
                ) : null}
              </button>
            ))}
          </Box>
        </Flex>
      )}
    </Drawer>
  );
};

export default NavbarMobileDrawer;
