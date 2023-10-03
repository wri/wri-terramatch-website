import classNames from "classnames";
import { ElementType, FC, HTMLProps, useMemo } from "react";
import { When } from "react-if";

import Icon, { IconProps } from "@/components/extensive/Icon/Icon";

/** Button can either be, a Button, a Next Link or Anchor element */
export interface IButtonProps extends Omit<HTMLProps<HTMLElement>, "as"> {
  as?: ElementType;
  iconProps?: IconProps;
  variant?: "primary" | "secondary" | "text";
  fullWidth?: boolean;
}

const Button: FC<IButtonProps> = props => {
  const { as: As, variant = "primary", iconProps, children, disabled, className, fullWidth, ...rest } = props;

  const Component = useMemo(() => {
    if (disabled) {
      // Force to button for accessibility purposes.
      // as we don't know if the "As" component will properly
      // support the disabled prop.
      return "button";
    }

    return As || "button";
  }, [As, disabled]);

  const variantClasses = useMemo(() => {
    const nonTextClasses =
      "rounded-md px-10 uppercase disabled:bg-neutral-300 disabled:text-neutral-800 transition whitespace-nowrap text-black h-8";
    switch (variant) {
      case "primary":
        return classNames("bg-primary-500 hover:bg-primary-400 py-2", nonTextClasses);

      case "secondary":
        return classNames(
          "bg-white border border-neutral-1000 hover:border-primary-500 disabled:border-neutral-1000 py-1.75",
          nonTextClasses
        );

      case "text":
        return "";

      default:
        return "";
    }
  }, [variant]);

  return (
    <Component
      {...rest}
      disabled={disabled}
      className={classNames(
        className,
        variantClasses,
        "flex items-center justify-center gap-1.5 tracking-wide",
        fullWidth ? "w-full justify-center" : "w-fit-content"
      )}
    >
      <When condition={!!iconProps}>
        <Icon width={14} {...iconProps!} />
      </When>
      <span
        className={classNames(variant === "text" ? "text-bold-body-300" : "text-bold-caption-200 pt-0.75 leading-3")}
      >
        {children}
      </span>
    </Component>
  );
};

export default Button;
