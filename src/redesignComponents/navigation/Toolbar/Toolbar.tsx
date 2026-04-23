import classNames from "classnames";
import { FC } from "react";

import { ToolbarProps } from "./ToolBar.type";

const Toolbar: FC<ToolbarProps> = ({ contentLeft, contentRight, className, classNameContentRight }) => {
  return (
    <div className={classNames("flex items-center justify-between bg-white px-4", className)}>
      <div className="min-w-0 flex-1">{contentLeft}</div>
      <div className={classNames("flex-shrink-0", classNameContentRight)}>{contentRight}</div>
    </div>
  );
};

export default Toolbar;
