import { useT } from "@transifex/react";
import { useRouter } from "next/router";

import { removeAccessToken } from "@/admin/apiProvider/utils/token";
import { useOpenWhatsNewModal } from "@/components/extensive/WelcomeTour/useOpenWhatsNewModal";
import { getNavbarItems } from "@/components/generic/Navbar/navbarItems";
import { useLogin } from "@/connections/Login";
import { useMyOrg } from "@/connections/Organisation";
import { useMyUser, ValidLocale } from "@/connections/User";
import { useNavbarContext } from "@/context/navbar.provider";
import { UserDto } from "@/generated/v3/userService/userServiceSchemas";
import ApiSlice from "@/store/apiSlice";

import { NavigationMenuItem } from "./NavigationMenu/NavigationMenu";
import { isRouteActive } from "./SideNavigation/useIsRouteActive";

export interface NavbarLinkItem {
  label: string;
  href?: string;
  onClick?: () => void;
  isActive?: boolean;
}

const ROUTES_WITHOUT_NAV_LINKS = ["/organization/assign", "/organization/status/pending"];

const LANGUAGES: Array<{ value: ValidLocale; label: string }> = [
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
  const openWhatsNewModal = useOpenWhatsNewModal();

  const isLoggedIn = login != null;
  const isOnDashboard = router.asPath.split("?")[0].split("/")[1] === "dashboard";

  const { private: privateNavItems, public: publicNavItems } = getNavbarItems(t, myOrg, isAdmin);
  const rawNavItems = (isLoggedIn ? privateNavItems : publicNavItems).filter(item => item.visibility);

  const currentPath = router.asPath.split(/[?#]/)[0];
  const hideNavLinks = ROUTES_WITHOUT_NAV_LINKS.includes(router.pathname);
  const navLinks: NavbarLinkItem[] = hideNavLinks
    ? []
    : [
        ...rawNavItems.map(item => ({
          label: item.title,
          href: item.url,
          isActive: isRouteActive(currentPath, item.url),
          onClick: () => router.push(item.url)
        })),
        ...(isLoggedIn ? [{ label: t("What’s new"), onClick: openWhatsNewModal }] : [])
      ];

  const handleLogout = () => {
    removeAccessToken();
    router.push("/auth/login").then(() => ApiSlice.clearApiCache());
  };

  const handleSwitchView = () => {
    if (!loaded) return;
    window.location.assign(isAdmin ? "/admin" : "/home");
  };

  const accountActions = isLoggedIn
    ? [
        ...(isOnDashboard
          ? [{ label: isAdmin ? t("Admin view") : t("Project Developer view"), onSelect: handleSwitchView }]
          : []),
        { label: t("Logout"), onSelect: handleLogout }
      ]
    : [];
  const accountItems: NavigationMenuItem[] = accountActions.map(({ label }) => ({ label }));

  const handleAccountSelect = (index: number) => {
    accountActions[index]?.onSelect();
  };

  const languageItems: NavigationMenuItem[] = LANGUAGES.map(lang => ({ label: t(lang.label) }));
  const selectedLanguageIndex = Math.max(
    0,
    LANGUAGES.findIndex(lang => lang.value === router.locale)
  );

  const handleLanguageSelect = (index: number) => {
    const lang = LANGUAGES[index]?.value;
    if (lang == null) return;
    if (setLocale != null) {
      setLocale(lang);
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
