import { Box, Grid, Typography } from "@mui/material";
import { ReactNode } from "react";

interface IChangeBoxProps {
  oldView: ReactNode;
  newView: ReactNode;
  small?: boolean;
}

const ChangeBox = ({ oldView, newView, small = false }: IChangeBoxProps) => (
  <Box sx={{ flexGrow: 1 }}>
    <Grid container spacing={2}>
      <Grid item xs={small ? 2 : 6}>
        Old Value:
        <Typography variant="body2">{oldView}</Typography>
      </Grid>
      <Grid item xs={small ? 2 : 6}>
        New Value:
        <Typography variant="body2">{newView}</Typography>
      </Grid>
    </Grid>
  </Box>
);

export default ChangeBox;
