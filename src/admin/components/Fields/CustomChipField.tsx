import classNames from "classnames";
import React from "react";
import { FunctionField, FunctionFieldProps } from "react-admin";

const STATUS_CLASSNAME_MAP: { [key: string]: string } = {
  Approved: "bg-green-30 text-green-100",
  Rejected: "bg-error-400 text-error-600",
  "Under Review": "bg-yellow-300 text-yellow-700",
  "Awaiting approval": "bg-yellow-300 text-yellow-700",
  "Planting in progress": "bg-yellow-300 text-yellow-700",
  Draft: "bg-yellow-300 text-yellow-700",
  Started: "bg-gray-300", // Draft Color
  Unknown: "",
  "Needs more information": "bg-yellow-300 text-yellow-700"
};

const CustomChipField: React.FC<Omit<FunctionFieldProps, "render">> = props => (
  <FunctionField
    {...props}
    render={(record: any) => (
      <div
        className={classNames(
          "w-fit-content whitespace-nowrap rounded-[3px] px-2 font-medium",
          STATUS_CLASSNAME_MAP[record.readable_status]
        )}
      >
        {record.readable_status == "Started" ? "Draft" : record.readable_status}
      </div>
    )}
  />
);

export default CustomChipField;
