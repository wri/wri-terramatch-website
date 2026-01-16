import React from "react";

interface MiscellaneousCellProps {
  placeholder?: string;
}

export const MiscellaneousCell = ({ placeholder }: MiscellaneousCellProps) => {
  return (
    <div className="flex flex-col gap-0 rounded-md border border-dashed border-theme-neutral-700 bg-theme-neutral-200 p-1">
      <span className="text-12-bold text-theme-neutral-800">{placeholder || "Slot one"}</span>
      <span className="text-12-light leading-[normal] text-theme-neutral-700">Add button or input</span>
    </div>
  );
};
