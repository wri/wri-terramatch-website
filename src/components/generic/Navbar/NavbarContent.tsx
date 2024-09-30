import { useT } from "@transifex/react";
import classNames from "classnames";
import { useRouter } from "next/router";
import { DetailedHTMLProps, Fragment, HTMLAttributes } from "react";
import { Else, If, Then, When } from "react-if";

import LanguagesDropdown from "@/components/elements/Inputs/LanguageDropdown/LanguagesDropdown";
import { IconNames } from "@/components/extensive/Icon/Icon";
import List from "@/components/extensive/List/List";
import { useNavbarContext } from "@/context/navbar.provider";
import { useLogout } from "@/hooks/logout";
import { useMyOrg } from "@/hooks/useMyOrg";
import { OptionValue } from "@/types/common";

import NavbarItem from "./NavbarItem";
import { getNavbarItems } from "./navbarItems";

interface NavbarContentProps extends DetailedHTMLProps<HTMLAttributes<HTMLDivElement>, HTMLDivElement> {
  isLoggedIn?: boolean;
  handleClose?: () => void;
}

const NavbarContent = ({ isLoggedIn, handleClose, ...rest }: NavbarContentProps) => {
  const router = useRouter();
  const t = useT();
  const myOrg = useMyOrg();
  const logout = useLogout();
  const { private: privateNavItems, public: publicNavItems } = getNavbarItems(t, myOrg);

  const navItems = (isLoggedIn ? privateNavItems : publicNavItems).filter(item => item.visibility);

  const { linksDisabled } = useNavbarContext();

  const setV1Lang = (lang: string) => {
    let v1Lang = lang;

    if (lang === "es-MX") v1Lang = "es";
    if (lang === "fr-FR") v1Lang = "fr";

    localStorage.setItem("i18nextLng", v1Lang);
  };

  const changeLanguageHandler = (lang: OptionValue) => {
    //Change Locale without changing the route
    router.push({ pathname: router.pathname, query: router.query }, router.asPath, { locale: lang.toString() });
    setV1Lang(lang as string);
    handleClose?.();
  };

  return (
    <div {...rest}>
      <div className="absolute left-[50%] top-4 translate-x-[-50%]">
        <LanguagesDropdown onChange={changeLanguageHandler} className="block sm:hidden" />
      </div>
      <List
        as={Fragment}
        itemAs="div"
        items={navItems}
        render={item => (
          <NavbarItem
            href={item.url}
            active={router.asPath === item.url || router.asPath === `${item.url}#`}
            className={classNames("text-darkCustom sm:mr-2", item.tourTarget)}
            onClick={handleClose}
            disabled={linksDisabled}
          >
            {item.title}
          </NavbarItem>
        )}
      />
      <When condition={navItems.length > 0}>
        <div className="hidden h-4 w-[1px] bg-neutral-500 sm:mx-2 sm:block" />
      </When>
      <If condition={isLoggedIn}>
        <Then>
          <NavbarItem href="/" iconName={IconNames.LOGIN} onClick={logout}>
            {t("Logout")}
          </NavbarItem>
        </Then>
        <Else>
          <NavbarItem href="/auth/login" iconName={IconNames.LOGIN} onClick={handleClose}>
            {t("Sign in")}
          </NavbarItem>
        </Else>
      </If>
      <LanguagesDropdown onChange={changeLanguageHandler} isLoggedIn={isLoggedIn} className="hidden sm:block" />
    </div>
  );
};

export default NavbarContent;
