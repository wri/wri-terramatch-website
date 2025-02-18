import { useT } from "@transifex/react";
import classNames from "classnames";
import { DetailedHTMLProps, HTMLAttributes, PropsWithChildren, ReactNode, useEffect, useState } from "react";
import { When } from "react-if";
import { twMerge as tw } from "tailwind-merge";

import EmptyField, { EmptyFieldProps } from "@/components/elements/Field/EmptyField";
import Paper from "@/components/elements/Paper/Paper";
import Text from "@/components/elements/Text/Text";
import ToolTip from "@/components/elements/Tooltip/Tooltip";
import { useMyUser } from "@/connections/User";
import { TEXT_TYPES } from "@/constants/dashboardConsts";
import { withFrameworkShow } from "@/context/framework.provider";
import { TextVariants } from "@/types/common";

import BlurContainer from "../../BlurContainer/BlurContainer";
import Icon, { IconNames } from "../../Icon/Icon";

export interface PageCardProps
  extends DetailedHTMLProps<HTMLAttributes<HTMLDivElement>, HTMLDivElement>,
    PropsWithChildren {
  title?: string;
  subtitle?: string;
  headerChildren?: ReactNode;
  isEmpty?: boolean;
  emptyStateProps?: EmptyFieldProps;
  gap?: 4 | 6 | 8;
  tooltip?: string;
  classNameSubTitle?: string;
  variantSubTitle?: TextVariants;
  subtitleMore?: boolean;
  tooltipTrigger?: "hover" | "click";
  iconClassName?: string;
  widthTooltip?: string;
  isUserAllowed?: boolean;
  collapseChildren?: boolean;
}

const PageCard = ({
  title,
  subtitle,
  children,
  headerChildren,
  emptyStateProps,
  isEmpty,
  gap = 8,
  classNameSubTitle,
  variantSubTitle,
  subtitleMore = false,
  tooltipTrigger = "hover",
  iconClassName,
  tooltip,
  widthTooltip,
  isUserAllowed = true,
  collapseChildren = false,
  ...props
}: PageCardProps) => {
  const [collapseSubtile, setCollapseSubtile] = useState(true);
  const [subtitleText, setSubtitleText] = useState(subtitle);
  const [openCollapseChildren, setOpenCollapseChildren] = useState(true);
  const t = useT();
  const [, { user }] = useMyUser();

  const maxLength = 278;

  useEffect(() => {
    if (collapseSubtile && (subtitle?.length ?? 0) > maxLength) {
      setSubtitleText(subtitle?.slice(0, maxLength));
    } else {
      setSubtitleText(subtitle);
    }
  }, [collapseSubtile, subtitle]);

  return (
    <Paper {...props}>
      <BlurContainer
        isBlur={!isUserAllowed}
        textType={user !== undefined ? TEXT_TYPES.LOGGED_USER : TEXT_TYPES.NOT_LOGGED_USER}
      >
        <When condition={!!title || !!headerChildren}>
          <div className="flex flex-wrap justify-between">
            <When condition={!!title}>
              <Text variant="text-24-bold" className="flex flex-1 items-baseline text-darkCustom">
                {title}
                <When condition={!!tooltip}>
                  &nbsp;
                  <ToolTip
                    className="normal-case"
                    content={tooltip || ""}
                    width={widthTooltip || "w-44 lg:w-52"}
                    title={title}
                    trigger={tooltipTrigger}
                  >
                    <Icon
                      name={IconNames.IC_INFO}
                      className={tw("h-3 w-3 text-blueCustom-600 lg:h-4 lg:w-4", iconClassName)}
                    />
                  </ToolTip>
                </When>
              </Text>
            </When>
            <When condition={!!title}>{headerChildren}</When>
            <When condition={collapseChildren}>
              <button onClick={() => setOpenCollapseChildren(!openCollapseChildren)}>
                <Icon
                  name={IconNames.IC_ARROW_COLLAPSE}
                  className={classNames(
                    "h-4 w-4 text-darkCustom transition-transform duration-300 ease-in-out hover:text-primary",
                    {
                      "rotate-180": !openCollapseChildren
                    }
                  )}
                />
              </button>
            </When>
          </div>
        </When>
        <div
          className={classNames("delay-400 duration-0 h-auto transition-all ease-in-out", {
            "bg-red-500 !h-0 opacity-0": collapseChildren && !openCollapseChildren
          })}
        >
          <When condition={!!subtitle}>
            <div
              className={classNames(subtitleMore && " ", {
                hidden: collapseChildren && !openCollapseChildren
              })}
            >
              <Text
                variant={variantSubTitle ? variantSubTitle : "text-light-subtitle-400"}
                className={classNames("mt-3 text-darkCustom", classNameSubTitle)}
                containHtml={subtitleMore}
                as="span"
              >
                {subtitleText}
              </Text>
              <When condition={subtitleMore && (subtitle?.length ?? 0) > maxLength}>
                <button
                  className="text-14-bold text-darkCustom opacity-80 hover:text-primary"
                  onClick={() => setCollapseSubtile(!collapseSubtile)}
                >
                  &nbsp;
                  {collapseSubtile ? t("...See More") : t("See Less")}
                </button>
              </When>
            </div>
          </When>

          <When condition={!!children || isEmpty}>
            <div
              className={classNames(`space-y-${gap}`, (title || subtitle) && "mt-8", {
                hidden: collapseChildren && !openCollapseChildren
              })}
            >
              {isEmpty && !!emptyStateProps ? <EmptyField {...emptyStateProps} /> : children}
            </div>
          </When>
        </div>
      </BlurContainer>
    </Paper>
  );
};

export default withFrameworkShow(PageCard);
