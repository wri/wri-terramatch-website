import classNames from "classnames";
import { FieldError } from "react-hook-form";
import { When } from "react-if";

import Text, { TextProps } from "@/components/elements/Text/Text";
import Icon, { IconNames } from "@/components/extensive/Icon/Icon";

export interface ErrorMessageProps extends Omit<TextProps, "variant" | "children" | "as"> {
  error?: FieldError;
}

const ErrorMessage = ({ error, className, ...rest }: ErrorMessageProps) => {
  return (
    <When condition={!!error && error?.message}>
      <div className={classNames("flex w-full items-center gap-3", className)}>
        <Icon name={IconNames.ERROR} className="fill-error" width={20} />
        <Text {...rest} as="span" variant="text-body-500" className={"w-full text-left text-error"}>
          {error?.message || ""}
        </Text>
      </div>
    </When>
  );
};

export default ErrorMessage;
