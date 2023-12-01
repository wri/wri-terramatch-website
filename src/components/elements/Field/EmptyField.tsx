import classNames from "classnames";
import { DetailedHTMLProps, HTMLAttributes } from "react";

import Text from "@/components/elements/Text/Text";
import Icon, { IconNames } from "@/components/extensive/Icon/Icon";

export interface EmptyFieldProps extends DetailedHTMLProps<HTMLAttributes<HTMLDivElement>, HTMLDivElement> {
  title: string;
  content?: string;
}

const EmptyField = ({ title, content, className, ...rest }: EmptyFieldProps) => {
  return (
    <div
      {...rest}
      className={classNames("flex flex-col gap-6 rounded-xl border border-neutral-100 bg-neutral-50 p-8", className)}
    >
      <Icon name={IconNames.EXCLAMATION_CIRCLE} className="m-auto fill-neutral-800" width={40} />
      <div className="mx-auto mb-3 max-w-sm space-y-3 text-center">
        <Text variant="text-bold-body-300">{title}</Text>
        <Text variant="text-light-body-300">{content}</Text>
      </div>
    </div>
  );
};

export default EmptyField;
