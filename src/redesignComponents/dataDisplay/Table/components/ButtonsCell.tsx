import { useT } from "@transifex/react";

import Button from "@/redesignComponents/Forms/Actions/Button/Button";

interface ButtonsCellProps {
  labels: string[];
  onButtonClick?: (buttonIndex: number, row: any, index: number) => void;
  row: any;
  index: number;
  hoverColor?: string;
  defaultColor?: string;
}

export const ButtonsCell = ({ labels, onButtonClick, row, index }: ButtonsCellProps) => {
  const t = useT();

  return (
    <div className="flex gap-2">
      {labels.map((label, buttonIndex) => (
        <Button
          key={buttonIndex}
          onClick={() => onButtonClick?.(buttonIndex, row, index)}
          className="!text-12-semibold bg-white px-2 py-1.5"
          variant="secondary"
        >
          {t(label)}
        </Button>
      ))}
    </div>
  );
};
