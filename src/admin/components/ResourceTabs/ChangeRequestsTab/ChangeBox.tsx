import { Box, Grid } from "@mui/material";
import { FC, ReactNode } from "react";

import { FieldInputType } from "@/components/extensive/WizardForm/types";

import FieldView from "./FieldView";

interface IChangeBoxProps {
  oldView: ReactNode;
  newView: ReactNode;
  inputType: FieldInputType;
}

const ChangeBox: FC<IChangeBoxProps> = ({ oldView, newView, inputType }) => (
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

export default ChangeBox;
