import classNames from "classnames";
import React, { ReactNode } from "react";

import Icon, { IconNames } from "@/components/extensive/Icon/Icon";

import Button from "../Button/Button";

export interface DrawerProps {
  isOpen?: boolean;
  title?: ReactNode;
  children: ReactNode;
  setIsOpen: (isOpen: boolean) => void;
}

const Drawer = (props: DrawerProps) => {
  const { isOpen, setIsOpen, title = "", children } = props;

  return (
    <div
      className={classNames(
        "fixed left-full top-0 z-50 mt-[70px] ml-2 flex h-[-webkit-fill-available] w-96  flex-col gap-6 overflow-clip bg-white py-6 pl-6 pr-3 shadow-[0_0_5px_0_rgba(0,0,0,0.2)] transition-all",
        { "translate-x-[-24.5rem]": isOpen }
      )}
    >
      <div className="flex w-full items-center">
        {title}
        <Button
          variant="text"
          className="ml-auto"
          onClick={() => {
            setIsOpen(false);
          }}
        >
          <Icon name={IconNames.CLEAR} className="h-5 w-5 opacity-50" />
        </Button>
      </div>
      {children}
    </div>
  );
};

export default Drawer;
