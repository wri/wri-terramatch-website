import clsx from "clsx";
import React from "react";

import Icon from "@/components/componentsToLogin/Icon/Icon";
import { ICON_VARIANT_AVATAR, ICON_VARIANT_SUCCESS } from "@/components/componentsToLogin/Icon/IconVariant";
import Text from "@/components/elements/Text/Text";

interface UserRoleCardProps {
  title: string;
  description: string;
  selected: boolean;
}

const UserRoleCard: React.FC<UserRoleCardProps> = ({ title, description, selected }) => {
  return (
    <article
      className={clsx("flex cursor-pointer items-center gap-2 rounded-lg border-2 p-3", {
        "border-blue-300": selected,
        "border-grey-300": !selected
      })}
    >
      <div className="rounded-lg border border-grey-300 p-2">
        <Icon variant={ICON_VARIANT_AVATAR} src={"/icons/ic-user.svg"} alt={"success status"} />
      </div>
      <div className="flex flex-1 flex-col items-start gap-1">
        <Text variant="text-12-bold" className="text-dark-500">
          {title}
        </Text>
        <Text variant="text-12-light" className="text-left leading-normal text-dark-300">
          {description}
        </Text>
      </div>
      <Icon
        variant={ICON_VARIANT_SUCCESS}
        src={`${selected ? "/icons/ic-success.svg" : "/icons/ic-no-success.svg"}`}
        alt={"success status"}
        className="self-start"
      />
    </article>
  );
};

export default UserRoleCard;
