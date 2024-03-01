import { Typography } from "@mui/material";
import { green, red } from "@mui/material/colors";
import { diffWords } from "diff";
import { useMemo } from "react";

export interface IVisualDiffProps {
  currentValue: string;
  newValue: string;
}

export default function VisualDiff({ currentValue, newValue }: IVisualDiffProps) {
  const diffs = useMemo(
    () =>
      diffWords(currentValue, newValue).map(({ added, removed, value }, index) => {
        const color = added ? green[500] : removed ? red[500] : null;
        return (
          <Typography key={`${value}-${index}`} component="span" sx={{ color }}>
            {value}
          </Typography>
        );
      }),
    [currentValue, newValue]
  );

  return (
    <p className="mb-2">
      Updated Value:
      <Typography variant="body2">{diffs}</Typography>
    </p>
  );
}
