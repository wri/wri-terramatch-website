import classNames from "classnames";
import clsx from "clsx";
import React from "react";
import { When } from "react-if";

import Menu, { MenuItemProps } from "@/components/elements/Menu/Menu";
import Text from "@/components/elements/Text/Text";
import Icon, { IconNames } from "@/components/extensive/Icon/Icon";

export interface UserRoleCardProps {
  title: string;
  description: string;
  selected: boolean;
  options?: MenuItemProps[];
  menu?: MenuItemProps[];
  titleOptions?: string;
  setSelectedOption?: any;
  refContentCard?: React.RefObject<HTMLDivElement>;
  selectedOption?: string;
  icon?: IconNames;
}

const UserRoleCard: React.FC<UserRoleCardProps> = ({
  title,
  description,
  selected,
  options,
  titleOptions,
  setSelectedOption,
  refContentCard,
  selectedOption,
  menu,
  icon
}) => {
  const MenuOption: MenuItemProps[] = options || [
    {
      id: "1",
      render: () => (
        <Text variant="text-12-bold" className="text-primary">
          Select Fund
        </Text>
      )
    }
  ];

  const displayOption = options?.find(m => {
    if (selectedOption === null) {
      return false;
    } else {
      if (title === "I’m a Government Official") {
        return m.country_slug === selectedOption;
      } else {
        return m.data.label === selectedOption;
      }
    }
  });
  const diplayTitle = displayOption ? displayOption.data.label : "";

  return (
    <article
      className={clsx("flex cursor-pointer items-center gap-2 rounded-lg border-2 p-3", {
        "border-primary": selected,
        "border-grey-350": !selected
      })}
    >
      <div className="rounded-lg border border-grey-350 p-2">
        <Icon name={icon ?? IconNames.USER_ROLE} className="h-10 w-10 lg:h-11 lg:w-11 wide:h-12 wide:w-12" />
      </div>
      <div className="flex flex-1 flex-col items-start gap-1">
        <Text variant="text-12-bold" className="text-darkCustom">
          {title}
        </Text>
        <Text variant="text-12-light" className="text-left leading-normal text-darkCustom-50">
          {description}
        </Text>
        <When condition={!!titleOptions}>
          <Menu
            menu={MenuOption}
            setSelectedOption={setSelectedOption}
            container={refContentCard?.current}
            classNameContentMenu="max-h-[273px]"
            selectedOption={selectedOption}
          >
            <Text variant="text-12-bold" className="text-primary">
              {titleOptions || "Select Fund"}
              {diplayTitle ? `: ${diplayTitle}` : ""}
            </Text>
          </Menu>
        </When>
      </div>
      <Icon
        name={selected ? IconNames.APPROVED_COLORLESS : IconNames.NO_SUCCESS}
        className={classNames(" h-5 w-5 self-start text-primary lg:h-6 lg:w-6 wide:h-7 wide:w-7")}
      />
    </article>
  );
};

export default UserRoleCard;
