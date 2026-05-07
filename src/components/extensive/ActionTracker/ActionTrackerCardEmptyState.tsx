import classNames from "classnames";
import { DetailedHTMLProps, FC, HTMLAttributes } from "react";

import Button, { IButtonProps } from "@/components/elements/Button/Button";
import Text from "@/components/elements/Text/Text";

export type ActionTrackerCardEmptyStateProps = DetailedHTMLProps<HTMLAttributes<HTMLDivElement>, HTMLDivElement> & {
  subtitle: string;
  title: string;
  buttonProps?: IButtonProps;
};

const ActionTrackerCardEmptyState: FC<ActionTrackerCardEmptyStateProps> = ({
  title,
  subtitle,
  buttonProps,
  className,
  ...props
}) => (
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
    {buttonProps != null && <Button {...buttonProps} className="mt-6" />}
  </div>
);

export default ActionTrackerCardEmptyState;
