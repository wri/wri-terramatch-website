import { useT } from "@transifex/react";
import { FC, HTMLAttributes } from "react";

import Text from "@/components/elements/Text/Text";

export interface InputDescriptionProps extends HTMLAttributes<HTMLParagraphElement> {
  required?: boolean;
  className?: string;
}

const InputDescription: FC<InputDescriptionProps> = ({ children, className, ...rest }) => {
  const t = useT();
  if (children == null) return null;
  return (
    <Text as="p" variant="text-body-400" className={className} containHtml {...rest}>
      {t(children)}
    </Text>
  );
};

export default InputDescription;
