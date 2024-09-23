import classNames from "classnames";
import { DetailedHTMLProps, HTMLAttributes, PropsWithChildren, ReactNode } from "react";
import { When } from "react-if";

import EmptyField, { EmptyFieldProps } from "@/components/elements/Field/EmptyField";
import Paper from "@/components/elements/Paper/Paper";
import Text from "@/components/elements/Text/Text";
import ToolTip from "@/components/elements/Tooltip/Tooltip";
import { withFrameworkShow } from "@/context/framework.provider";
import { TextVariants } from "@/types/common";

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
  tooltip,
  ...props
}: PageCardProps) => (
  <Paper {...props}>
    <When condition={!!title || !!headerChildren}>
      <div className="flex flex-wrap justify-between">
        <When condition={!!title}>
          <Text variant="text-24-bold" className="flex flex-1 items-baseline text-darkCustom">
            {title}
            <When condition={!!tooltip}>
              &nbsp;
              <ToolTip content={tooltip} placement="top" width="!w-56" title={title}>
                <Icon name={IconNames.IC_INFO} className="h-3 w-3 text-blueCustom-600 lg:h-4 lg:w-4" />
              </ToolTip>
            </When>
          </Text>
        </When>
        <When condition={!!title}>{headerChildren}</When>
      </div>
    </When>
    <When condition={!!subtitle}>
      <Text
        variant={variantSubTitle ? variantSubTitle : "text-light-subtitle-400"}
        className={classNames("mt-3 text-darkCustom", classNameSubTitle)}
      >
        {subtitle}
      </Text>
    </When>
    <When condition={!!children || isEmpty}>
      <div className={classNames(`space-y-${gap}`, (title || subtitle) && "mt-8")}>
        {isEmpty && !!emptyStateProps ? <EmptyField {...emptyStateProps} /> : children}
      </div>
    </When>
  </Paper>
);

export default withFrameworkShow(PageCard);
