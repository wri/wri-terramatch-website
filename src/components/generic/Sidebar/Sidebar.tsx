import { useT } from "@transifex/react";
import classNames from "classnames";
import { useRouter } from "next/router";
import React from "react";

import Menu from "@/components/elements/Menu/Menu";
import { MENU_PLACEMENT_RIGHT_TOP } from "@/components/elements/Menu/MenuVariant";
import Text from "@/components/elements/Text/Text";
import Tooltip from "@/components/elements/Tooltip/Tooltip";
import Icon, { IconNames } from "@/components/extensive/Icon/Icon";

const Sidebar = () => {
  const router = useRouter();
  const t = useT();

  return (
    <div className="flex flex-col justify-between bg-blueCustom-700 p-3">
      <div className="flex flex-col items-center gap-8 text-darkCustom-200">
        <a className="mb-10 mt-4 cursor-pointer" href="/home">
          <Icon name={IconNames.TERRAFUND_lOGO_MINI} />
        </a>
        <Tooltip content={t("DASHBOARDS")} placement="right">
          <a
            className={classNames("flex cursor-pointer flex-col items-center gap-1", {
              "text-white":
                router.asPath.includes("/dashboard") &&
                !router.asPath.includes("/dashboard/project-list") &&
                !router.asPath.includes("/dashboard/project-insights") &&
                !router.asPath.includes("/dashboard/about-us")
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

        <Tooltip content={t("ABOUT US")} placement="right">
          <a
            className={classNames("flex cursor-pointer flex-col items-center gap-1", {
              "text-white": router.asPath.includes("/dashboard/about-us")
            })}
            href="/dashboard/about-us"
          >
            <Icon name={IconNames.ABOUT_US} className="h-8 w-8" />
            <Text variant={"text-8"}>{t("ABOUT US")}</Text>
          </a>
        </Tooltip>
      </div>
      <Menu
        className="flex w-full justify-center"
        placement={MENU_PLACEMENT_RIGHT_TOP}
        menu={[
          {
            id: "1",
            render: () => (
              <Text variant="text-14" className="flex items-center">
                {t("Sign out")}
              </Text>
            )
          }
        ]}
      >
        <Icon name={IconNames.IC_USER} className="h-8 w-8" />
      </Menu>
    </div>
  );
};

export default Sidebar;
