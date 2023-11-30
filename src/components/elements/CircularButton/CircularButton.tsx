import cn from "classnames";
import React, { HTMLProps } from "react";
import Icon, { IconNames } from "src/components/extensive/Icon/Icon";

import { ColorCodes, Colors } from "@/types/common";

export interface CircularButtonProps extends HTMLProps<HTMLButtonElement> {
  iconName: IconNames;
  iconClassName: string;
  color?: Colors;
  colorCode?: ColorCodes;
}

const CircularButton = ({
  type = "button",
  color = "white",
  colorCode,
  iconName,
  iconClassName,
  className,
  ...rest
}: CircularButtonProps) => {
  let colorCn = `bg-${color}`;
  if (colorCode && colorCode !== "none") colorCn += `-${colorCode}`;

  const classNames = cn(colorCn, "rounded-[50%] h-12 w-12 flex items-center justify-center shadow", className);

  return (
    <button {...rest} className={classNames}>
      <Icon name={iconName} width={22} className={iconClassName} />
    </button>
  );
};

export default CircularButton;
