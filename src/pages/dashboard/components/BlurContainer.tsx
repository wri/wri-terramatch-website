import classNames from "classnames";
import React from "react";
import { twMerge as tw } from "tailwind-merge";
interface BlurContainerProps {
  isCollapse?: boolean;
  children: React.ReactNode;
  className?: string;
}
const BlurContainer = (props: BlurContainerProps) => {
  const { isCollapse, children, className } = props;
  return (
    <div
      className={tw(
        classNames("relative rounded-lg border border-[#989E97]", {
          "max-w-[265px] lg:max-w-[395px] wide:max-w-[550px]": isCollapse,
          "max-w-[192px] lg:max-w-[300px] wide:max-w-[445px]": !isCollapse
        }),
        className
      )}
    >
      <div className="absolute h-full w-full rounded-lg bg-white bg-opacity-20 backdrop-blur-md" />
      {children}
    </div>
  );
};

export default BlurContainer;
