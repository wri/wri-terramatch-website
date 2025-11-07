import { FC, HTMLAttributes } from "react";

import Text from "@/components/elements/Text/Text";

export interface InputDescriptionProps extends HTMLAttributes<HTMLParagraphElement> {
  required?: boolean;
  className?: string;
}

const InputDescription: FC<InputDescriptionProps> = ({ children, className, ...rest }) =>
  children == null ? null : (
    <Text as="p" variant="text-body-400" className={className} containHtml {...rest}>
      {children}
    </Text>
  );

export default InputDescription;
