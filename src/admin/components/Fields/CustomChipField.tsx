import classNames from "classnames";
import React from "react";

const STATUS_CLASSNAME_MAP: { [key: string]: string } = {
  Approved: "bg-green-30 text-green-100",
  Rejected: "bg-yellow-300 text-yellow-700",
  "Under Review": "bg-yellow-300 text-yellow-700",
  "Awaiting approval": "bg-blue-200 text-blue",
  "Awaiting Review": "bg-blue-200 text-blue",
  "Planting In Progress": "bg-yellow-300 text-yellow-700",
  "Restoration in progress": "bg-green-30 text-green-100",
  Draft: "bg-grey-200 text-grey-500",
  Started: "bg-grey-200 text-grey-500",
  Unknown: "bg-grey-200 text-grey-500",
  "Needs more information": "bg-tertiary-50 text-tertiary-650",
  "More info requested": "bg-tertiary-50 text-tertiary-650",
  "No Update": "bg-grey-200 text-grey-500"
};

const CustomChipField = ({ label = "" }: { label: string | undefined }) => {
  return (
    <div
      className={classNames(
        "text-14 w-fit-content whitespace-nowrap rounded-[3px] px-2 capitalize",
        STATUS_CLASSNAME_MAP[label] ?? "bg-grey-200 text-grey-500"
      )}
    >
      {label == "Unknown" ? "Started" : label}
    </div>
  );
};

export default CustomChipField;
