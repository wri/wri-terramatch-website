import { Typography } from "@mui/material";

export interface IVisualDiffProps {
  currentValue: string;
  newValue: string;
}

export default function VisualDiff({ currentValue, newValue }: IVisualDiffProps) {
  return (
    <>
      <p className="mb-2">
        New Value: <Typography variant="body2">{newValue}</Typography>
      </p>
      <p className="mb-2">
        Old Value: <Typography variant="body2">{currentValue}</Typography>
      </p>
    </>
  );
}
