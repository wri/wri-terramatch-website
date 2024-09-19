import classNames from "classnames";
import { useRouter } from "next/router";
import React from "react";

import Text from "@/components/elements/Text/Text";
import Icon, { IconNames } from "@/components/extensive/Icon/Icon";

const Sidebar = () => {
  const router = useRouter();

  return (
    <div className="flex flex-col items-center gap-8 bg-blueCustom-700 p-3 text-darkCustom-200">
      <a className="mt-4 mb-10 cursor-pointer" href="/dashboards">
        <Icon name={IconNames.TERRAFUND_lOGO_MINI} />
      </a>
      <a
        className={classNames("flex cursor-pointer flex-col items-center gap-1", {
          "text-white": router.asPath === "/dashboards" || router.asPath.includes("/dashboards/dashboard")
        })}
        href="/dashboards/dashboard"
      >
        <Icon name={IconNames.DASHBOARDS} className="h-8 w-8" />
        <Text variant={"text-8"}>DASHBOARDS</Text>
      </a>
      <a
        className={classNames("flex cursor-pointer flex-col items-center gap-1", {
          "text-white": router.asPath.includes("/dashboards/project-profile")
        })}
        href="/dashboards/project-profile"
      >
        <Icon name={IconNames.PROJECT_PROFILE} className="h-8 w-8" />
        <Text variant={"text-8"}>
          PROJECT <br /> PROFILE
        </Text>
      </a>
      <a
        className={classNames("flex cursor-pointer flex-col items-center gap-1", {
          "text-white": router.asPath.includes("/dashboards/airtable")
        })}
        href="/dashboards/airtable"
      >
        <Icon name={IconNames.DASHBOARD_AIRTABLE} className="h-8 w-8" />
        <Text variant={"text-8"}>AIRTABLE</Text>
      </a>
      <a
        className={classNames("flex cursor-pointer flex-col items-center gap-1", {
          "text-white": router.asPath.includes("/dashboards/reports")
        })}
        href="/dashboards/reports"
      >
        <Icon name={IconNames.DASHBOARD_REPORTS} className="h-8 w-8" />
        <Text variant={"text-8"}>REPORTS</Text>
      </a>
      <a
        className={classNames("flex cursor-pointer flex-col items-center gap-1", {
          "text-white": router.asPath.includes("/dashboards/about-us")
        })}
        href="/dashboards/about-us"
      >
        <Icon name={IconNames.ABOUT_US} className="h-8 w-8" />
        <Text variant={"text-8"}>ABOUT US</Text>
      </a>
    </div>
  );
};

export default Sidebar;
