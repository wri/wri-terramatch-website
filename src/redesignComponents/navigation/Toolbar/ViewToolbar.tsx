import { FC, useCallback, useEffect, useRef, useState } from "react";

import IconButton from "@/redesignComponents/actions/Buttons/IconButton/IconButton";
import { ChevronRightIcon } from "@/redesignComponents/foundations/Icons";

import TabBar from "../TabBar/TabBar";
import Toolbar from "./Toolbar";
import { ViewToolbarProps } from "./ToolBar.type";

const SCROLL_STEP = 200;

const ViewToolbar: FC<ViewToolbarProps> = ({ tabBar }: ViewToolbarProps) => {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [showLeft, setShowLeft] = useState(false);
  const [showRight, setShowRight] = useState(false);

  const updateArrows = useCallback(() => {
    const el = scrollRef.current;
    if (!el) return;
    setShowLeft(el.scrollLeft > 1);
    setShowRight(el.scrollLeft + el.clientWidth < el.scrollWidth - 1);
  }, []);

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;

    updateArrows();

    const observer = new ResizeObserver(updateArrows);
    observer.observe(el);
    el.addEventListener("scroll", updateArrows);

    return () => {
      observer.disconnect();
      el.removeEventListener("scroll", updateArrows);
    };
  }, [updateArrows]);

  const scroll = (direction: "left" | "right") => {
    scrollRef.current?.scrollBy({
      left: direction === "left" ? -SCROLL_STEP : SCROLL_STEP,
      behavior: "smooth"
    });
  };

  const tabBarContent = (
    <div className="flex w-full items-center gap-1">
      {showLeft && (
        <IconButton onClick={() => scroll("left")} icon={<ChevronRightIcon className="rotate-180" boxSize={3} />} />
      )}

      <div
        ref={scrollRef}
        className="min-w-0 flex-1 overflow-x-auto [&::-webkit-scrollbar]:hidden [&_[role='tablist']]:!flex-nowrap"
        style={{ scrollbarWidth: "none" }}
      >
        <TabBar key={tabBar.defaultValue} {...tabBar} variant="transparent" />
      </div>

      {showRight && <IconButton onClick={() => scroll("right")} icon={<ChevronRightIcon boxSize={3} />} />}
    </div>
  );

  return <Toolbar className="!px-2" contentLeft={tabBarContent} />;
};

export default ViewToolbar;
