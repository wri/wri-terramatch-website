import classNames from "classnames";
import { ElementType, FC, HTMLProps, useMemo } from "react";
import { When } from "react-if";

import Icon, { IconProps } from "@/components/extensive/Icon/Icon";

/** Button can either be, a Button, a Next Link or Anchor element */
export interface IButtonProps extends Omit<HTMLProps<HTMLElement>, "as"> {
  as?: ElementType;
  iconProps?: IconProps;
  variant?: "primary" | "secondary" | "text" | "link" | "white" | "sky";
  fullWidth?: boolean;
  shallow?: boolean;
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
    const nonTextSpanClasses = "flex items-center text-bold-caption-200";
    const newText =
      "flex items-center font-inter font-bold text-16 leading-snug tracking-tighter uppercase text-primary";

    switch (variant) {
      case "primary":
        return {
          container: classNames("h-fit bg-primary-500 hover:bg-primary-400 py-2  text-white", nonTextClasses),
          span: nonTextSpanClasses
        };

      case "secondary":
        return {
          container: classNames(
            "bg-white border border-neutral-1000 hover:border-primary-500 disabled:border-neutral-1000 py-1.75",
            nonTextClasses
          ),
          span: nonTextSpanClasses
        };
      case "white":
        return {
          container: classNames("h-fit bg-white py-4 rounded-lg"),
          span: newText
        };
      case "sky":
        return {
          container: classNames("h-fit py-4 bg-primary-200 rounded-lg"),
          span: newText
        };
      case "text":
        return { container: "", span: "text-bold-body-300" };

      case "link":
        return { container: "", span: "text-light-body-300 uppercase underline" };

      default:
        return { container: "", span: "" };
    }
  }, [variant]);

  return (
    <Component
      {...rest}
      disabled={disabled}
      className={classNames(
        className,
        variantClasses.container,
        "flex items-center justify-center gap-1.5 tracking-wide",
        fullWidth ? "w-full justify-center" : "w-fit-content"
      )}
    >
      <When condition={!!iconProps}>
        <Icon width={14} {...iconProps!} />
      </When>
      <span className={variantClasses.span}>{children}</span>
    </Component>
  );
};

export default Button;
