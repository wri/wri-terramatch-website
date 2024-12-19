import { DetailedHTMLProps, FC, HTMLAttributes } from "react";

import Text from "@/components/elements/Text/Text";
import { withFrameworkShow } from "@/context/framework.provider";
import { TextVariants } from "@/types/common";

import BaseField from "./BaseField";

export interface TextFieldProps extends DetailedHTMLProps<HTMLAttributes<HTMLDivElement>, HTMLDivElement> {
  label: string;
  value: string;
  variantLabel?: TextVariants;
}

const TextField: FC<TextFieldProps> = ({ label, value, variantLabel = "text-16-bold", className, ...rest }) => (
  <BaseField {...rest} className={className}>
    <div className="flex items-center justify-between">
      <Text variant={variantLabel!}>{label}</Text>
      <Text variant="text-16-light">{value || "N/A"}</Text>
    </div>
  </BaseField>
);

export default withFrameworkShow(TextField);
