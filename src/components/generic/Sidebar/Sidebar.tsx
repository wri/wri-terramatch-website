import { useT } from "@transifex/react";
import classNames from "classnames";
import { useRouter } from "next/router";
import React from "react";

import LanguagesDropdown from "@/components/elements/Inputs/LanguageDropdown/LanguagesDropdown";
import { VARIANT_LANGUAGES_DROPDOWN_SECONDARY } from "@/components/elements/Inputs/LanguageDropdown/LanguagesDropdownVariant";
import Menu from "@/components/elements/Menu/Menu";
import { MENU_PLACEMENT_RIGHT_TOP } from "@/components/elements/Menu/MenuVariant";
import Text from "@/components/elements/Text/Text";
import Tooltip from "@/components/elements/Tooltip/Tooltip";
import Icon, { IconNames } from "@/components/extensive/Icon/Icon";
import { logout, useLogin } from "@/connections/Login";

const Sidebar = () => {
  const router = useRouter();
  const [, { isLoggedIn }] = useLogin();

  const t = useT();

  return (
    <div className="flex flex-col justify-between bg-blueCustom-700 p-3">
      <div className="flex flex-col items-center gap-8 text-darkCustom-200">
        <a className="mt-4 mb-10 cursor-pointer" href="/home">
          <Icon name={IconNames.TERRAFUND_lOGO_MINI} />
        </a>
        <Tooltip content={t("DASHBOARDS")} placement="right">
          <a
            className={classNames("flex cursor-pointer flex-col items-center gap-1", {
              "text-white":
                router.asPath.includes("/dashboard") &&
                !router.asPath.includes("/dashboard/project-list") &&
                !router.asPath.includes("/dashboard/project-insights") &&
                !router.asPath.includes("/dashboard/learn-more") &&
                !router.asPath.includes("/dashboard/impact-story")
            })}
            href="/dashboard"
          >
            <Icon name={IconNames.DASHBOARDS} className="h-8 w-8" />
            <Text variant={"text-8"}>{t("DASHBOARDS")}</Text>
          </a>
        </Tooltip>
        <Tooltip content={t("PROJECT LIST")} placement="right">
          <a
            className={classNames("flex cursor-pointer flex-col items-center gap-1", {
              "text-white": router.asPath.includes("/dashboard/project-list")
            })}
            href="/dashboard/project-list"
          >
            <Icon name={IconNames.PROJECT_PROFILE} className="h-8 w-8" />
            <Text variant={"text-8"} className="text-center">
              {t("PROJECT")} <br /> {t("LIST")}
            </Text>
          </a>
        </Tooltip>

        <Tooltip content={t("COMING SOON")} placement="right">
          <a
            className={classNames("flex cursor-not-allowed flex-col items-center gap-1 opacity-50", {
              "text-white": router.asPath.includes("/dashboard/project-insights")
            })}
          >
            <Icon name={IconNames.DASHBOARD_AIRTABLE} className="h-8 w-8" />
            <Text variant={"text-8"} className="text-center">
              {t("PROJECT")} <br />
              {t("INSIGHTS")}
            </Text>
          </a>
        </Tooltip>

        <Tooltip content={t("IMPACT STORY")} placement="right">
          <a
            className={classNames("flex cursor-pointer flex-col items-center gap-1", {
              "text-white": router.asPath.includes("/dashboard/impact-story")
            })}
            href="/dashboard/impact-story"
          >
            <Icon name={IconNames.DASHBOARD_IMPACT_STORY} className="h-8 w-8" />
            <Text variant={"text-8"} className="text-center uppercase">
              {t("Impact")} <br />
              {t("Story")}
            </Text>
          </a>
        </Tooltip>

        <Tooltip content={t("LEARN MORE")} placement="right">
          <a
            className={classNames("flex cursor-pointer flex-col items-center gap-1", {
              "text-white": router.asPath.includes("/dashboard/learn-more")
            })}
            href="/dashboard/learn-more"
          >
            <Icon name={IconNames.ABOUT_US} className="h-8 w-8" />
            <Text variant={"text-8"}>{t("LEARN MORE")}</Text>
          </a>
        </Tooltip>
      </div>
      <div className="flex flex-col items-center justify-center gap-4 pb-7">
        <LanguagesDropdown variant={VARIANT_LANGUAGES_DROPDOWN_SECONDARY} />
        <Menu
          className="flex w-full justify-center"
          placement={MENU_PLACEMENT_RIGHT_TOP}
          menu={[
            {
              id: "1",
              render: () => (
                <Text variant="text-14" className="flex cursor-pointer items-center" onClick={logout}>
                  {isLoggedIn ? t("Sign out") : t("Sign in")}
                </Text>
              )
            }
          ]}
        >
          <Icon name={IconNames.IC_USER} className="h-8 w-8" />
        </Menu>
      </div>
    </div>
  );
};

export default Sidebar;
