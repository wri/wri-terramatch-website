import { Box, Grid } from "@mui/material";
import { ReactNode } from "react";

import { FieldType } from "@/components/extensive/WizardForm/types";

import FieldView from "./FieldView";

interface IChangeBoxProps {
  oldView: ReactNode;
  newView: ReactNode;
  type: FieldType;
}

const ChangeBox = ({ oldView, newView, type }: IChangeBoxProps) => (
  <Box sx={{ flexGrow: 1 }}>
    <Grid container spacing={2}>
      <Grid item xs={6}>
        Old Value:
        <FieldView type={type} value={oldView} />
      </Grid>
      <Grid item xs={6}>
        New Value:
        <FieldView type={type} value={newView} />
      </Grid>
    </Grid>
  </Box>
);

export default ChangeBox;
