import classNames from "classnames";
import React, { useEffect, useRef, useState } from "react";

import { ToggleVariants, VARIANT_TOGGLE_PRIMARY } from "./ToggleVariants";

export interface ToggleProps {
  items: string[];
  activeIndex: number;
  setActiveIndex: React.Dispatch<React.SetStateAction<number>>;
  textClassName?: string;
  disabledIndexes?: number[];
  variant?: ToggleVariants;
}

const Toggle = (props: ToggleProps) => {
  const { items, activeIndex, setActiveIndex, disabledIndexes = [], variant = VARIANT_TOGGLE_PRIMARY } = props;
  const [width, setWidth] = useState(0);
  const buttonRefs = useRef<(HTMLButtonElement | null)[]>([]);

  useEffect(() => {
    const currentButton = buttonRefs.current[activeIndex];
    if (currentButton) {
      const newWidth = currentButton.getBoundingClientRect().width;
      setWidth(newWidth);
    }
  }, [activeIndex]);

  const isDisabled = (index: number) => disabledIndexes.includes(index);

  return (
    <div className={classNames("relative flex", variant.container)}>
      <div
        className={classNames("absolute top-1 transition-all", variant.activeToggle)}
        style={{
          width: width,
          transform: `translateX(calc(${buttonRefs.current[activeIndex]?.offsetLeft}px - 4px))`
        }}
      />
      {items.map((tab, index) => (
        <button
          key={tab}
          ref={el => (buttonRefs.current[index] = el)}
          type="button"
          onClick={() => setActiveIndex(index)}
          disabled={isDisabled(index)}
          className={classNames(
            "hover:stroke-blue-950 hover:text-blue-950 group relative z-auto inline-flex h-full w-max min-w-[32px] items-center justify-center gap-1 whitespace-nowrap px-3 align-middle transition-all duration-300 ease-in-out",
            props.textClassName,
            activeIndex === index && variant.textActive,
            activeIndex !== index && variant.textInactive
          )}
        >
          {tab}
        </button>
      ))}
    </div>
  );
};

export default Toggle;
