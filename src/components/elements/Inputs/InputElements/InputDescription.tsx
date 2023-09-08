import { FC, HTMLAttributes } from "react";
import { When } from "react-if";

import Text from "@/components/elements/Text/Text";

export interface InputDescriptionProps extends HTMLAttributes<HTMLParagraphElement> {
  required?: boolean;
  className?: string;
}

const InputDescription: FC<InputDescriptionProps> = ({ children, className, ...rest }) => {
  return (
    <When condition={!!children}>
      <Text as="p" variant="text-light-body-300" className={className} containHtml {...rest}>
        {children}
      </Text>
    </When>
  );
};

export default InputDescription;
