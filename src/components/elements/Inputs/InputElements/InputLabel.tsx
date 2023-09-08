import classNames from "classnames";
import { HTMLProps } from "react";
import { When } from "react-if";

import Text from "@/components/elements/Text/Text";

export interface InputLabelProps extends HTMLProps<HTMLLabelElement> {
  required?: boolean;
  children?: string | number;
}

const InputLabel = (props: InputLabelProps) => {
  const { required, children, className, ...labelProps } = props;
  return (
    <When condition={!!props.children}>
      <Text<HTMLLabelElement>
        {...labelProps}
        as="label"
        variant="text-bold-body-300"
        className={classNames("inline-block uppercase", className)}
      >
        {`${children} ${required ? "*" : ""}`}
      </Text>
    </When>
  );
};

export default InputLabel;
