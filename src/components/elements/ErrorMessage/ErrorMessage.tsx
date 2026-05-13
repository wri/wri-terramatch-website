import classNames from "classnames";
import { FC } from "react";
import { FieldError } from "react-hook-form";

import Text, { TextProps } from "@/components/elements/Text/Text";
import Icon, { IconNames } from "@/components/extensive/Icon/Icon";

export type ErrorMessageProps = Omit<TextProps, "variant" | "children" | "as"> & {
  error?: FieldError;
};

const ErrorMessage: FC<ErrorMessageProps> = ({ error, className, ...rest }) =>
  error?.message == null ? null : (
    <div className={classNames("flex w-full items-center gap-3", className)}>
      <Icon name={IconNames.ERROR} className="fill-error" width={20} />
      <Text {...rest} as="span" variant="text-body-500" className={"w-full text-left text-error"}>
        {error.message}
      </Text>
    </div>
  );

export default ErrorMessage;
