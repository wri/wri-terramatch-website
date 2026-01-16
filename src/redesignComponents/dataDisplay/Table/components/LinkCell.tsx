import React from "react";

interface LinkCellProps {
  value: string;
  href?: string;
  truncate?: boolean;
}

export const LinkCell = ({ value, href }: LinkCellProps) => {
  return (
    <a href={href || "#"} className="truncate text-theme-primary-900 underline decoration-dotted underline-offset-4">
      {value}
    </a>
  );
};
