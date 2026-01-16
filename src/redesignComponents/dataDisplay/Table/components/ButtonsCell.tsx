import React from "react";

import Button from "@/redesignComponents/Forms/Actions/Button/Button";

interface ButtonsCellProps {
  labels: string[];
  onButtonClick?: (buttonIndex: number, row: any, index: number) => void;
  row: any;
  index: number;
}

export const ButtonsCell = ({ labels, onButtonClick, row, index }: ButtonsCellProps) => {
  return (
    <div className="flex gap-2">
      {labels.map((label, buttonIndex) => (
        <Button
          key={buttonIndex}
          onClick={() => onButtonClick?.(buttonIndex, row, index)}
          className="!text-12-semibold px-2 py-1.5"
          onMouseEnter={e => {
            e.currentTarget.style.backgroundColor = "#f3f4f6";
          }}
          onMouseLeave={e => {
            e.currentTarget.style.backgroundColor = "#f9fafb";
          }}
          variant="secondary"
        >
          {label}
        </Button>
      ))}
    </div>
  );
};
