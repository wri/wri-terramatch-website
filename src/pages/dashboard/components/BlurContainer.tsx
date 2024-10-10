import classNames from "classnames";
import React from "react";
import { When } from "react-if";
import { twMerge as tw } from "tailwind-merge";
interface BlurContainerProps {
  children: React.ReactNode;
  className?: string;
  disabled?: boolean;
}

const BlurContainer = (props: BlurContainerProps) => {
  const { children, className, disabled } = props;
  return (
    <div
      className={tw(
        classNames(
          "relative max-h-fit w-fit min-w-[196px] flex-[1_1_45%] rounded-lg border border-[#989E97] small:flex-auto"
        ),
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
