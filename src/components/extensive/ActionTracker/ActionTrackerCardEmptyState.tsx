import classNames from "classnames";
import { DetailedHTMLProps, HTMLAttributes } from "react";
import { When } from "react-if";

import Button, { IButtonProps } from "@/components/elements/Button/Button";
import Text from "@/components/elements/Text/Text";

export interface ActionTrackerCardEmptyStateProps
  extends DetailedHTMLProps<HTMLAttributes<HTMLDivElement>, HTMLDivElement> {
  subtitle: string;
  title: string;
  buttonProps?: IButtonProps;
}

const ActionTrackerCardEmptyState = ({
  title,
  subtitle,
  buttonProps,
  className,
  ...props
}: ActionTrackerCardEmptyStateProps) => (
  <div
    {...props}
    className={classNames(
      className,
      "flex h-full w-full flex-col items-center justify-center rounded-lg border border-neutral-300 bg-neutral-50 p-6"
    )}
  >
    <Text variant="text-bold-body-300" className="mb-4">
      {title}
    </Text>
    <Text variant="text-light-caption-200" className="text-center">
      {subtitle}
    </Text>
    <When condition={!!buttonProps}>
      <Button {...buttonProps} className="mt-6" />
    </When>
  </div>
);

export default ActionTrackerCardEmptyState;
