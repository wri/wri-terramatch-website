import { When } from "react-if";

import Text from "@/components/componentsToLogin/Text/Text";

interface InputDescriptionProps {
  children?: React.ReactNode;
  className?: string;
}

const InputDescription: React.FC<InputDescriptionProps> = ({ children, className, ...rest }: InputDescriptionProps) => {
  return (
    <When condition={!!children}>
      <Text variant="text-body-400" className={className} {...rest}>
        {children}
      </Text>
    </When>
  );
};

export default InputDescription;
