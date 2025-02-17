import { useMediaQuery } from "@mui/material";
import { useT } from "@transifex/react";
import classNames from "classnames";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import { When } from "react-if";

import { removeAccessToken } from "@/admin/apiProvider/utils/token";
import LanguagesDropdown from "@/components/elements/Inputs/LanguageDropdown/LanguagesDropdown";
import { VARIANT_LANGUAGES_DROPDOWN_SECONDARY } from "@/components/elements/Inputs/LanguageDropdown/LanguagesDropdownVariant";
import MyAccountDropdown from "@/components/elements/Inputs/MyAccountDropdown/MyAccountDropdown";
import { VARIANT_MY_ACCOUNT_DROPDOWN_SECONDARY } from "@/components/elements/Inputs/MyAccountDropdown/MyAccountDropdownVariant";
import Text from "@/components/elements/Text/Text";
import Tooltip from "@/components/elements/Tooltip/Tooltip";
import Icon, { IconNames } from "@/components/extensive/Icon/Icon";
import { useLogin } from "@/connections/Login";
import { useMyUser, ValidLocale } from "@/connections/User";

interface NavItem {
  path: string;
  icon: IconNames;
  label: string;
  disabled?: boolean;
}

const NAV_ITEMS: NavItem[] = [
  {
    path: "/dashboard",
    icon: IconNames.DASHBOARDS,
    label: "Dashboards"
  },
  {
    path: "/dashboard/project-list",
    icon: IconNames.PROJECT_PROFILE,
    label: "Project<br />List"
  },
  {
    path: "/dashboard/project-insights",
    icon: IconNames.DASHBOARD_AIRTABLE,
    label: "Project<br />Insights",
    disabled: true
  },
  {
    path: "/dashboard/impact-story",
    icon: IconNames.DASHBOARD_IMPACT_STORY,
    label: "Impact<br />Story"
  },
  {
    path: "/dashboard/learn-more",
    icon: IconNames.ABOUT_US,
    label: "Learn More"
  }
];

