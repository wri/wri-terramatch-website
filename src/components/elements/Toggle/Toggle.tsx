import classNames from "classnames";
import React, { useRef } from "react";

interface ToggleProps {
  items: string[];
  activeIndex: number;
  setActiveIndex: React.Dispatch<React.SetStateAction<number>>;
}

const Toggle = (props: ToggleProps) => {
  const { items, activeIndex, setActiveIndex } = props;
  const buttonRefs = useRef<(HTMLButtonElement | null)[]>([]);

  return (
    <div className="relative flex rounded-lg bg-neutral-40 p-1">
      <div
        className="absolute top-1 h-[calc(100%_-_8px)] rounded-lg bg-white transition-all"
        style={{
          width: buttonRefs.current[activeIndex]?.getBoundingClientRect().width,
          transform: `translateX(${buttonRefs.current[activeIndex]?.offsetLeft}px)`
        }}
      />
      {items.map((tab, index) => (
        <button
          key={tab}
          ref={el => (buttonRefs.current[index] = el)}
          type="button"
          onClick={() => setActiveIndex(index)}
          className={classNames(
            "hover:stroke-blue-950 hover:text-blue-950 group relative z-10 inline-flex h-full w-max min-w-[32px] items-center justify-center gap-1 whitespace-nowrap px-3 align-middle transition-all duration-300 ease-in-out",
            {
              "text-14-bold text-darkCustom": activeIndex === index,
              "text-14-bold text-darkCustom-60": activeIndex !== index
            }
          )}
        >
          {tab}
        </button>
      ))}
    </div>
  );
};

export default Toggle;
