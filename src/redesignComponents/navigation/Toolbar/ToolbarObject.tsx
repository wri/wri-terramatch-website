import classNames from "classnames";
import { FC } from "react";

import Breadcrumb from "../Breadcrumbs/Breadcrumb";
import Toolbar from "./Toolbar";
import { ToolbarObjectProps } from "./ToolBar.type";

const ToolbarObject: FC<ToolbarObjectProps> = ({ breadcrumbs, suffix, className, classNameSuffix }) => {
  return (
    <Toolbar
      className={classNames("px-5 py-2", className)}
      contentLeft={<Breadcrumb {...breadcrumbs} />}
      contentRight={
        suffix != null ? <div className={"flex flex-row-reverse items-center gap-3"}>{suffix}</div> : undefined
      }
      classNameContentRight={classNameSuffix}
    />
  );
};

export default ToolbarObject;
