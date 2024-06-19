import classNames from "classnames";
import React from "react";
import { FunctionField, FunctionFieldProps } from "react-admin";

const STATUS_CLASSNAME_MAP: { [key: string]: string } = {
  Approved: "bg-green-30 text-green-100",
  Rejected: "bg-yellow-300 text-yellow-700",
  "Under Review": "bg-yellow-300 text-yellow-700",
  "Awaiting approval": "bg-yellow-300 text-yellow-700",
  "Planting in progress": "bg-yellow-300 text-yellow-700",
  Draft: "bg-grey-200 text-grey-500",
  Started: "bg-gray-300 text-grey-500",
  Unknown: "bg-grey-200 text-grey-500",
  "Needs more information": "bg-yellow-300 text-yellow-700"
};

const CustomChipField: React.FC<Omit<FunctionFieldProps, "render">> = props => (
  <FunctionField
    {...props}
    render={(record: any) => (
      <div
        className={classNames(
          "text-14 w-fit-content whitespace-nowrap rounded-[3px] px-2 capitalize",
          STATUS_CLASSNAME_MAP[record.readable_status] || "bg-grey-200 text-grey-500"
        )}
      >
        {record.readable_status == "Started" ? "Draft" : record.readable_status}
      </div>
    )}
  />
);

export default CustomChipField;
