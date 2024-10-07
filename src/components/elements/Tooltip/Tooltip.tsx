import classNames from "classnames";
import { ReactNode, useRef, useState } from "react";
import { When } from "react-if";
import { twMerge as tw } from "tailwind-merge";

import Text from "../Text/Text";

export interface TooltipProps {
  children: ReactNode;
  content: ReactNode;
  width?: string;
  placement?: "top" | "right";
  className?: string;
  title?: string;
}

const ToolTip = ({ children, content, width, placement = "top", className, title }: TooltipProps) => {
  const contentRef = useRef<HTMLDivElement>(null);
  const tooltipRef = useRef<HTMLDivElement>(null);
  const [tooltipStyles, setTooltipStyles] = useState({ left: 0, top: 0 });

  const handleMouseEnter = () => {
    const position = contentRef.current?.getBoundingClientRect();
    const positionTooltip = tooltipRef.current?.getBoundingClientRect();

    if (position && positionTooltip) {
      let newLeft = 0;
      let newTop = 0;

      if (placement === "right") {
        newLeft = position.left + position.width + 5;
        newTop = position.top + position.height / 2 - positionTooltip.height / 2;
      }
      if (placement === "top") {
        newLeft = position.left + position.width / 2 - positionTooltip.width / 2;
        newTop = position.top - positionTooltip.height - 5;
      }

      setTooltipStyles({
        left: newLeft,
        top: newTop
      });
    }
  };

  const PLACEMENT = {
    top: "bottom-0 left-1/2 ml-[-4px] mb-[-9px] border-b-transparent border-l-transparent border-r-transparent",
    right: "left-0 top-1/2 ml-[-10px] border-b-transparent border-l-transparent border-t-transparent -translate-y-1/2"
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
            "shadow-lg text-12 relative -z-10 w-fit rounded bg-darkCustom p-2 text-left text-white group-hover:z-50",
            width
          )}
        >
          <div
            className={classNames("absolute border-[5px] border-darkCustom group-hover:block", PLACEMENT[placement])}
          />
          <When condition={!!title}>
            <Text variant="text-12-bold" className="mb-1">
              {title}
            </Text>
          </When>
          <Text variant="text-12-light" className="!font-light leading-[normal]">
            {content}
          </Text>
        </div>
      </div>

      {children}
    </div>
  );
};

export default ToolTip;
