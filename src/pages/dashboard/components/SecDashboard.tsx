import { useT } from "@transifex/react";
import classNames from "classnames";
import { useEffect, useState } from "react";
import { When } from "react-if";

import Table from "@/components/elements/Table/Table";
import { VARIANT_TABLE_SITE_POLYGON_REVIEW } from "@/components/elements/Table/TableVariants";
import Text from "@/components/elements/Text/Text";
import Toggle from "@/components/elements/Toggle/Toggle";
import { VARIANT_TOGGLE_DASHBOARD } from "@/components/elements/Toggle/ToggleVariants";
import ToolTip from "@/components/elements/Tooltip/Tooltip";
import Icon, { IconNames } from "@/components/extensive/Icon/Icon";
import { TextVariants } from "@/types/common";

import { DashboardDataProps } from "../index.page";
import GraphicDashboard from "./GraphicDashboard";
import GraphicIconDashoard from "./GraphicIconDashoard";
import ObjectiveSec from "./ObjetiveSec";
import TooltipGraphicDashboard from "./TooltipGraphicDashboard";
import ValueNumberDashboard from "./ValueNumberDashboard";

const SecDashboard = ({
  title,
  type,
  secondOptionsData,
  className,
  classNameBody,
  classNameHeader,
  classNameTitle,
  tooltipGraphic = false,
  variantTitle,
  data
}: {
  title: string;
  type?: "legend" | "toggle";
  secondOptionsData?: any;
  className?: string;
  classNameBody?: string;
  classNameHeader?: string;
  classNameTitle?: string;
  tooltipGraphic?: boolean;
  variantTitle?: TextVariants;
  data: DashboardDataProps;
}) => {
  const [toggleValue, setToggleValue] = useState(0);
  const t = useT();

  const tableColumns = [
    {
      header: "Specie",
      accessorKey: "label"
    },
    {
      header: "Count",
      accessorKey: "valueText"
    }
  ];

  useEffect(() => {
    if (data?.tableData) {
      setToggleValue(1);
    }
  }, []);

  return (
    <div className={className}>
      <div className={classNames("flex items-center justify-between", classNameHeader)}>
        <div className="flex items-center gap-1">
          <Text variant={variantTitle || "text-14"} className={classNames("uppercase text-darkCustom", classNameTitle)}>
            {t(title)}
          </Text>
          <ToolTip content={t(title)} placement="top" width="w-44">
            <Icon name={IconNames.IC_INFO} className="h-3.5 w-3.5 text-darkCustom lg:h-5 lg:w-5" />
          </ToolTip>
        </div>
        <When condition={type === "legend"}>
          <div className="flex gap-4">
            {secondOptionsData &&
              secondOptionsData.map((item: any, index: number) => (
                <div key={index} className="flex items-center gap-1">
                  <div className={classNames("h-2 w-2 rounded-full", item.color)} />
                  <Text variant="text-10" className="text-darkCustom">
                    {t(item.label)}
                  </Text>
                </div>
              ))}
          </div>
        </When>
        <When condition={type === "toggle"}>
          <Toggle
            items={secondOptionsData}
            activeIndex={toggleValue}
            setActiveIndex={() => {
              setToggleValue(toggleValue === 0 ? 1 : 0);
            }}
            variant={VARIANT_TOGGLE_DASHBOARD}
          />
        </When>
      </div>
      <div className={classNames("relative mt-3 flex items-center justify-between", classNameBody)}>
        {data?.value && <ValueNumberDashboard value={data.value} unit={data.unit} />}
        <When condition={data?.value && data?.unit}>
          <img src="/images/img-tree.png" alt="secondValue" className="h-9" />
        </When>
        <When condition={tooltipGraphic}>
          <TooltipGraphicDashboard />
        </When>
        <When condition={data?.graphic}>
          <img src={data?.graphic} alt={data?.graphic} className="w-full" />
          <div>
            <When condition={!!data?.graphicLegend}>
              <div className="flex gap-3">
                {data?.graphicLegend?.map((item, index) => (
                  <div key={index} className="flex items-baseline gap-1">
                    <div className={classNames("h-2 w-2 rounded-full lg:h-3 lg:w-3", item.color)} />
                    <div>
                      <Text variant="text-12-light" className="text-darkCustom">
                        {t(item.label)}
                      </Text>
                      <Text variant="text-12-light" className="text-darkCustom opacity-60">
                        {t(item.value)}
                      </Text>
                    </div>
                  </div>
                ))}
              </div>
            </When>
          </div>
        </When>
        <When condition={!!data?.tableData}>
          <When condition={toggleValue === 1}>
            {data?.tableData && <GraphicDashboard data={data?.tableData} maxValue={data.maxValue ?? 0} />}
          </When>
          <When condition={toggleValue === 0}>
            <div className="w-full">
              {data && (
                <Table
                  data={data?.tableData ?? []}
                  hasPagination={false}
                  columns={tableColumns}
                  variant={VARIANT_TABLE_SITE_POLYGON_REVIEW}
                />
              )}
            </div>
          </When>
        </When>
        <When condition={!!data?.graphicTargetLandUseTypes}>
          <GraphicIconDashoard data={data?.graphicTargetLandUseTypes ?? []} />
        </When>
        <ObjectiveSec data={data} />
      </div>
    </div>
  );
};

export default SecDashboard;
