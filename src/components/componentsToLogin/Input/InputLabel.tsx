import { When } from "react-if";

import Text, { TextProps } from "../Text/Text";

interface InputLabelProps extends TextProps {
  required?: boolean;
  children: React.ReactNode;
  className?: string;
  htmlFor?: string;
}

const InputLabel: React.FC<InputLabelProps> = ({
  required,
  children,
  className,
  htmlFor,
  ...labelProps
}: InputLabelProps) => {
  return (
    <When condition={!!children}>
      <Text {...labelProps} as="label" className={` ${className}`} variant="text-14-light">
        {`${children} ${required ? "*" : ""}`}
      </Text>
    </When>
  );
};

export default InputLabel;
