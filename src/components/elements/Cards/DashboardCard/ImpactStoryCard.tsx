import { useT } from "@transifex/react";
import React from "react";

import Text from "@/components/elements/Text/Text";
import Icon, { IconNames } from "@/components/extensive/Icon/Icon";
export interface ImpactStoryCardProps {
  key?: string;
  date: string;
  by: string;
  title: string;
  description: string;
  image: string;
}
const ImpactStoryCard = (porps: ImpactStoryCardProps) => {
  const { key, date, by, title, description, image } = porps;
  const t = useT();

  return (
    <div
      className="flex cursor-pointer items-center gap-4 overflow-hidden rounded-lg border border-neutral-200 bg-white p-4 hover:bg-grey-200"
      key={key}
    >
      <img src={image} alt="profile" className="h-20 w-20 rounded-lg bg-cover" />
      <div className="flex-flex-col flex-1 gap-2 overflow-hidden">
        <div className="flex items-center gap-1">
          <Text variant="text-14-light" className="whitespace-nowrap text-grey-700">
            {t(`${date} by ${by}`)}
          </Text>
          <Icon name={IconNames.PIN} className="w-3" />
        </div>
        <Text variant="text-14-bold" className="overflow-hidden text-ellipsis whitespace-nowrap text-darkCustom">
          {t(title)}
        </Text>
        <Text variant="text-14-light" className="overflow-hidden text-ellipsis whitespace-nowrap text-grey-700">
          {t(description)}
        </Text>
      </div>
    </div>
  );
};

export default ImpactStoryCard;
