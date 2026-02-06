import { FC, Fragment } from "react";

import Breadcrumb from "../Breadcrumbs/Breadcrumb";
import Toolbar from "./Toolbar";
import { ToolbarObjectProps } from "./ToolBar.type";

const ToolbarObject: FC<ToolbarObjectProps> = ({ breadcrumbs, slots }) => {
  return (
    <Toolbar
      className="px-5 py-2"
      contentLeft={<Breadcrumb {...breadcrumbs} />}
      contentRight={
        <div className="flex flex-row-reverse items-center gap-3">
          {slots.map((slot, index) => (
            <Fragment key={`${slot.title}-${index}`}>
              <div className="border-theme-neutral-700 bg-theme-neutral-200 flex flex-col rounded border border-dashed p-1">
                <p className="text-10-bold text-theme-neutral-800 leading-[normal]">{slot.title}</p>
                <p className="text-10 text-theme-neutral-700 leading-[normal]">{slot.description}</p>
              </div>
              {index < slots.length - 1 && <div className="bg-theme-neutral-300 h-3.5 w-[1px]" />}
            </Fragment>
          ))}
        </div>
      }
    />
  );
};

export default ToolbarObject;
