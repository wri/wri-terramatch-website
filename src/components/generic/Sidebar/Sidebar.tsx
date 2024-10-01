import classNames from "classnames";
import { useRouter } from "next/router";
import React from "react";

import Text from "@/components/elements/Text/Text";
import Icon, { IconNames } from "@/components/extensive/Icon/Icon";

const Sidebar = () => {
  const router = useRouter();

  return (
    <div className="flex flex-col items-center gap-8 bg-blueCustom-700 p-3 text-darkCustom-200">
      <a className="mb-10 mt-4 cursor-pointer" href="/home">
        <Icon name={IconNames.TERRAFUND_lOGO_MINI} />
      </a>
      <a
        className={classNames("flex cursor-pointer flex-col items-center gap-1", {
          "text-white": router.asPath === "/dashboard" || router.asPath.includes("/dashboard/")
        })}
        href="/dashboard/programme"
      >
        <Icon name={IconNames.DASHBOARDS} className="h-8 w-8" />
        <Text variant={"text-8"}>DASHBOARDS</Text>
      </a>
      <a
        className={classNames("flex cursor-pointer flex-col items-center gap-1", {
          "text-white": router.asPath.includes("/dashboard/project-profile")
        })}
        href="/dashboard/project-profile"
      >
        <Icon name={IconNames.PROJECT_PROFILE} className="h-8 w-8" />
        <Text variant={"text-8"}>
          PROJECT <br /> PROFILE
        </Text>
      </a>
      <a
        className={classNames("flex cursor-pointer flex-col items-center gap-1", {
          "text-white": router.asPath.includes("/dashboard/airtable")
        })}
        href="/dashboard/airtable"
      >
        <Icon name={IconNames.DASHBOARD_AIRTABLE} className="h-8 w-8" />
        <Text variant={"text-8"}>AIRTABLE</Text>
      </a>
      <a
        className={classNames("flex cursor-pointer flex-col items-center gap-1", {
          "text-white": router.asPath.includes("/dashboard/reports")
        })}
        href="/dashboard/reports"
      >
        <Icon name={IconNames.DASHBOARD_REPORTS} className="h-8 w-8" />
        <Text variant={"text-8"}>REPORTS</Text>
      </a>
      <a
        className={classNames("flex cursor-pointer flex-col items-center gap-1", {
          "text-white": router.asPath.includes("/dashboard/about-us")
        })}
        href="/dashboard/about-us"
      >
        <Icon name={IconNames.ABOUT_US} className="h-8 w-8" />
        <Text variant={"text-8"}>ABOUT US</Text>
      </a>
    </div>
  );
};

export default Sidebar;
