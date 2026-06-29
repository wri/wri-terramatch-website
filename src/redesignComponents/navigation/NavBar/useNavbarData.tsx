import { useT } from "@transifex/react";
import { useRouter } from "next/router";
import { useMemo } from "react";

import { removeAccessToken } from "@/admin/apiProvider/utils/token";
import { getNavbarItems } from "@/components/generic/Navbar/navbarItems";
import { useLogin } from "@/connections/Login";
import { useMyOrg } from "@/connections/Organisation";
import { useMyUser, ValidLocale } from "@/connections/User";
import { useNavbarContext } from "@/context/navbar.provider";
import { UserDto } from "@/generated/v3/userService/userServiceSchemas";
import { DashboardIcon } from "@/redesignComponents/foundations/Icons";
import ApiSlice from "@/store/apiSlice";

import { NavigationMenuItem } from "./NavigationMenu/NavigationMenu";

export interface NavbarLinkItem {
  label: string;
  href?: string;
  onClick?: () => void;
  isActive?: boolean;
}

const LANGUAGES: Array<{ value: string; label: string }> = [
  { value: "en-US", label: "English" },
  { value: "es-MX", label: "Spanish" },
  { value: "fr-FR", label: "French" },
  { value: "pt-BR", label: "Portuguese" }
];

export interface NavbarData {
  navLinks: NavbarLinkItem[];
  accountItems: NavigationMenuItem[];
  accountLabel: string | undefined;
  languageItems: NavigationMenuItem[];
  selectedLanguageIndex: number;
  linksDisabled: boolean;
  isLoggedIn: boolean;
  onAccountSelect: (index: number) => void;
  onLanguageSelect: (index: number) => void;
  user: UserDto | null;
  isAdmin: boolean;
  isOnDashboard: boolean;
}

export const useNavbarData = (): NavbarData => {
  const t = useT();
  const router = useRouter();
  const [, { data: login }] = useLogin({});
  const [loaded, { isAdmin, setLocale, user }] = useMyUser();
  const [, myOrg] = useMyOrg();
  const { linksDisabled } = useNavbarContext();

  const isLoggedIn = login != null;
  const isOnDashboard = router.asPath.split("?")[0].split("/")[1] === "dashboard";

  const { private: privateNavItems, public: publicNavItems } = getNavbarItems(t, myOrg);
  const rawNavItems = (isLoggedIn ? privateNavItems : publicNavItems).filter(item => item.visibility);

  const navLinks: NavbarLinkItem[] = rawNavItems.map(item => ({
    label: item.title,
    href: item.url,
    isActive: router.asPath === item.url || router.asPath === `${item.url}#`,
    onClick: () => router.push(item.url)
  }));

  const accountItems: NavigationMenuItem[] = useMemo(() => {
    if (!isLoggedIn) return [];
    const switchLabel = isOnDashboard ? (isAdmin ? t("Admin view") : t("Project Developer view")) : t("Dashboard");
    return [{ label: switchLabel, icon: <DashboardIcon /> }, { label: t("Logout") }];
  }, [isLoggedIn, isOnDashboard, isAdmin, t]);

  const handleAccountSelect = (index: number) => {
    if (index === 1) {
      removeAccessToken();
      router.push("/auth/login").then(() => ApiSlice.clearApiCache());
    } else {
      if (!loaded) return;
      if (isOnDashboard) {
        router.push(isAdmin ? "/admin" : "/home");
      } else {
        router.push(isAdmin ? "/dashboard" : "/dashboard/learn-more");
      }
      setTimeout(() => router.reload(), 1000);
    }
  };

  const languageItems: NavigationMenuItem[] = LANGUAGES.map(lang => ({ label: t(lang.label) }));
  const selectedLanguageIndex = Math.max(
    0,
    LANGUAGES.findIndex(lang => lang.value === router.locale)
  );

  const handleLanguageSelect = (index: number) => {
    const lang = LANGUAGES[index]?.value;
    if (!lang) return;
    if (setLocale != null) {
      setLocale(lang as ValidLocale);
    } else {
      router.push({ pathname: router.pathname, query: router.query }, router.asPath, { locale: lang });
    }
  };

  return {
    navLinks,
    accountItems,
    accountLabel: isLoggedIn ? t("My Account") : undefined,
    languageItems,
    selectedLanguageIndex,
    linksDisabled,
    isLoggedIn,
    onAccountSelect: handleAccountSelect,
    onLanguageSelect: handleLanguageSelect,
    user: loaded ? user ?? null : null,
    isAdmin,
    isOnDashboard
  };
};
