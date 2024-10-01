import { useT } from "@transifex/react";
import classNames from "classnames";
import React, { useState } from "react";
import { When } from "react-if";

import Button from "@/components/elements/Button/Button";
import Table from "@/components/elements/Table/Table";
import { VARIANT_TABLE_DASHBOARD_COUNTRIES } from "@/components/elements/Table/TableVariants";
import Text from "@/components/elements/Text/Text";
import ToolTip from "@/components/elements/Tooltip/Tooltip";
import Icon from "@/components/extensive/Icon/Icon";
import { IconNames } from "@/components/extensive/Icon/Icon";

import { ACTIVE_COUNTRIES } from "../mockedData/dashboard";
import { TooltipGridMap } from "./TooltipGridMap";
const ContentOverview = () => {
  const [collapseMap, setCollapseMap] = useState(false);
  const t = useT();

  const columnsActiveCountries = [
    {
      header: "Country",
      accessorKey: "country"
    },
    {
      header: "Projest",
      accessorKey: "project"
    },
    {
      header: "Trees Planted",
      accessorKey: "treesPlanted"
    },
    {
      header: "Hectares Restoration",
      accessorKey: "hectaresRestoration"
    },
    {
      header: "Jobs Created",
      accessorKey: "jobsCreated"
    }
  ];
  return (
    <div className="flex w-2/5">
      <div
        className={classNames("flex flex-1 flex-col overflow-hidden p-0", {
          "gap-4": collapseMap
        })}
      >
        <div className="shadow-lg relative">
          <div
            className={classNames("rounded-xl bg-white px-4 transition-all duration-500 ease-in-out", {
              "max-h-[70vh] py-4": !collapseMap,
              "max-h-0 py-0": collapseMap
            })}
          >
            <Text variant={"text-20-bold"}>{t("MAP")}</Text>
          </div>
          <img
            src="/images/map-img.png"
            alt="map"
            className={classNames("h-full w-full transition-all duration-500 ease-in-out", {
              "max-h-[48vh]": collapseMap,
              "max-h-0": !collapseMap
            })}
          />
          <When condition={collapseMap}>
            <TooltipGridMap label="Angola" learnMore={true} />
          </When>
        </div>

        <div className={classNames("overflow-hidden rounded-xl bg-white p-4 shadow-all", { "-mt-2": !collapseMap })}>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Text variant={"text-20-bold"}>{t("ACTIVE COUNTRIES")}</Text>
              <ToolTip content={"tooltip table"} placement="top" width="w-44 lg:w-52">
                <Icon name={IconNames.IC_INFO} className="h-3.5 w-3.5 text-darkCustom lg:h-5 lg:w-5" />
              </ToolTip>
            </div>
            <Button
              variant="white-border"
              onClick={() => {
                setCollapseMap(!collapseMap);
              }}
            >
              <div className="flex items-center gap-1">
                <Icon name={!collapseMap ? IconNames.COLLAPSE : IconNames.EXPAND} className="h-[14px] w-[14px]" />
                <Text variant="text-16-bold" className="capitalize text-blueCustom-900">
                  {!collapseMap ? "Collapse" : "Expand"}
                </Text>
              </div>
            </Button>
          </div>
          <div
            className={classNames("mt-2 flex h-full w-full overflow-hidden transition-all duration-500 ease-in-out", {
              "max-h-[62vh]": !collapseMap,
              "max-h-[27vh]": collapseMap
            })}
          >
            <div className="flex-1 overflow-auto">
              <Table
                columns={columnsActiveCountries}
                data={ACTIVE_COUNTRIES}
                variant={VARIANT_TABLE_DASHBOARD_COUNTRIES}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContentOverview;
