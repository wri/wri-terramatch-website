import classNames from "classnames";
import { DetailedHTMLProps, HTMLAttributes, PropsWithChildren, ReactNode } from "react";
import { When } from "react-if";

import EmptyField, { EmptyFieldProps } from "@/components/elements/Field/EmptyField";
import Paper from "@/components/elements/Paper/Paper";
import Text from "@/components/elements/Text/Text";

export interface PageCardProps
  extends DetailedHTMLProps<HTMLAttributes<HTMLDivElement>, HTMLDivElement>,
    PropsWithChildren {
  title?: string;
  subtitle?: string;
  headerChildren?: ReactNode;
  isEmpty?: boolean;
  emptyStateProps?: EmptyFieldProps;
  gap?: 4 | 8;
}

const PageCard = ({
  title,
  subtitle,
  children,
  headerChildren,
  emptyStateProps,
  isEmpty,
  gap = 8,
  ...props
}: PageCardProps) => {
  return (
    <Paper {...props}>
      <When condition={!!title || !!headerChildren}>
        <div className="flex flex-wrap justify-between">
          <When condition={!!title}>
            <Text variant="text-24-bold" className="flex-1">
              {title}
            </Text>
          </When>
          <When condition={!!title}>{headerChildren}</When>
        </div>
      </When>
      <When condition={!!subtitle}>
        <Text variant="text-light-subtitle-400" className="mt-3">
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
};

export default PageCard;
