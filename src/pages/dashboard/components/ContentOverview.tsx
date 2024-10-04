import { ColumnDef, RowData } from "@tanstack/react-table";
import { useT } from "@transifex/react";
import React, { useState } from "react";

import Button from "@/components/elements/Button/Button";
import Table from "@/components/elements/Table/Table";
import { VARIANT_TABLE_DASHBOARD_COUNTRIES } from "@/components/elements/Table/TableVariants";
import Text from "@/components/elements/Text/Text";
import Icon from "@/components/extensive/Icon/Icon";
import { IconNames } from "@/components/extensive/Icon/Icon";
import PageCard from "@/components/extensive/PageElements/Card/PageCard";
import PageRow from "@/components/extensive/PageElements/Row/PageRow";

import {
  RESTORATION_STRATEGIES_REPRESENTED,
  TARGET_LAND_USE_TYPES_REPRESENTED,
  TOTAL_HECTARES_UNDER_RESTORATION,
  TOTAL_NUMBER_OF_SITES
} from "../mockedData/dashboard";
import SecDashboard from "./SecDashboard";
import TooltipGridMap from "./TooltipGridMap";

interface ContentOverviewProps<TData> {
  data: TData[];
  columns: ColumnDef<TData>[];
}

const ContentOverview = (props: ContentOverviewProps<RowData>) => {
  const { data, columns } = props;
  const [collapseMap, setCollapseMap] = useState(false);
  const t = useT();

  return (
    <div className="flex w-1/2">
      <PageRow className="gap-4 p-0">
        <div className="shadow-lg relative w-full">
          <img
            src="/images/map-img.png"
            alt="map"
            className={"h-full max-h-[48vh] w-full transition-all duration-500 ease-in-out"}
          />
          <TooltipGridMap label="Angola" learnMore={true} />

          <div className="absolute bottom-6 left-6 grid gap-2 rounded-lg bg-white px-4 py-2">
            <div className="flex gap-2">
              <Icon name={IconNames.IC_LEGEND_MAP} className="h-4.5 w-4.5 text-tertiary-800" />
              <Text variant="text-10" className="text-darkCustom">
                {t("Non-Profit Projects (32)")}
              </Text>
            </div>
            <div className="flex gap-2">
              <Icon name={IconNames.IC_LEGEND_MAP} className="h-4.5 w-4.5 text-blue-50" />
              <Text variant="text-10" className="text-darkCustom">
                {t("Enterprise Projects (457)")}
              </Text>
            </div>
          </div>
        </div>

        <PageCard
          className="border-0 px-4 py-6"
          classNameSubTitle="mt-4"
          gap={8}
          subtitleMore={true}
          title={t("HECTARES UNDER RESTORATION")}
          variantSubTitle="text-14-light"
          subtitle={t(
            `The numbers and reports below display data related to Indicator 2: Hectares Under Restoration described in <span class="underline">TerraFund’s MRV framework</span>. Please refer to the linked MRV framework for details on how these numbers are sourced and verified.`
          )}
        >
          <div className="grid w-3/4 auto-cols-max grid-flow-col gap-12 divide-x divide-grey-1000">
            <SecDashboard
              title={t("Total HECTARES UNDER RESTORATION")}
              data={TOTAL_HECTARES_UNDER_RESTORATION}
              classNameBody="w-full place-content-center !justify-center"
            />
            <SecDashboard
              title={t("TOTAL NUMBER OF SITES")}
              data={TOTAL_NUMBER_OF_SITES}
              className="pl-12"
              classNameBody="w-full place-content-center !justify-center"
            />
          </div>
          <SecDashboard title={t("Restoration Strategies Represented")} data={RESTORATION_STRATEGIES_REPRESENTED} />
          <SecDashboard title={t("TARGET LAND USE TYPES REPRESENTED")} data={TARGET_LAND_USE_TYPES_REPRESENTED} />
        </PageCard>

        <PageCard
          className="border-0 px-4 py-6"
          classNameSubTitle="mt-4"
          gap={8}
          subtitleMore={true}
          title={t("ACTIVE COUNTRIES")}
          headerChildren={
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
          }
        >
          <Table columns={columns} data={data} variant={VARIANT_TABLE_DASHBOARD_COUNTRIES} />
        </PageCard>
      </PageRow>
    </div>
  );
};

export default ContentOverview;
