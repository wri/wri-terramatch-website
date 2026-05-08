import { DetailedHTMLProps, FC, HTMLAttributes } from "react";

import Button, { IButtonProps } from "@/components/elements/Button/Button";
import Text from "@/components/elements/Text/Text";

import BaseField from "./BaseField";

type ButtonFieldProps = DetailedHTMLProps<HTMLAttributes<HTMLDivElement>, HTMLDivElement> & {
  label: string;
  buttonProps: IButtonProps;
  subtitle?: string;
  subtitleClassName?: string;
};

const ButtonField: FC<ButtonFieldProps> = ({
  label,
  subtitle,
  buttonProps,
  onClick,
  className,
  subtitleClassName,
  ...rest
}) => (
  <BaseField {...rest} className={className}>
    <div className="flex items-center justify-between">
      <div className="space-y-1">
        <Text variant="text-bold-subtitle-500">{label}</Text>
        {subtitle != null && (
          <Text variant="text-light-body-300" className={subtitleClassName}>
            {subtitle}
          </Text>
        )}
      </div>
      <Button {...buttonProps} />
    </div>
  </BaseField>
);

export default ButtonField;
