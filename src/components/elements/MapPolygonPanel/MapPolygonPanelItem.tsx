import classNames from "classnames";
import { DetailedHTMLProps, Dispatch, HTMLAttributes, SetStateAction } from "react";

import Text from "@/components/elements/Text/Text";
import Icon, { IconNames } from "@/components/extensive/Icon/Icon";

import Menu from "../Menu/Menu";
import { MENU_PLACEMENT_RIGHT_BOTTOM } from "../Menu/MenuVariant";

export interface MapPolygonPanelItemProps extends DetailedHTMLProps<HTMLAttributes<HTMLDivElement>, HTMLDivElement> {
  uuid: string;
  title: string;
  subtitle: string;
  isSelected?: boolean;
  refContainer?: React.RefObject<HTMLDivElement> | null;
  setEditPolygon?: Dispatch<SetStateAction<boolean>>;
}

const MapPolygonPanelItem = ({
  title,
  subtitle,
  isSelected,
  className,
  refContainer,
  setEditPolygon,
  ...props
}: MapPolygonPanelItemProps) => {
  const itemsPrimaryMenu = [
    {
      id: "1",
      render: () => (
        <Text variant="text-14-semibold" className="flex items-center">
          <Icon name={IconNames.IC_SITE_VIEW} className="h-4 w-4 lg:h-5 lg:w-5" />
          &nbsp; Edit Polygon
        </Text>
      ),
      onClick: () => {
        if (setEditPolygon) {
          setEditPolygon(true);
        }
      }
    },
    {
      id: "2",
      render: () => (
        <Text variant="text-14-semibold" className="flex items-center">
          <Icon name={IconNames.SEARCH} className="h-4 w-4 lg:h-5 lg:w-5" />
          &nbsp; Zoom to
        </Text>
      )
    },
    {
      id: "3",
      render: () => (
        <Text variant="text-14-semibold" className="flex items-center">
          <Icon name={IconNames.IC_DOWNLOAD_MENU} className="h-4 w-4 lg:h-5 lg:w-5" />
          &nbsp; Download
        </Text>
      )
    },
    {
      id: "4",
      render: () => (
        <Text variant="text-14-semibold" className="flex items-center">
          <Icon name={IconNames.COMMENT} className="h-5 w-4 lg:h-6 lg:w-6 " />
          &nbsp; Comment
        </Text>
      )
    },
    {
      id: "5",
      render: () => (
        <Text variant="text-14-semibold" className="flex items-center">
          <Icon name={IconNames.REQUEST} className="h-5 w-4 lg:h-6 lg:w-6 " />
          &nbsp; Request Support
        </Text>
      )
    },
    {
      id: "6",
      render: () => (
        <Text variant="text-14-semibold" className="flex items-center">
          <Icon name={IconNames.TRASH_PA} className="h-5 w-4 lg:h-6 lg:w-6 " />
          &nbsp; Delete Polygon
        </Text>
      )
    }
  ];

  return (
    <div>
      <div
        {...props}
        className={classNames(className, " rounded-lg border-2 border-transparent bg-white p-2 hover:border-primary", {
          "border-primary-500": isSelected,
          "border-neutral-500 hover:border-neutral-800": !isSelected
        })}
      >
        <div className="flex items-center gap-2">
          <Icon name={IconNames.MAP_THUMBNAIL} className="h-11 w-11 rounded-lg bg-neutral-300" />
          <div className="flex flex-1 flex-col">
            <Text variant="text-14-bold" className="">
              {title}
            </Text>
            <Text variant="text-14-light">{subtitle}</Text>
          </div>
          <div className="lex h-full self-start">
            <Menu container={refContainer?.current} placement={MENU_PLACEMENT_RIGHT_BOTTOM} menu={itemsPrimaryMenu}>
              <Icon
                name={IconNames.IC_MORE_OUTLINED}
                className="h-4 w-4 rounded-lg hover:fill-primary hover:text-primary lg:h-5 lg:w-5"
              />
            </Menu>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MapPolygonPanelItem;
