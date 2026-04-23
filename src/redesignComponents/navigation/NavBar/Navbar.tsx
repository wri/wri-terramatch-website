import { Box, Flex } from "@chakra-ui/react";
import { FC, ReactNode, useState } from "react";

import Button from "@/redesignComponents/actions/Buttons/Button/Button";
import { LanguageIcon } from "@/redesignComponents/foundations/Icons";
import { TMLogo } from "@/redesignComponents/foundations/Logos/TMLogo";
import SimpleDivider from "@/redesignComponents/miscellaneous/Dividers/SimpleDivider";
import { NavigationMenuItem } from "@/redesignComponents/navigation/NavBar/NavigationMenu/NavigationMenu";

import NavbarMenu from "./NavbarMenu/NavbarMenu";

export interface NavbarLinkItem {
  label: string;
  href?: string;
  onClick?: () => void;
  isActive?: boolean;
}

export interface NavbarProps {
  navLinks?: NavbarLinkItem[];
  languageItems?: NavigationMenuItem[];
  onLanguageSelect?: (index: number) => void;
  accountItems?: NavigationMenuItem[];
  accountLabel?: ReactNode;
  accountPrefix?: ReactNode;
  accountSuffix?: ReactNode;
  onAccountSelect?: (index: number) => void;
}

const Navbar: FC<NavbarProps> = ({
  navLinks = [],
  languageItems = [],
  onLanguageSelect,
  accountItems = [],
  accountLabel = "Account",
  accountPrefix,
  accountSuffix,
  onAccountSelect
}) => {
  const [selectedLanguageIndex, setSelectedLanguageIndex] = useState<number | undefined>(undefined);

  const handleLanguageSelect = (index: number) => {
    setSelectedLanguageIndex(index);
    onLanguageSelect?.(index);
  };
  return (
    <Box backgroundColor="primary.900">
      <Flex justifyContent="space-between" alignItems="center" gap={4}>
        <Flex gap={4} alignItems="center" pl={4}>
          <TMLogo boxSize="52px" />
          {navLinks.map((link, index) => (
            <Button
              key={index}
              variant="borderless"
              className={`!text-white ${link.isActive ? "!opacity-100" : "opacity-100 hover:opacity-100"}`}
              onClick={link.onClick}
            >
              <span className={` ${link.isActive ? "font-bold text-theme-primary-300" : "text-theme-neutral-100"}`}>
                {link.label}
              </span>
            </Button>
          ))}
        </Flex>
        <Flex gap={2} alignItems="center">
          {accountItems.length > 0 ? (
            <NavbarMenu
              items={accountItems}
              label={accountLabel}
              onSelect={onAccountSelect}
              prefix={accountPrefix}
              suffix={accountSuffix}
              variant="mega"
            />
          ) : (
            <>
              <Button
                variant="outline"
                color="neutral.100 !important"
                borderColor="neutral.100 !important"
                className="hover:!border-theme-primary-800 hover:!text-theme-primary-800"
                size="small"
              >
                Create account
              </Button>
              <Button variant="primary" className="" size="small">
                Sign in
              </Button>
            </>
          )}
          <SimpleDivider backgroundColor="neutral.500" className="!h-12 !w-px" />
          <NavbarMenu
            items={languageItems}
            label={<LanguageIcon />}
            variant="list"
            selectedIndex={selectedLanguageIndex}
            onSelect={handleLanguageSelect}
          />
        </Flex>
      </Flex>
    </Box>
  );
};

export default Navbar;
