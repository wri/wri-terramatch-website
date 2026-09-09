import classNames from "classnames";
import { FC } from "react";

import { ToolbarProps } from "./ToolBar.type";

const Toolbar: FC<ToolbarProps> = ({
  contentLeft,
  contentRight,
  className,
  classNameContentRight,
  contentCenter,
  classNameContentLeft,
  classNameContentCenter
}) => {
  return (
    <div className={classNames("flex items-center justify-between bg-white px-4", className)}>
      <div className={classNames("flex min-h-[1.75rem] flex-shrink-0 flex-col justify-center", classNameContentLeft)}>
        {contentLeft}
      </div>
      <div className={classNameContentCenter}>{contentCenter}</div>
      <div className={classNames("flex-shrink-0", classNameContentRight)}>{contentRight}</div>
    </div>
  );
};

export default Toolbar;
