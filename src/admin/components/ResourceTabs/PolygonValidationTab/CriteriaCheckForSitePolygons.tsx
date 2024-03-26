import React from "react";

import Menu from "@/components/elements/Menu/Menu";
import Text from "@/components/elements/Text/Text";
import Icon from "@/components/extensive/Icon/Icon";
import { IconNames } from "@/components/extensive/Icon/Icon";

export interface ICriteriaCheckItemProps {
  id: string;
  status: boolean;
  label: string;
}

export interface ICriteriaCheckProps {
  menu: ICriteriaCheckItemProps[];
}
const polygonMenuItems = [
  {
    id: "1",
    render: () => (
      <div className="flex items-center gap-2">
        <Icon name={IconNames.POLYGON} className="h-6 w-6" />
        <Text variant="text-14-bold">Edit Polygon</Text>
      </div>
    )
  },
  {
    id: "2",
    render: () => (
      <div className="flex items-center gap-2">
        <Icon name={IconNames.SEARCH_PA} className="h-6 w-6" />
        <Text variant="text-14-bold">Zoom to</Text>
      </div>
    )
  },
  {
    id: "3",
    render: () => (
      <div className="flex items-center gap-2">
        <Icon name={IconNames.TRASH_PA} className="h-6 w-6" />
        <Text variant="text-14-bold">Delete Polygom</Text>
      </div>
    )
  }
];

const CriteriaCheckForSitePolygons = (props: ICriteriaCheckProps) => {
  return (
    <div className="h-full rounded-lg border  border-grey-750 px-2 py-3">
      <div className="mb-4 flex items-center gap-1">
        <Text variant="text-14" className="px-2 text-grey-250">
          Criteria Check for Site Polygons
        </Text>
        <Icon name={IconNames.PLUS_CIRCLE} className="h-4 w-4" />
      </div>
      <div className="flex max-h-[120px] flex-col overflow-auto">
        {props.menu.map(item => (
          <Menu key={item.id} menu={polygonMenuItems}>
            <div className="flex items-center justify-between px-2 py-2 hover:cursor-pointer hover:bg-primary-200">
              <div className="flex items-center gap-2">
                <Icon name={item.status ? IconNames.ROUND_GREEN_TICK : IconNames.ROUND_RED_CROSS} className="h-4 w-4" />
                <Text variant="text-14-light">{item.label}</Text>
              </div>
              <Icon name={IconNames.ELIPSES} className="h-4 w-4" />
            </div>
          </Menu>
        ))}
      </div>
    </div>
  );
};

export default CriteriaCheckForSitePolygons;
