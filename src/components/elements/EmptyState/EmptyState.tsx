import classNames from "classnames";
import { DetailedHTMLProps, FC, HTMLAttributes } from "react";

import Button, { IButtonProps } from "@/components/elements/Button/Button";
import Paper from "@/components/elements/Paper/Paper";
import Text from "@/components/elements/Text/Text";
import Icon, { IconProps } from "@/components/extensive/Icon/Icon";

type EmptyStateProps = DetailedHTMLProps<HTMLAttributes<HTMLDivElement>, HTMLDivElement> & {
  title: string;
  iconProps: Omit<IconProps, "width">;
  subtitle?: string;
  ctaProps?: IButtonProps;
};

const EmptyState: FC<EmptyStateProps> = ({ title, iconProps, subtitle, ctaProps, className, ...props }) => (
  <Paper {...props} className={classNames(className, "p-15")}>
    {iconProps != null && (
      <Icon {...iconProps} width={80} className={classNames(iconProps?.className, "m-auto mb-8")} />
    )}
    <Text variant="text-bold-headline-1000" className="mb-5 text-center">
      {title}
    </Text>
    {subtitle != null && (
      <Text variant="text-light-body-300" className="m-auto max-w-3xl text-center">
        {subtitle}
      </Text>
    )}
    {ctaProps != null && <Button {...ctaProps} className="m-auto mt-8" />}
  </Paper>
);

export default EmptyState;
