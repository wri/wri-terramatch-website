import classNames from "classnames";
import { ButtonHTMLAttributes, DetailedHTMLProps, ElementType, useMemo } from "react";

import Icon, { IconProps } from "@/components/extensive/Icon/Icon";

export interface IconButtonProps extends DetailedHTMLProps<ButtonHTMLAttributes<HTMLButtonElement>, HTMLButtonElement> {
  as?: ElementType;
  iconProps: IconProps;
}

const IconButton = ({ as: As, iconProps, className, ...buttonProps }: IconButtonProps) => {
  const Component = useMemo(() => {
    if (buttonProps.disabled) {
      // Force to button for accessibility purposes.
      // as we don't know if the "As" component will properly
      // support the disabled prop.
      return "button";
    }

    return As || "button";
  }, [As, buttonProps.disabled]);

  return (
    <Component
      {...buttonProps}
      className={classNames("flex items-center justify-center rounded-full hover:bg-opacity-60", className)}
    >
      <Icon {...iconProps} />
    </Component>
  );
};

export default IconButton;
