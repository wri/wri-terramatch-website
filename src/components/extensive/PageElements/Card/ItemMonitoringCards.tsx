import { useT } from "@transifex/react";
import { DetailedHTMLProps, HTMLAttributes, PropsWithChildren, ReactNode } from "react";
import { When } from "react-if";

import Button from "@/components/elements/Button/Button";
import Paper from "@/components/elements/Paper/Paper";
import Text from "@/components/elements/Text/Text";

import Icon, { IconNames } from "../../Icon/Icon";

export interface LeyendItemMonitoringCardsProps {
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
  leyends?: LeyendItemMonitoringCardsProps[];
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
  leyends,
  key,
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
              <Icon name={IconNames.IC_INFO} className="h-3 w-3 text-blueCustom-600 lg:h-4 lg:w-4" />
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
          <Icon
            name={img || IconNames.GRAPH1}
            className={`${type === "graph-button" ? "mt-2 h-[44vh]" : "h-[16vh]"} mt-2 w-full`}
          />
        </When>
        <When condition={!!leyends}>
          <div className="mt-2 flex flex-wrap justify-center gap-x-2">
            {leyends &&
              leyends.map((leyend: any, index: number) => (
                <Text as="span" key={index} variant="text-8" className="flex items-center whitespace-nowrap">
                  <div className={`h-1 w-1 lg:h-2 lg:w-2 ${leyend.color} rounded-full`} />
                  &nbsp;
                  {leyend.title}
                </Text>
              ))}
          </div>
        </When>
      </div>
    </Paper>
  );
};

export default ItemMonitoringCards;
