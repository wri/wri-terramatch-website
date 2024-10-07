import classNames from "classnames";
import { useRouter } from "next/router";
import React from "react";

import Text from "@/components/elements/Text/Text";
import Tooltip from "@/components/elements/Tooltip/Tooltip";
import Icon, { IconNames } from "@/components/extensive/Icon/Icon";

const Sidebar = () => {
  const router = useRouter();

  return (
    <div className="flex flex-col items-center gap-8 bg-blueCustom-700 p-3 text-darkCustom-200">
      <a className="mb-10 mt-4 cursor-pointer" href="/home">
        <Icon name={IconNames.TERRAFUND_lOGO_MINI} />
      </a>
      <Tooltip content="DASHBOARDS" placement="right">
        <a
          className={classNames("flex cursor-pointer flex-col items-center gap-1", {
            "text-white": router.asPath === "/dashboard/project" || router.asPath.includes("/dashboard/country")
          })}
          href="/dashboard/programme"
        >
          <Icon name={IconNames.DASHBOARDS} className="h-8 w-8" />
          <Text variant={"text-8"}>DASHBOARDS</Text>
        </a>
      </Tooltip>
      <Tooltip content="PROJECT LIST" placement="right">
        <a
          className={classNames("flex cursor-pointer flex-col items-center gap-1", {
            "text-white": router.asPath.includes("/dashboard/project-list")
          })}
          href="/dashboard/project-list"
        >
          <Icon name={IconNames.PROJECT_PROFILE} className="h-8 w-8" />
          <Text variant={"text-8"} className="text-center">
            PROJECT <br /> LIST
          </Text>
        </a>
      </Tooltip>

      <Tooltip content="PROJECT INSIGHTS" placement="right">
        <a
          className={classNames("flex cursor-pointer flex-col items-center gap-1", {
            "text-white": router.asPath.includes("/dashboard/project-insights")
          })}
          href="/dashboard/project-insights"
        >
          <Icon name={IconNames.DASHBOARD_AIRTABLE} className="h-8 w-8" />
          <Text variant={"text-8"} className="text-center">
            PROJECT <br />
            INSIGHTS
          </Text>
        </a>
      </Tooltip>

      <Tooltip content="COMING SOON" placement="right">
        <a
          className={classNames("flex cursor-not-allowed flex-col items-center gap-1 opacity-50", {
            "text-white": router.asPath.includes("/dashboard/reports")
          })}
        >
          <Icon name={IconNames.DASHBOARD_REPORTS} className="h-8 w-8" />
          <Text variant={"text-8"}>REPORTS</Text>
        </a>
      </Tooltip>

      <Tooltip content="ABOUT US" placement="right">
        <a
          className={classNames("flex cursor-pointer flex-col items-center gap-1", {
            "text-white": router.asPath.includes("/dashboard/about-us")
          })}
          href="/dashboard/about-us"
        >
          <Icon name={IconNames.ABOUT_US} className="h-8 w-8" />
          <Text variant={"text-8"}>ABOUT US</Text>
        </a>
      </Tooltip>
    </div>
  );
};

export default Sidebar;
