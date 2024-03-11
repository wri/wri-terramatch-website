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
      className={classNames(
        className,
        "flex items-center gap-2 rounded-lg border-2 border-2 border-transparent bg-white p-2 hover:border-primary",
        {
          "border-primary-500": isSelected,
          "border-neutral-500 hover:border-neutral-800": !isSelected
        }
      )}
    >
      <Icon name={IconNames.MAP_THUMBNAIL} className="h-11 w-11 rounded-lg bg-neutral-300" />
      <div className="flex flex-1 flex-col">
        <Text variant="text-14-bold" className="">
          {title}
        </Text>
        <Text variant="text-14-light">{subtitle}</Text>
      </div>
    </div>
  );
};

export default MapSidePanelItem;
