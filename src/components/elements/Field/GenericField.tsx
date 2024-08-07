import { DetailedHTMLProps, HTMLAttributes } from "react";

import Text from "@/components/elements/Text/Text";
import { withFrameworkShow } from "@/context/framework.provider";

export interface GenericFieldProps extends DetailedHTMLProps<HTMLAttributes<HTMLDivElement>, HTMLDivElement> {
  label: string;
}

const GenericField = ({ label, children, ...rest }: GenericFieldProps) => (
  <div {...rest}>
    <Text variant="text-bold-subtitle-500">{label}</Text>
    {children}
  </div>
);

export default withFrameworkShow(GenericField);
