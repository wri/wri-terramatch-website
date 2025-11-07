import { Box, Grid } from "@mui/material";
import { green, red } from "@mui/material/colors";
import { Change, diffWords } from "diff";
import { ReactNode } from "react";

import { FieldInputType } from "@/components/extensive/WizardForm/types";

import FieldView from "./FieldView";

interface IDisturbanceReportEntriesVisualDiffProps {
  currentValue: ReactNode;
  newValue: ReactNode;
  inputType: FieldInputType;
}

const getStyle = (change: Change) => ({
  color: change.added ? green[800] : change.removed ? red[800] : undefined,
  textDecoration: change.removed ? "line-through" : undefined
});

const DisturbanceReportEntriesVisualDiff = ({
  currentValue,
  newValue,
  inputType
}: IDisturbanceReportEntriesVisualDiffProps) => {
  if (typeof currentValue !== "string" || typeof newValue !== "string") {
    return (
      <Box sx={{ flexGrow: 1 }}>
        <Grid container spacing={2}>
          <Grid item xs={6}>
            Old Value:
            <FieldView inputType={inputType} value={currentValue} />
          </Grid>
          <Grid item xs={6}>
            New Value:
            <FieldView inputType={inputType} value={newValue} />
          </Grid>
        </Grid>
      </Box>
    );
  }

  const normalizedCurrentValue = (currentValue || "").trim() === "-" ? "" : currentValue || "";
  const normalizedNewValue = (newValue || "").trim() === "-" ? "" : newValue || "";

  const diff = diffWords(normalizedCurrentValue, normalizedNewValue);

  const oldView = diff
    .filter(change => !change.added)
    .map(change => {
      const style = getStyle(change);
      return `<span style="color: ${style.color || "inherit"}; text-decoration: ${style.textDecoration || "none"};">${
        change.value
      }</span>`;
    })
    .join("");

  const newView = diff
    .filter(change => !change.removed)
    .map(change => {
      const style = getStyle(change);
      return `<span style="color: ${style.color || "inherit"}; text-decoration: ${style.textDecoration || "none"};">${
        change.value
      }</span>`;
    })
    .join("");

  return (
    <Box sx={{ flexGrow: 1 }}>
      <Grid container spacing={2}>
        <Grid item xs={6}>
          Old Value:
          <FieldView inputType={inputType} value={oldView} />
        </Grid>
        <Grid item xs={6}>
          New Value:
          <FieldView inputType={inputType} value={newView} />
        </Grid>
      </Grid>
    </Box>
  );
};

export default DisturbanceReportEntriesVisualDiff;
