import { FC } from "react";

import Breadcrumb from "../Breadcrumbs/Breadcrumb";
import Toolbar from "./Toolbar";
import { ToolbarObjectProps } from "./ToolBar.type";

const ToolbarObject: FC<ToolbarObjectProps> = ({ breadcrumbs, suffix }) => {
  return (
    <Toolbar
      className="px-5 py-2"
      contentLeft={<Breadcrumb {...breadcrumbs} />}
      contentRight={suffix ? <div className="flex flex-row-reverse items-center gap-3">{suffix}</div> : undefined}
    />
  );
};

export default ToolbarObject;
