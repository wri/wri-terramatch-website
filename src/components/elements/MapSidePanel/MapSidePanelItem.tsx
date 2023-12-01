import classNames from "classnames";
import { DetailedHTMLProps, HTMLAttributes } from "react";

import Text from "@/components/elements/Text/Text";
import Icon, { IconNames } from "@/components/extensive/Icon/Icon";

export interface MapSidePanelItemProps extends DetailedHTMLProps<HTMLAttributes<HTMLDivElement>, HTMLDivElement> {
  uuid: string;
  title: string;
  subtitle: string;
  isSelected?: boolean;
}

const MapSidePanelItem = ({ title, subtitle, isSelected, className, ...props }: MapSidePanelItemProps) => {
  return (
    <div
      {...props}
      className={classNames(className, "flex items-center gap-6 rounded-lg border-2 p-3", {
        "border-primary-500": isSelected,
        "border-neutral-100 hover:border-neutral-800": !isSelected
      })}
    >
      <Icon name={IconNames.MAP_THUMBNAIL} className="h-11 w-11 rounded-lg bg-neutral-300" />
      <div className="flex flex-1 flex-col">
        <Text variant="text-bold-caption-200" className="line-clamp-3">
          {title}
        </Text>
        <Text variant="text-light-caption-200">{subtitle}</Text>
      </div>
    </div>
  );
};

export default MapSidePanelItem;
