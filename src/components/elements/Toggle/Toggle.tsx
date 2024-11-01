import classNames from "classnames";
import React, { useEffect, useRef, useState } from "react";

import { ToggleVariants, VARIANT_TOGGLE_PRIMARY } from "./ToggleVariants";

export interface TogglePropsItem {
  key: string;
  render: React.ReactNode;
}

export interface ToggleProps {
  items: TogglePropsItem[];
  textClassName?: string;
  disabledIndexes?: number[];
  variant?: ToggleVariants;
  onChangeActiveIndex?: (index: number) => void;
}

const Toggle = (props: ToggleProps) => {
  const { items, disabledIndexes = [], variant = VARIANT_TOGGLE_PRIMARY, onChangeActiveIndex } = props;

  const [activeIndex, setActiveIndex] = useState(0);
  const [width, setWidth] = useState(0);
  const buttonRefs = useRef<(HTMLButtonElement | null)[]>([]);

  useEffect(() => {
    const currentButton = buttonRefs.current[activeIndex];

    if (currentButton) {
      const resizeObserver = new ResizeObserver(entries => {
        for (let entry of entries) {
          const newWidth = entry.target.clientWidth;
          setWidth(newWidth);
        }
      });

      resizeObserver.observe(currentButton);

      return () => resizeObserver.disconnect();
    }
  }, [activeIndex]);

  const handleClick = (index: number) => {
    setActiveIndex(index);
    if (onChangeActiveIndex) onChangeActiveIndex(index);
  };

  const isDisabled = (index: number) => disabledIndexes.includes(index);

  return (
    <div className={classNames("relative flex", variant.container)}>
      <div
        className={classNames("absolute top-1 transition-all", variant.activeToggle)}
        style={{
          width: width,
          transform: `translateX(calc(${buttonRefs.current[activeIndex]?.offsetLeft || 0}px - 4px))`
        }}
      />
      {items.map((tab, index) => (
        <button
          key={tab.key}
          ref={el => (buttonRefs.current[index] = el)}
          type="button"
          onClick={() => handleClick(index)}
          disabled={isDisabled(index)}
          className={classNames(
            "hover:stroke-blue-950 hover:text-blue-950 group relative z-auto inline-flex h-full w-max min-w-[32px] items-center justify-center gap-1 whitespace-nowrap px-3 align-middle transition-all duration-300 ease-in-out",
            props.textClassName,
            activeIndex === index && variant.textActive,
            activeIndex !== index && variant.textInactive
          )}
        >
          {tab.render}
        </button>
      ))}
    </div>
  );
};

export default Toggle;
