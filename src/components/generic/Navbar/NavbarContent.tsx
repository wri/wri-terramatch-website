import { useT } from "@transifex/react";
import classNames from "classnames";
import { useRouter } from "next/router";
import { DetailedHTMLProps, Fragment, HTMLAttributes } from "react";
import { Else, If, Then, When } from "react-if";

import LanguagesDropdown from "@/components/elements/Inputs/LanguageDropdown/LanguagesDropdown";
import MyAccountDropdown from "@/components/elements/Inputs/MyAccountDropdown/MyAccountDropdown";
import { IconNames } from "@/components/extensive/Icon/Icon";
import List from "@/components/extensive/List/List";
import { logout, useLogin } from "@/connections/Login";
import { useMyOrg } from "@/connections/Organisation";
import { useMyUser, ValidLocale } from "@/connections/User";
import { useNavbarContext } from "@/context/navbar.provider";

import NavbarItem from "./NavbarItem";
import { getNavbarItems } from "./navbarItems";

interface NavbarContentProps extends DetailedHTMLProps<HTMLAttributes<HTMLDivElement>, HTMLDivElement> {
  handleClose?: () => void;
}

const NavbarContent = ({ handleClose, ...rest }: NavbarContentProps) => {
  const [, { isLoggedIn }] = useLogin();
  const router = useRouter();
  const t = useT();
  const [, { setLocale }] = useMyUser();
  const [, myOrg] = useMyOrg();
  const { private: privateNavItems, public: publicNavItems } = getNavbarItems(t, myOrg);

  const navItems = (isLoggedIn ? privateNavItems : publicNavItems).filter(item => item.visibility);

  const { linksDisabled } = useNavbarContext();

  const changeLanguageHandler = (lang: string) => {
    if (setLocale != null) {
      // In this case, the Bootstrap component will notice the changed user locale and update our URL for us
      // after the server round trip. We don't want to do it here because then it's a race condition
      // that can cause the URL locale to flicker.
      setLocale(lang as ValidLocale);
    } else {
      // In this case we don't have a user to store the locale on, so just go ahead and directly change the URL.
      router.push({ pathname: router.pathname, query: router.query }, router.asPath, { locale: lang.toString() });
    }

    handleClose?.();
  };

  return (
    <div {...rest}>
      <div className="absolute top-4 left-[50%] translate-x-[-50%]">
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
      <MyAccountDropdown />
      <LanguagesDropdown onChange={changeLanguageHandler} className="hidden sm:block" />
    </div>
  );
};

export default NavbarContent;
