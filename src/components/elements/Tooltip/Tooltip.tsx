import { ReactNode } from "react";

import Text from "../Text/Text";

export interface TooltipProps {
  children: ReactNode;
  content: ReactNode;
  width?: string;
  placement?: string;
  className?: string;
  title?: string;
}

const ToolTip = ({ children, content, width, placement, className, title }: TooltipProps) => {
  return (
    <div className={`group relative flex flex-col items-center ${className}`}>
      <div
        className={`shadow-lg text-12 absolute bottom-full z-10 mb-1 hidden w-fit rounded bg-darkCustom p-2 text-center text-white
        group-hover:inline-block ${width} ${placement} lg:p-3`}
      >
        <div className="absolute bottom-0 left-1/2 ml-[-4px] mb-[-9px] hidden  border-[5px] border-darkCustom border-r-transparent border-b-transparent border-l-transparent group-hover:block " />
        <Text variant="text-12-semibold">{title}</Text>
        {content}
      </div>
      {children}
    </div>
  );
};

export default ToolTip;
