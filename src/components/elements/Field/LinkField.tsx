import Link from "next/link";
import { DetailedHTMLProps, FC, HTMLAttributes } from "react";

import Text from "@/components/elements/Text/Text";

import BaseField from "./BaseField";

export interface LinkFieldProps extends DetailedHTMLProps<HTMLAttributes<HTMLDivElement>, HTMLDivElement> {
  label: string;
  value: string;
  url: string;
  external?: boolean;
}

const LinkField: FC<LinkFieldProps> = ({ label, value, url, external, className, ...rest }) => {
  return (
    <BaseField {...rest} className={className}>
      <div className="flex items-center justify-between">
        <Text variant="text-bold-subtitle-500">{label}</Text>

        <Link href={url} {...(external && { target: "_blank" })}>
          <Text variant="text-bold-subtitle-400" className="leading-normal text-primary-500 underline">
            {value}
          </Text>
        </Link>
      </div>
    </BaseField>
  );
};

export default LinkField;
