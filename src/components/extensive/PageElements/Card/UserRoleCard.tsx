import clsx from "clsx";
import React from "react";
import { When } from "react-if";

import Menu, { MenuItemProps } from "@/components/elements/Menu/Menu";
import Text from "@/components/elements/Text/Text";
import Icon, { IconNames } from "@/components/extensive/Icon/Icon";

interface UserRoleCardProps {
  title: string;
  description: string;
  selected: boolean;
  options?: MenuItemProps[];
  titleOptions?: string;
}

const UserRoleCard: React.FC<UserRoleCardProps> = ({ title, description, selected, options, titleOptions }) => {
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

  return (
    <article
      className={clsx("flex cursor-pointer items-center gap-2 rounded-lg border-2 p-3", {
        "border-blue-300": selected,
        "border-grey-300": !selected
      })}
    >
      <div className="rounded-lg border border-grey-300 p-2">
        <Icon name={IconNames.USER_ROLE} className="h-10 w-10 lg:h-11 lg:w-11 wide:h-12 wide:w-12" />
      </div>
      <div className="flex flex-1 flex-col items-start gap-1">
        <Text variant="text-12-bold" className="text-dark-500">
          {title}
        </Text>
        <Text variant="text-12-light" className="text-dark-300 text-left leading-normal">
          {description}
        </Text>
        <When condition={!!titleOptions}>
          <Menu menu={MenuOption}>
            <Text variant="text-12-bold" className="text-primary">
              {titleOptions || "Select Fund"}
            </Text>
          </Menu>
        </When>
      </div>
      <Icon
        name={selected ? IconNames.SUCCESS : IconNames.NO_SUCCESS}
        className="h-6 w-6 self-start lg:h-7 lg:w-7 wide:h-8 wide:w-8"
      />
    </article>
  );
};

export default UserRoleCard;
