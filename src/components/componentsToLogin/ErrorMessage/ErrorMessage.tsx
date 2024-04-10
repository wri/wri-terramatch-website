import { When } from "react-if";

import Text from "@/components/componentsToLogin/Text/Text";

const ErrorMessage = ({ error, className }: { error: { message: string }; className: string }) => {
  return (
    <When condition={!!error}>
      <div className={`flex w-full items-center gap-3 ${className}`}>
        <Text variant="text-body-500" className={"w-full text-left text-error"}>
          {error?.message || ""}
        </Text>
      </div>
    </When>
  );
};

export default ErrorMessage;
