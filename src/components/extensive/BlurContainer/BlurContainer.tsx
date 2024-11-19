import React from "react";
import { When } from "react-if";
import { twMerge as tw } from "tailwind-merge";

import Text from "@/components/elements/Text/Text";

export interface BlurContainerProps {
  isBlur: boolean;
  textInformation?: string | React.ReactNode;
  children: React.ReactNode;
  className?: string;
}

const BlurContainer = ({ isBlur, textInformation, children, className, ...props }: BlurContainerProps) => {
  if (!isBlur) {
    return <>{children}</>;
  }

  const LoginText = () => (
    <>
      <a href="/auth/login" className="text-12-semibold underline">
        Login to view.
      </a>{" "}
      If you are a funder or representing a government agency, please{" "}
      <a
        href="https://terramatchsupport.zendesk.com/hc/en-us/requests/new?ticket_form_id=30623040820123&tf_subject=Account%20Access%20Request%20for%20TerraMatch%20Dashboard&tf_description=Please%20provide%20your%20details%20to%20request%20access%20to%20the%20TerraMatch%20Dashboard.%20Once%20your%20information%20is%20submitted,%20our%20team%20will%20review%20your%20request%20and%20set%20up%20an%20account%20for%20you.%20You%E2%80%99ll%20receive%20an%20email%20with%20further%20instructions%20once%20your%20account%20is%20ready"
        className="text-12-semibold underline"
      >
        click here to request an account.
      </a>
    </>
  );

  return (
    <div className={tw("relative w-full text-black", className)}>
      <div
        className={`absolute left-0 top-0 flex h-full w-full items-center justify-center rounded-xl ${
          isBlur ? "z-[1] bg-[#9d9a9a29] backdrop-blur-sm" : ""
        }`}
      >
        <When condition={isBlur && !!textInformation}>
          <Text variant="text-12-semibold" className="h-fit w-fit max-w-[80%] rounded-lg bg-white px-4 py-3">
            {typeof textInformation === "string" ? textInformation : <LoginText />}
          </Text>
        </When>
      </div>
      {children}
    </div>
  );
};

export default BlurContainer;
