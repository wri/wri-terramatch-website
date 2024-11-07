import React from "react";
import { When } from "react-if";

import Text from "@/components/elements/Text/Text";

export interface BlurContainerProps {
  isBlur: boolean;
  textInformation?: string;
  children: React.ReactNode;
}

const BlurContainer = ({ isBlur, textInformation, children, ...props }: BlurContainerProps) => {
  return (
    <div className="relative w-full text-black">
      <div
        className={`absolute left-0 top-0 flex h-full w-full items-center justify-center rounded-xl   ${
          isBlur ? "z-10 bg-[#9d9a9a29] backdrop-blur-sm" : ""
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
