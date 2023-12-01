import classNames from "classnames";
import { FC, HTMLAttributes } from "react";

import Text from "@/components/elements/Text/Text";
import Icon, { IconNames, IconProps } from "@/components/extensive/Icon/Icon";

export interface ConfirmationProps extends HTMLAttributes<HTMLDivElement> {
  icon: IconNames;
  iconProps?: Omit<IconProps, "name">;
  title: string;
}

const Confirmation: FC<ConfirmationProps> = ({ className, children, icon, title, iconProps, ...rest }) => {
  return (
    <div
      className={classNames(
        `flex w-full flex-col items-center gap-2 rounded-lg border-2 border-neutral-100 bg-white p-14`,
        className
      )}
      {...rest}
    >
      <Icon name={icon} width={50} {...iconProps} />
      <Text variant="text-bold-headline-1000" className="mt-6 uppercase">
        {title}
      </Text>
      {children}
    </div>
  );
};

export default Confirmation;
