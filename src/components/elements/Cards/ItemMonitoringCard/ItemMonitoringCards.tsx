import { useT } from "@transifex/react";
import { DetailedHTMLProps, HTMLAttributes, PropsWithChildren, ReactNode } from "react";
import { When } from "react-if";

import Button from "@/components/elements/Button/Button";
import Paper from "@/components/elements/Paper/Paper";
import Text from "@/components/elements/Text/Text";
import ToolTip from "@/components/elements/Tooltip/Tooltip";

import Icon, { IconNames } from "../../../extensive/Icon/Icon";

export interface LegendItemMonitoringCardsProps {
  title: string;
  color: string;
}
export interface ItemMonitoringCardsProps
  extends DetailedHTMLProps<HTMLAttributes<HTMLDivElement>, HTMLDivElement>,
    PropsWithChildren {
  title?: string;
  value?: string;
  headerChildren?: ReactNode;
  isEmpty?: boolean;
  gap?: 4 | 8;
  tooltip?: string;
  item?: any;
  key?: number;
  className?: string;
  img?: IconNames;
  type?: "graph" | "map" | "graph-button";
  legends?: LegendItemMonitoringCardsProps[];
}

const ItemMonitoringCards = ({
  title,
  value,
  children,
  headerChildren,
  isEmpty,
  gap = 8,
  tooltip,
  className,
  type,
  img,
  item,
  legends,
  key,
  ref,
  ...props
}: ItemMonitoringCardsProps) => {
  const t = useT();
  return (
    <Paper {...props} key={item?.uuid | 1} className={`${className} ${type === "map" ? "bg-mapsImg bg-cover" : ""}`}>
      <div className="m-[-18px] mr-[-27px]">
        <div className="flex justify-between">
          <When condition={!!title && title}>
            <Text
              variant="text-14"
              className={`flex items-center tracking-[-0.154px] ${
                type === "graph" ? "w-full justify-center" : type === "graph-button" ? "pl-[7.2%]" : ""
              }`}
            >
              {title}&nbsp;
              <ToolTip content={tooltip} placement="top" width="w-56" title={title}>
                <Icon name={IconNames.IC_INFO} className="h-3 w-3 text-blueCustom-600 lg:h-4 lg:w-4" />
              </ToolTip>
            </Text>
          </When>
          <When condition={!!type && type === "graph-button"}>
            <div className="flex rounded-lg bg-neutral-100 p-1">
              <Button variant="group" className="text-blueCustom-600">
                {t("Week")}
              </Button>
              <Button variant="group-active" className="text-blueCustom-600">
                {t("Month")}
              </Button>
              <Button variant="group" className="text-blueCustom-600">
                {t("Year")}
              </Button>
            </div>
          </When>
          <When condition={!!type && type === "map"}>
            <div />
            <button type="button" className="mr-1 rounded-lg bg-white p-1 text-darkCustom-100 hover:text-primary">
              <Icon name={IconNames.IC_EARTH_MAP} className="h-5 w-5 lg:h-6 lg:w-6" />
            </button>
          </When>
        </div>

        <When condition={!!value}>
          <Text variant="text-24">{value}</Text>
        </When>
        <When condition={!!img}>
          <div className="relative">
            <When condition={!!type && type === "graph-button"}>
              <div className="absolute top-[40%] left-[40%] flex flex-col rounded-lg bg-white p-1 shadow">
                <div className="flex items-center gap-1">
                  <div className="h-[10px] w-[10px] rounded-full bg-primary" />
                  <Text variant="text-12-light" className="text-grey-700">
                    2024
                  </Text>
                </div>
                <Text variant="text-14-bold" className="text-primary">
                  43%
                </Text>
              </div>
            </When>
            <Icon
              name={img || IconNames.GRAPH1}
              className={`${type === "graph-button" ? "mt-2 h-[44vh]" : "h-[16vh]"} mt-2 w-full`}
            />
          </div>
        </When>
        <When condition={!!legends}>
          <div className="mt-2 flex flex-wrap justify-center gap-x-2">
            {legends?.map((legend: any, index: number) => (
              <Text as="span" key={index} variant="text-8" className="flex items-center whitespace-nowrap">
                <div className={`h-1 w-1 lg:h-2 lg:w-2 ${legend.color} rounded-full`} />
                &nbsp;
                {legend.title}
              </Text>
            ))}
          </div>
        </When>
      </div>
    </Paper>
  );
};

export default ItemMonitoringCards;
