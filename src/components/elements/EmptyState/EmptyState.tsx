import classNames from "classnames";
import { DetailedHTMLProps, HTMLAttributes } from "react";
import { When } from "react-if";

import Button, { IButtonProps } from "@/components/elements/Button/Button";
import Paper from "@/components/elements/Paper/Paper";
import Text from "@/components/elements/Text/Text";
import Icon, { IconProps } from "@/components/extensive/Icon/Icon";

export interface EmptyStateProps extends DetailedHTMLProps<HTMLAttributes<HTMLDivElement>, HTMLDivElement> {
  title: string;
  iconProps: Omit<IconProps, "width">;
  subtitle?: string;
  ctaProps?: IButtonProps;
}

const EmptyState = ({ title, iconProps, subtitle, ctaProps, className, ...props }: EmptyStateProps) => {
  return (
    <Paper {...props} className={classNames(className, "p-15")}>
      <When condition={!!iconProps}>
        <Icon {...iconProps} width={80} className={classNames(iconProps?.className, "m-auto mb-8")} />
      </When>
      <Text variant="text-bold-headline-1000" className="mb-5 text-center">
        {title}
      </Text>
      <When condition={!!subtitle}>
        <Text variant="text-light-body-300" className="m-auto max-w-3xl text-center">
          {subtitle}
        </Text>
      </When>
      <When condition={!!ctaProps}>
        <Button {...ctaProps} className="m-auto mt-8" />
      </When>
    </Paper>
  );
};

export default EmptyState;
