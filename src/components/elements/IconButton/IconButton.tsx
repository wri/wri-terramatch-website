import classNames from "classnames";
import { ButtonHTMLAttributes, DetailedHTMLProps } from "react";

import Icon, { IconProps } from "@/components/extensive/Icon/Icon";

export interface IconButtonProps extends DetailedHTMLProps<ButtonHTMLAttributes<HTMLButtonElement>, HTMLButtonElement> {
  iconProps: IconProps;
}

const IconButton = ({ iconProps, className, ...buttonProps }: IconButtonProps) => {
  return (
    <button
      {...buttonProps}
      className={classNames("flex items-center justify-center rounded-full hover:bg-opacity-60", className)}
    >
      <Icon {...iconProps} />
    </button>
  );
};

export default IconButton;
