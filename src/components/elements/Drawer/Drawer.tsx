import classNames from "classnames";
import React, { ReactNode, useEffect, useState } from "react";

import Icon, { IconNames } from "@/components/extensive/Icon/Icon";
import { useMonitoredDataContext } from "@/context/monitoredData.provider";

import Button from "../Button/Button";
import { DRAWER_VARIANT_DEFAULT, DrawerVariant } from "./DrawerVariants";

export interface DrawerProps {
  isOpen?: boolean;
  title?: ReactNode;
  children: ReactNode;
  setIsOpen: (isOpen: boolean) => void;
  setPolygonFromMap?: any;
  isScrolledDefault?: boolean;
  variant?: DrawerVariant;
}

const Drawer = (props: DrawerProps) => {
  const {
    isOpen,
    setIsOpen,
    title = "",
    setPolygonFromMap,
    children,
    isScrolledDefault,
    variant = DRAWER_VARIANT_DEFAULT
  } = props;
  const [isScrolled, setIsScrolled] = useState(isScrolledDefault);
  const [isScrollingDown, setIsScrollingDown] = useState(isScrolledDefault);
  const [prevScrollPos, setPrevScrollPos] = useState(0);
  const { setSelectPolygonFromMap } = useMonitoredDataContext();

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollPos = window.pageYOffset;
      const scrollThreshold = 100;

      const isScrollingDown = currentScrollPos > prevScrollPos;
      const isElementScrolled = currentScrollPos > scrollThreshold;

      setIsScrolled(isElementScrolled);
      setPrevScrollPos(currentScrollPos);

      setIsScrollingDown(isScrollingDown);
    };

    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [prevScrollPos]);

  return (
    <div
      className={classNames(
        "fixed left-full top-0 z-50 ml-2 flex h-[-webkit-fill-available] h-full w-[25rem] flex-col overflow-visible bg-white py-6 pl-6 pr-3 shadow-[0_0_5px_0_rgba(0,0,0,0.2)] transition-all duration-[200ms] ease-in-out lg:w-[26.5rem]",
        {
          "translate-x-[-25.5rem] lg:translate-x-[-27rem]": isOpen,
          "mt-[70px] h-[calc(100%_-_70px)]": !isScrolled || !isScrollingDown,
          "mt-0 h-full": isScrolled && isScrollingDown
        }
      )}
    >
      <div className={classNames("flex w-full", variant.headerClassname)}>
        {title}
        <Button
          variant="text"
          className="ml-auto rounded p-1 hover:bg-grey-800"
          onClick={() => {
            setIsOpen(false);
            setPolygonFromMap && setPolygonFromMap({ isOpen: false, uuid: "" });
            setSelectPolygonFromMap?.({ uuid: "", isOpen: false });
          }}
        >
          <Icon name={IconNames.CLEAR} className={classNames("h-5 w-5", variant.iconClassName)} />
        </Button>
      </div>
      {children}
    </div>
  );
};

export default Drawer;
