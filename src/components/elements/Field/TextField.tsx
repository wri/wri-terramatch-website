import { DetailedHTMLProps, FC, HTMLAttributes } from "react";

import Text from "@/components/elements/Text/Text";
import { withFrameworkShow } from "@/context/framework.provider";

import BaseField from "./BaseField";

export interface TextFieldProps extends DetailedHTMLProps<HTMLAttributes<HTMLDivElement>, HTMLDivElement> {
  label: string;
  value: string;
}

const TextField: FC<TextFieldProps> = ({ label, value, className, ...rest }) => (
  <BaseField {...rest} className={className}>
    <div className="flex items-center justify-between">
      <Text variant="text-16-bold">{label}</Text>
      <Text variant="text-16-light">{value || "N/A"}</Text>
    </div>
  </BaseField>
);

export default withFrameworkShow(TextField);
