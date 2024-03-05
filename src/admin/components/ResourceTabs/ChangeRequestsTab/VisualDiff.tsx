import { Box, Grid, Typography } from "@mui/material";
import { green, red } from "@mui/material/colors";
import { Change, diffWords } from "diff";
import { ReactNode, useMemo } from "react";

export interface IVisualDiffProps {
  currentValue: string;
  newValue: string;
}

type NodeTuple = [ReactNode[], ReactNode[]];

const getStyle = (change: Change) => ({
  color: change.added ? green[800] : change.removed ? red[800] : null,
  textDecoration: change.removed ? "line-through" : null
});

const DiffSpan = ({ key, change }: { key: string; change: Change }) => (
  <Typography key={key} component="span" sx={getStyle(change)}>
    {change.value}
  </Typography>
);

function reduceDiffView([oldView, newView]: NodeTuple, change: Change, index: number): NodeTuple {
  const key = `${change.value}-${index}`;
  if (!change.added) oldView = [...oldView, <DiffSpan key={key} change={change} />];
  if (!change.removed) newView = [...newView, <DiffSpan key={key} change={change} />];

  return [oldView, newView];
}

export default function VisualDiff({ currentValue, newValue }: IVisualDiffProps) {
  const [oldView, newView] = useMemo<NodeTuple>(
    () => diffWords(currentValue, newValue).reduce(reduceDiffView, [[], []]),
    [currentValue, newValue]
  );

  return (
    <Box sx={{ flexGrow: 1 }}>
      <Grid container spacing={2}>
        <Grid item xs={6}>
          Old Value:
          <Typography variant="body2">{oldView}</Typography>
        </Grid>
        <Grid item xs={6}>
          New Value:
          <Typography variant="body2">{newView}</Typography>
        </Grid>
      </Grid>
    </Box>
  );
}
