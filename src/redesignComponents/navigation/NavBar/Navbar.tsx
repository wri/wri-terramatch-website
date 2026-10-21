import { Box, Flex, Text } from "@chakra-ui/react";
import { useT } from "@transifex/react";
import { useRouter } from "next/router";
import { FC, ReactNode } from "react";

import Button from "@/redesignComponents/actions/Buttons/Button/Button";
import { LanguageIcon } from "@/redesignComponents/foundations/Icons";
import { TMLogo } from "@/redesignComponents/foundations/Logos/TMLogo";
import SimpleDivider from "@/redesignComponents/miscellaneous/Dividers/SimpleDivider";
import { NavigationMenuItem } from "@/redesignComponents/navigation/NavBar/NavigationMenu/NavigationMenu";

import Avatar from "../Avatar/Avatar";
import NavbarMenu from "./NavbarMenu/NavbarMenu";
import NavbarMobileDrawer from "./NavbarMobileDrawer/NavbarMobileDrawer";
import type { SideNavigationGroup } from "./SideNavigation/SideNavigation";
import { NavbarLinkItem, useNavbarData } from "./useNavbarData";

export interface NavbarProps {
  navLinks?: NavbarLinkItem[];
  languageItems?: NavigationMenuItem[];
  selectedLanguageIndex?: number;
  onLanguageSelect?: (index: number) => void;
  accountItems?: NavigationMenuItem[];
  accountLabel?: ReactNode;
  accountPrefix?: ReactNode;
  accountSuffix?: ReactNode;
  onAccountSelect?: (index: number) => void;
  linksDisabled?: boolean;
  isLoggedIn?: boolean;
  mobileMenuGroups?: SideNavigationGroup[];
}

const Navbar: FC<NavbarProps> = ({
  navLinks: navLinksProp,
  languageItems: languageItemsProp,
  selectedLanguageIndex: selectedLanguageIndexProp,
  onLanguageSelect: onLanguageSelectProp,
  accountItems: accountItemsProp,
  accountLabel: accountLabelProp,
  accountSuffix,
  onAccountSelect: onAccountSelectProp,
  linksDisabled: linksDisabledProp,
  isLoggedIn: isLoggedInProp,
  mobileMenuGroups = []
}) => {
  const t = useT();

  const data = useNavbarData();
  const router = useRouter();

  const navLinks = data.isAdmin ? [] : navLinksProp ?? data.navLinks;
  const languageItems = languageItemsProp ?? data.languageItems;
  const selectedLanguageIndex = selectedLanguageIndexProp ?? data.selectedLanguageIndex;
  const accountItems = accountItemsProp ?? data.accountItems;
  const accountLabel = accountLabelProp ?? data.accountLabel;
  const linksDisabled = linksDisabledProp ?? data.linksDisabled;
  const isLoggedIn = isLoggedInProp ?? data.isLoggedIn;

  const handleLanguageSelect = (index: number) => {
    onLanguageSelectProp?.(index);
    data.onLanguageSelect(index);
  };

  const handleAccountSelect = (index: number) => {
    onAccountSelectProp?.(index);
    data.onAccountSelect(index);
  };

  const accountPrefix = (
    <Avatar name={`${data.user?.firstName ?? ""} ${data.user?.lastName ?? ""}`.trim()} size="small" />
  );
  return (
    <Box as="header" backgroundColor="primary.900" position="sticky" top={0} zIndex={50}>
      <Flex justifyContent="space-between" alignItems="center" gap={{ base: 2, md: 4 }} h="3rem">
        <Flex gap={{ base: 2, md: 4 }} alignItems="center" pl={4}>
          <TMLogo boxSize="3.25rem" />
          <Flex gap={4} alignItems="center" display={{ base: "none", md: "flex" }}>
            {navLinks.map(link => (
              <Button
                key={link.label}
                variant="borderless"
                className="!text-white opacity-100 hover:opacity-100"
                onClick={link.onClick}
              >
                <Text
                  as="span"
                  textStyle={link.isActive === true ? "400-bold" : "400"}
                  color={link.isActive === true ? "primary.300" : "neutral.100"}
                >
                  {link.label}
                </Text>
              </Button>
            ))}
          </Flex>
        </Flex>
        <Flex alignItems="center">
          {isLoggedIn ? (
            <NavbarMenu
              items={accountItems}
              label={
                <Text as="span" display={{ base: "none", md: "inline" }}>
                  {accountLabel}
                </Text>
              }
              onSelect={handleAccountSelect}
              prefix={accountPrefix}
              suffix={accountSuffix}
              variant="simple"
              disabled={linksDisabled}
            />
          ) : (
            <>
              <Button
                variant="outline"
                color="neutral.100 !important"
                borderColor="neutral.100 !important"
                className="hover:!border-theme-primary-800 hover:!text-theme-primary-800"
                size="small"
                disabled={linksDisabled}
                onClick={() => router.push("/auth/signup")}
              >
                {t("Create account")}
              </Button>
              <Button variant="primary" size="small" onClick={() => router.push("/auth/login")}>
                {t("Sign in")}
              </Button>
            </>
          )}
          <Flex alignItems="center" display={{ base: "none", md: "flex" }}>
            <SimpleDivider backgroundColor="neutral.500" className="!h-12 !w-px" />
            <NavbarMenu
              items={languageItems}
              label={<LanguageIcon />}
              variant="list"
              selectedIndex={selectedLanguageIndex}
              onSelect={handleLanguageSelect}
            />
          </Flex>
          <Box display={{ base: "block", md: "none" }}>
            <NavbarMobileDrawer
              navLinks={navLinks}
              groups={mobileMenuGroups}
              languageItems={languageItems}
              selectedLanguageIndex={selectedLanguageIndex}
              onLanguageSelect={handleLanguageSelect}
            />
          </Box>
        </Flex>
      </Flex>
    </Box>
  );
};

export default Navbar;
