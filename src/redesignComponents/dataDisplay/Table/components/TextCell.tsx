import React from "react";

interface TextCellProps {
  value: string;
}

export const TextCell = ({ value }: TextCellProps) => {
  return <p className="text-theme-neutral-800">{value || "Label"}</p>;
};
