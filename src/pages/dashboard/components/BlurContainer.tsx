import classNames from "classnames";
import React from "react";
import { When } from "react-if";
import { twMerge as tw } from "tailwind-merge";
interface BlurContainerProps {
  isCollapse?: boolean;
  children: React.ReactNode;
  className?: string;
  disabled?: boolean;
}

const BlurContainer = (props: BlurContainerProps) => {
  const { isCollapse, children, className, disabled } = props;
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
      <div className={classNames({ "opacity-70": disabled })}>{children}</div>
      <When condition={disabled}>
        <div className="absolute top-0 z-10 h-full w-full" />
      </When>
    </div>
  );
};

export default BlurContainer;
