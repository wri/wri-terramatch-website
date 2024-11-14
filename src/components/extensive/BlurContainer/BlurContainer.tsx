import React from "react";
import { When } from "react-if";
import { twMerge as tw } from "tailwind-merge";

import Text from "@/components/elements/Text/Text";

export interface BlurContainerProps {
  isBlur: boolean;
  textInformation?: string;
  children: React.ReactNode;
  className?: string;
}

const BlurContainer = ({ isBlur, textInformation, children, className, ...props }: BlurContainerProps) => {
  if (!isBlur) {
    return <>{children}</>;
  }

  return (
    <div className={tw("relative w-full text-black", className)}>
      <div
        className={`absolute left-0 top-0 flex h-full w-full items-center justify-center rounded-xl ${
          isBlur ? "z-[1] bg-[#9d9a9a29] backdrop-blur-sm" : ""
        }`}
      >
        <When condition={isBlur && textInformation}>
          <Text variant="text-12-semibold" className="h-fit w-fit max-w-[80%] rounded-lg bg-white px-4 py-3">
            {textInformation}
          </Text>
        </When>
      </div>
      {children}
    </div>
  );
};

export default BlurContainer;
