import { FC } from "react";

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
            <>
              <div
                key={slot.title}
                className="flex flex-col rounded border border-dashed border-theme-neutral-700 bg-theme-neutral-200 p-1"
              >
                <p className="text-10-bold leading-[normal] text-theme-neutral-800">{slot.title}</p>
                <p className="text-10 leading-[normal] text-theme-neutral-700">{slot.description}</p>
              </div>
              {index < slots.length - 1 && <div className="h-3.5 w-[1px] bg-theme-neutral-300" />}
            </>
          ))}
        </div>
      }
    />
  );
};

export default ToolbarObject;
