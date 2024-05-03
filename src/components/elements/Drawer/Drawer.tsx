import classNames from "classnames";
import React, { ReactNode, useEffect, useState } from "react";

import Icon, { IconNames } from "@/components/extensive/Icon/Icon";

import Button from "../Button/Button";

export interface DrawerProps {
  isOpen?: boolean;
  title?: ReactNode;
  children: ReactNode;
  setIsOpen: (isOpen: boolean) => void;
  setPolygonFromMap: any;
}

const Drawer = (props: DrawerProps) => {
  const { isOpen, setIsOpen, title = "", setPolygonFromMap, children } = props;
  const [isScrolled, setIsScrolled] = useState(false);
  const [isScrollingDown, setIsScrollingDown] = useState(false);
  const [prevScrollPos, setPrevScrollPos] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollPos = window.pageYOffset;
      const scrollThreshold = 100;

      const isScrollingDown = currentScrollPos > prevScrollPos;
      const isElementScrolled = currentScrollPos > scrollThreshold;

      setIsScrolled(isElementScrolled);
      setPrevScrollPos(currentScrollPos);

      if (isScrollingDown) {
        setIsScrollingDown(true);
      } else {
        setIsScrollingDown(false);
      }
    };

    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [prevScrollPos]);

  return (
    <div
      className={classNames(
        "fixed left-full top-0 z-50 ml-2 flex h-[-webkit-fill-available] w-[25rem] flex-col overflow-clip bg-white py-6 pl-6 pr-3 shadow-[0_0_5px_0_rgba(0,0,0,0.2)] transition-all duration-[200ms] ease-in-out lg:w-[26.5rem]",
        {
          "translate-x-[-25.5rem] lg:translate-x-[-27rem] ": isOpen,
          "mt-[70px]": !isScrolled || !isScrollingDown,
          "mt-0": isScrolled && isScrollingDown
        }
      )}
    >
      <div className="flex w-full items-center">
        {title}
        <Button
          variant="text"
          className="ml-auto rounded p-1 hover:bg-grey-800"
          onClick={() => {
            setIsOpen(false);
            setPolygonFromMap({ isOpen: false, uuid: "" });
          }}
        >
          <Icon name={IconNames.CLEAR} className="h-5 w-5 text-blueCustom-900 opacity-50" />
        </Button>
      </div>
      {children}
    </div>
  );
};

export default Drawer;
