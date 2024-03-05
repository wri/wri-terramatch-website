import classNames from "classnames";
import React, { ReactNode } from "react";

import Icon, { IconNames } from "@/components/extensive/Icon/Icon";

import Button from "../Button/Button";

export interface DrawerProps {
  isOpen: boolean;
  title: ReactNode;
  children: ReactNode;
  setIsOpen: (isOpen: boolean) => void;
}

const Drawer = (props: DrawerProps) => {
  const { isOpen, setIsOpen, title, children } = props;

  return (
    <div
      className={classNames(
        "shadow-xl fixed left-full z-40 flex h-[-webkit-fill-available] w-96 flex-col overflow-auto bg-white p-6 transition-all",
        { "translate-x-[-24rem]": isOpen }
      )}
    >
      <div className="flex w-full items-center justify-between">
        {title}
        <Button
          variant="text"
          onClick={() => {
            setIsOpen(false);
          }}
        >
          <Icon name={IconNames.CLEAR} className="h-5 w-5" />
        </Button>
      </div>
      {children}
    </div>
  );
};

export default Drawer;
