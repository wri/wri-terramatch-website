import { ReactNode, useRef, useState } from "react";
import { twMerge as tw } from "tailwind-merge";

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
  const contentRef = useRef<HTMLDivElement>(null);
  const tooltipRef = useRef<HTMLDivElement>(null);
  const [tooltipStyles, setTooltipStyles] = useState({ left: 0, top: 0 });

  const handleMouseEnter = () => {
    const position = contentRef.current?.getBoundingClientRect();
    const positionTooltip = tooltipRef.current?.getBoundingClientRect();

    if (position && positionTooltip) {
      const newLeft = position.left + position.width / 2 - positionTooltip.width / 2;
      const newTop = position.top - positionTooltip.height - 5;

      setTooltipStyles({
        left: newLeft,
        top: newTop
      });
    }
  };

  return (
    <div
      className={`group relative flex flex-col items-center ${className}`}
      ref={contentRef}
      onMouseEnter={handleMouseEnter}
    >
      <div
        className="fixed -z-10 group-hover:z-50"
        style={{
          left: `${tooltipStyles.left}px`,
          top: `${tooltipStyles.top}px`
        }}
        ref={tooltipRef}
      >
        <div
          className={tw(
            "shadow-lg text-12 relative bottom-full -z-10 mb-1 w-fit rounded bg-darkCustom p-2 text-left text-white group-hover:z-50 lg:p-2",
            width,
            placement
          )}
        >
          <div className="absolute bottom-0 left-1/2 mb-[-9px] ml-[-4px] border-[5px] border-darkCustom border-b-transparent border-l-transparent border-r-transparent group-hover:block" />
          <Text variant="text-12-semibold">{title}</Text>
          <Text variant="text-12-light">{content}</Text>
        </div>
      </div>

      {children}
    </div>
  );
};

export default ToolTip;