const Sidebar = () => {
  const router = useRouter();
  const [, { isLoggedIn }] = useLogin();
  const [, { setLocale }] = useMyUser();
  const t = useT();

  const isMobile = useMediaQuery("(max-width: 1200px)");
  const [isOpen, setIsOpen] = useState(!isMobile);

  const changeLanguageHandler = (lang: string) => {
    if (setLocale) {
      setLocale(lang as ValidLocale);
      window.location.reload();
    } else {
      router.push({ pathname: router.pathname, query: router.query }, router.asPath, { locale: lang });
      setTimeout(() => window.location.reload(), 1000);
    }
  };

  useEffect(() => {
    if (!isMobile) setIsOpen(true);
  }, [isMobile]);

  const renderNavItem = ({ path, icon, label, disabled }: NavItem) => {
    if (!isMobile) {
      return (
        <div key={label + "tooltip"}>
          <Tooltip
            content={t(disabled ? "COMING SOON" : label.replace("<br />", " "))}
            placement="right"
            className="uppercase"
          >
            <a
              className={classNames("flex cursor-pointer flex-col items-center gap-1 mobile:flex-row", {
                "text-white":
                  (label !== "Dashboards" && router.asPath.includes(path)) ||
                  (label === "Dashboards" &&
                    !router.asPath.includes("/dashboard/project-list") &&
                    !router.asPath.includes("/dashboard/project-insights") &&
                    !router.asPath.includes("/dashboard/learn-more") &&
                    !router.asPath.includes("/dashboard/impact-story")),
                "cursor-not-allowed opacity-50": disabled
              })}
              href={disabled ? undefined : path}
            >
              <Icon name={icon} className="h-8 w-8" />
              <Text variant={isMobile ? "text-14-semibold" : "text-8"} className="text-center uppercase" containHtml>
                {t(label)}
              </Text>
            </a>
          </Tooltip>
        </div>
      );
    }
    return (
      <a
        key={label + "mobile"}
        className={classNames(
          "flex items-center justify-between mobile:border-b mobile:border-grey-1000 mobile:p-4 ",
          "mobile:w-full  mobile:!text-black ",
          {
            "text-white":
              (label !== "DASHBOARDS" && router.asPath.includes(path)) ||
              (label === "DASHBOARDS" &&
                !router.asPath.includes("/dashboard/project-list") &&
                !router.asPath.includes("/dashboard/project-insights") &&
                !router.asPath.includes("/dashboard/learn-more") &&
                !router.asPath.includes("/dashboard/impact-story")),
            "cursor-not-allowed opacity-50": disabled,
            "mobile:hidden": !isOpen
          }
        )}
        href={disabled ? undefined : path}
      >
        <div className="flex items-center gap-2">
          <Icon name={icon} className="h-4 w-4" />
          <Text variant={isMobile ? "text-14-semibold" : "text-8"} className="text-center" containHtml>
            {t(label.replace("<br />", " "))}
          </Text>
        </div>
        <Icon name={IconNames.IC_ARROW_COLLAPSE} className="h-3 w-3 rotate-90" />
      </a>
    );
  };

  return (
    <div
      className={classNames(
        "flex flex-col justify-between bg-blueCustom-700 p-3",
        "mobile:relative mobile:z-[60] mobile:h-15 mobile:flex-row mobile:items-center mobile:px-4"
      )}
    >
      <div className="flex flex-col items-center gap-8 text-darkCustom-200 mobile:flex-row">
        <a className="mt-4 mb-10 cursor-pointer mobile:m-0" href="/home">
          <Icon name={IconNames.TERRAFUND_lOGO_MINI} className="mobile:h-6 mobile:w-6" />
        </a>

        <div
          className={classNames(
            "left-0 flex flex-col items-center gap-8 mobile:bg-white",
            "mobile:absolute mobile:top-full mobile:w-full mobile:gap-0 mobile:py-4 mobile:transition-all mobile:duration-300",
            {
              "bottom-full mobile:bottom-full mobile:!h-0 mobile:opacity-0": !isOpen,
              "mobile:top-0 mobile:opacity-100": isOpen
            }
          )}
          style={isMobile ? { height: `${window.innerHeight - 60}px` } : {}}
        >
          {NAV_ITEMS.map(item => renderNavItem(item))}
          <When condition={isMobile}>
            <button
              key={"logout mobile"}
              className={classNames(
                "flex items-center justify-between mobile:border-b mobile:border-grey-1000 mobile:p-4 ",
                "mobile:w-full  mobile:!text-black ",
                {
                  "mobile:hidden": !isOpen
                }
              )}
              onClick={() => {
                removeAccessToken();
                router.push("/auth/login");
              }}
            >
              <div className="flex items-center gap-2">
                <Icon name={IconNames.LOGOUT} className="h-4 w-4 opacity-60" />
                <Text variant={isMobile ? "text-14-semibold" : "text-8"} className="text-center" containHtml>
                  {t("Logout")}
                </Text>
              </div>
              <Icon name={IconNames.IC_ARROW_COLLAPSE} className="h-3 w-3 rotate-90" />
            </button>
          </When>
        </div>
      </div>

      <div
        className={classNames("flex flex-col items-center justify-center gap-4 pb-7", "mobile:flex-row mobile:pb-0")}
      >
        <LanguagesDropdown variant={VARIANT_LANGUAGES_DROPDOWN_SECONDARY} onChange={changeLanguageHandler} />
        {!isMobile && <MyAccountDropdown variant={VARIANT_MY_ACCOUNT_DROPDOWN_SECONDARY} isLoggedIn={isLoggedIn} />}
        {isMobile && (
          <button className="text-white" onClick={() => setIsOpen(!isOpen)}>
            <Icon name={isOpen ? IconNames.CLEAR_DASHBOARD : IconNames.IC_MENU} className={classNames("h-5 w-5")} />
          </button>
        )}
      </div>
    </div>
  );
};

export default Sidebar;
