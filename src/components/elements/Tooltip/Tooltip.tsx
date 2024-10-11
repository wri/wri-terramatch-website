import { useT } from "@transifex/react";
import classNames from "classnames";
import { ReactNode, useEffect, useRef, useState } from "react";
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
  trigger?: "hover" | "click";
}

const ToolTip = ({
  children,
  content,
  width,
  placement = "top",
  className,
  title,
  trigger = "hover"
}: TooltipProps) => {
  const contentRef = useRef<HTMLDivElement>(null);
  const tooltipRef = useRef<HTMLDivElement>(null);
  const t = useT();
  const [tooltipStyles, setTooltipStyles] = useState({ left: 0, top: 0 });
  const [isVisible, setIsVisible] = useState(false);
  const [placementArrow, setPlacementArrow] = useState(0);

  const handleMouseEnter = () => {
    if (trigger === "hover") {
      setIsVisible(true);
      updateTooltipPosition();
    }
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (contentRef.current && !contentRef.current?.contains(event.target as Node)) {
        setIsVisible(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  });

  useEffect(() => {
    const handleScroll = () => {
      setIsVisible(false);
    };

    window.addEventListener("scroll", handleScroll, true);
    return () => {
      window.removeEventListener("scroll", handleScroll, true);
    };
  }, []);

  const handleMouseLeave = () => {
    if (trigger === "hover") {
      setIsVisible(false);
    }
  };

  const handleClick = () => {
    if (trigger === "click") {
      setIsVisible(!isVisible);
      if (!isVisible) {
        updateTooltipPosition();
      }
    }
  };

  useEffect(() => {
    const handleResize = () => {
      updateTooltipPosition();
    };

    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  const updateTooltipPosition = () => {
    const position = contentRef.current?.getBoundingClientRect();
    const positionTooltip = tooltipRef.current?.getBoundingClientRect();

    if (position && positionTooltip) {
      let newLeft = 0;
      let newTop = 0;

      if (placement === "right") {
        newLeft = position.left + position.width + 5;
        newTop = position.top + position.height / 2 - positionTooltip.height / 2;
        if (newLeft + positionTooltip.width > window.innerWidth) {
          newLeft = window.innerWidth - positionTooltip.width - 5;
        }
        if (newTop + positionTooltip.height > window.innerHeight) {
          newTop = window.innerHeight - positionTooltip.height - 5;
        }
        if (newTop < 0) {
          newTop = 5;
        }
      }
      if (placement === "top") {
        newLeft = position.left + position.width / 2 - positionTooltip.width / 2;
        newTop = position.top - positionTooltip.height - 5;
        const copyLeft = newLeft;
        if (newLeft + positionTooltip.width > window.innerWidth) {
          newLeft = window.innerWidth - positionTooltip.width - 5;
        }
        if (newLeft < 0) {
          newLeft = 5;
        }
        if (newTop < 0) {
          newTop = position.top + position.height + 5;
        }
        setPlacementArrow(copyLeft - newLeft);
      }

      setTooltipStyles({
        left: newLeft,
        top: newTop
      });
    }
  };

  const PLACEMENT = {
    top: "bottom-0 left-1/2 transform -translate-x-1/2 mb-[-9px] border-b-transparent border-l-transparent border-r-transparent",
    right:
      "left-0 top-1/2 transform -translate-y-1/2 ml-[-10px] border-b-transparent border-l-transparent border-t-transparent"
  };

  return (
    <div
      className={`group relative flex cursor-pointer flex-col items-center ${className}`}
      ref={contentRef}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onClick={handleClick}
    >
      <div
        className={`fixed -z-10 ${isVisible ? "z-50" : ""}`}
        style={{
          left: `${tooltipStyles.left}px`,
          top: `${tooltipStyles.top}px`
        }}
        ref={tooltipRef}
      >
        <div
          className={tw(
            "shadow-lg text-12 relative w-fit rounded bg-darkCustom p-3 text-left text-white opacity-0",
            isVisible ? "opacity-100" : "",
            width
          )}
        >
          <div
            className={classNames("absolute border-[5px] border-darkCustom", PLACEMENT[placement])}
            style={placement === "top" ? { marginLeft: `${placementArrow}px` } : {}}
          />
          <When condition={!!title}>
            <Text variant="text-12-bold" className="mb-1">
              {t(title)}
            </Text>
          </When>
          <Text variant="text-12-light" className="!font-light leading-[normal]" containHtml={true}>
            {content}
          </Text>
        </div>
      </div>

      {children}
    </div>
  );
};

export default ToolTip;
