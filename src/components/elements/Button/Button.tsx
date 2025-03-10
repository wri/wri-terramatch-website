import classNames from "classnames";
import { ElementType, FC, HTMLProps, useMemo } from "react";
import { When } from "react-if";
import { twMerge as tw } from "tailwind-merge";

import Icon, { IconProps } from "@/components/extensive/Icon/Icon";
import { withFrameworkShow } from "@/context/framework.provider";

/** Button can either be, a Button, a Next Link or Anchor element */
export interface IButtonProps extends Omit<HTMLProps<HTMLElement>, "as"> {
  as?: ElementType;
  iconProps?: IconProps;
  variant?:
    | "primary"
    | "secondary"
    | "text"
    | "link"
    | "white"
    | "sky"
    | "group"
    | "group-active"
    | "group-polygon"
    | "group-active-polygon"
    | "semi-black"
    | "semi-red"
    | "secondary-blue"
    | "sky-page-admin"
    | "white-page-admin"
    | "white-toggle"
    | "white-border"
    | "orange"
    | "about-us"
    | "transparent-toggle"
    | "purple"
    | "white-button-map";
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
      "rounded-md px-4 uppercase disabled:bg-neutral-300 disabled:text-neutral-800 transition whitespace-nowrap text-black min-h-10";
    const nonTextSpanClasses = "flex items-center text-bold-caption-200 !leading-[normal]";
    const newText =
      "flex items-center font-inter font-bold text-16 leading-snug tracking-tighter uppercase text-primary !leading-[normal]";

    switch (variant) {
      case "primary":
        return {
          container: classNames("bg-primary-500 hover:bg-primary-400 py-2 !text-white", nonTextClasses),
          span: nonTextSpanClasses
        };

      case "secondary":
        return {
          container: classNames(
            "bg-white border border-neutral-1000 hover:border-primary-500 disabled:border-neutral-1000 px-4 py-[10.5px]",
            nonTextClasses
          ),
          span: nonTextSpanClasses
        };
      case "white-border":
        return {
          container: classNames(
            "bg-white border border-neutral-200 hover:bg-neutral-200 py-2 !text-darkCustom-100",
            nonTextClasses
          ),
          span: nonTextSpanClasses
        };
      case "secondary-blue":
        return {
          container:
            "group bg-white border border-primary-500 uppercase leading-[normal] px-4 py-[10.5px] rounded-lg hover:bg-grey-900 disabled:border-transparent disabled:bg-grey-750",
          span: "text-primary-500 text-12-bold group-disabled:text-grey-730 !leading-[normal]"
        };
      case "white":
        return {
          container: classNames("h-fit bg-white py-4 rounded-lg"),
          span: newText
        };
      case "white-page-admin":
        return {
          container: "py-2 px-3 bg-white rounded-lg text-darkCustom-100 border border-grey-750 hover:bg-grey-900",
          span: "flex items-center text-bold-caption-200 text-inherit uppercase !leading-[normal]"
        };
      case "sky":
        return {
          container: classNames("h-fit py-4 bg-primary-200 rounded-lg"),
          span: newText
        };
      case "sky-page-admin":
        return {
          container:
            "group py-2 px-3 bg-primary-200 rounded-lg text-darkCustom-100 border border-grey-750 hover:text-primary-500",
          span: "flex items-center text-bold-caption-200 text-inherit uppercase !leading-[normal]"
        };
      case "text":
        return { container: "", span: "text-12-bold" };

      case "link":
        return { container: "", span: "text-light-body-300 uppercase underline" };

      case "group":
        return { container: "", span: "text-14-light px-3 py-1 opacity-60 rounded-lg" };

      case "group-active":
        return { container: "", span: "text-14-semibold px-3 py-1 bg-white rounded-lg" };
      case "group-polygon":
        return { container: "", span: "text-14-light px-3 py-1 opacity-60 rounded-lg" };

      case "group-active-polygon":
        return { container: "bg-white rounded-lg", span: "text-14-semibold px-3 py-1 bg-white rounded-lg" };

      case "semi-black":
        return {
          container:
            "group bg-white border-[3px] border-grey-500 hover:border-primary-500 disabled:border-neutral-1000 px-4 py-2 rounded-lg",
          span: "uppercase text-14-bold text-grey-500 group-hover:text-primary-500 !leading-[normal]"
        };

      case "orange":
        return {
          container:
            "group bg-tertiary-600 py-1.5 px-5 rounded-lg hover:opacity-90 disabled:bg-tertiary-600 disabled:opacity-70",
          span: "normal-case text-10-bold text-white h-min !leading-[normal]"
        };

      case "semi-red":
        return {
          container:
            "group bg-white border-[3px] border-error hover:border-primary-500 disabled:border-neutral-1000 px-4 py-2 rounded-lg",
          span: "uppercase text-error text-14-bold group-hover:text-primary-500 leading-150"
        };
      case "white-toggle":
        return {
          container: "group bg-white py-1 px-3 rounded",
          span: "text-14-semibold text-darkCustom !leading-[normal]"
        };
      case "transparent-toggle":
        return {
          container: "group bg-transparent px-3 py-1 rounded",
          span: "text-14-light text-darkCustom-100 !leading-[normal]"
        };
      case "white-button-map":
        return {
          container: "h-fit rounded-lg bg-white px-4 py-2 shadow hover:bg-neutral-200",
          span: "flex items-center gap-2 !leading-[normal]"
        };
      case "purple":
        return {
          container:
            "h-fit rounded-lg px-4 py-1 hover:bg-purpleCustom-60 text-purpleCustom-500 bg-purpleCustom-50 border border-purpleCustom-60",
          span: "flex items-center gap-2 text-purpleCustom-500 text-14 !leading-[normal]"
        };
      case "about-us":
        return {
          container: "h-fit rounded-lg bg-green-200 px-5 py-[18px] hover:bg-green-60 text-white",
          span: "flex items-center text-16-bold !leading-[normal]"
        };
      default:
        return { container: "", span: "" };
    }
  }, [variant]);

  return (
    <Component
      {...rest}
      disabled={disabled}
      className={classNames(
        tw(
          variantClasses.container,
          "flex items-center justify-center gap-1.5 tracking-wide",
          fullWidth ? "w-full justify-center" : "w-fit-content",
          className
        )
      )}
    >
      <When condition={!!iconProps}>
        <Icon width={14} {...iconProps!} />
      </When>
      <span className={variantClasses.span}>{children}</span>
    </Component>
  );
};

export default withFrameworkShow(Button);
