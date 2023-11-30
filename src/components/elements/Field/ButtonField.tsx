import { DetailedHTMLProps, FC, HTMLAttributes } from "react";

import Button, { IButtonProps } from "@/components/elements/Button/Button";
import Text from "@/components/elements/Text/Text";

import BaseField from "./BaseField";

export interface ButtonFieldProps extends DetailedHTMLProps<HTMLAttributes<HTMLDivElement>, HTMLDivElement> {
  label: string;
  buttonProps: IButtonProps;
  subtitle?: string;
}

const ButtonField: FC<ButtonFieldProps> = ({ label, subtitle, buttonProps, onClick, className, ...rest }) => {
  return (
    <BaseField {...rest} className={className}>
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <Text variant="text-bold-subtitle-500">{label}</Text>
          {subtitle && <Text variant="text-light-body-300">{subtitle}</Text>}
        </div>
        <Button {...buttonProps} />
      </div>
    </BaseField>
  );
};

export default ButtonField;
