import { DetailedHTMLProps, HTMLAttributes, PropsWithChildren, ReactNode } from "react";
import { When } from "react-if";

import Paper from "@/components/elements/Paper/Paper";
import Text from "@/components/elements/Text/Text";

import Icon, { IconNames } from "../../Icon/Icon";
export interface ItemMonitoringCardsProps
  extends DetailedHTMLProps<HTMLAttributes<HTMLDivElement>, HTMLDivElement>,
    PropsWithChildren {
  title?: string;
  subtitle?: string;
  headerChildren?: ReactNode;
  isEmpty?: boolean;
  gap?: 4 | 8;
  tooltip?: string;
  item: any;
  key: number;
}

const ItemMonitoringCards = ({
  title,
  subtitle,
  children,
  headerChildren,
  isEmpty,
  gap = 8,
  tooltip,
  item,
  key,
  ...props
}: ItemMonitoringCardsProps) => {
  const NumberColSpan = (index: string) => {
    const colSpan = "col-span-3";
    switch (index) {
      case "1":
        return "col-span-4";
      case "6":
        return "col-span-4";
      case "7":
        return "col-span-4";
      case "8":
        return "col-span-9 row-span-2";
      case "9":
        return "col-span-4";
      case "10":
        return "col-span-4";
      case "11":
        return "col-span-4";
      default:
        return colSpan;
    }
  };

  return (
    <Paper {...props} key={item.uuid} className={`${NumberColSpan(item.uuid)}`}>
      <div className="m-[-18px]">
        <Text
          variant="text-14"
          className={`flex items-center tracking-[-0.154px] ${item.titleColor} ${
            item.type === "graph" ? "justify-center" : ""
          }`}
        >
          {item.title}&nbsp;
          <Icon name={IconNames.IC_INFO} className="h-3 w-3 lg:h-4 lg:w-4" />
        </Text>
        <When condition={!!item.value}>
          <Text variant="text-24">{item.value}</Text>
        </When>
        <When condition={!!item.img}>
          <Icon
            name={item.img || IconNames.GRAPH1}
            className={`${item.uuid === "8" ? "h-[44vh]" : "h-[16vh]"} w-full`}
          />
        </When>
        <When condition={!!item.leyends}>
          <div className="flex justify-center gap-2">
            {item.leyends &&
              item.leyends.map((leyend: any, index: number) => (
                <div key={index} className="flex items-center">
                  <div className={`h-1 w-1 lg:h-2 lg:w-2 ${leyend.color} rounded-full`} />
                  &nbsp;
                  <Text variant="text-8" className="inline whitespace-nowrap">
                    {leyend.title}
                  </Text>
                </div>
              ))}
          </div>
        </When>
      </div>
    </Paper>
  );
};

export default ItemMonitoringCards;
