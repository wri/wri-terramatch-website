import { Button, Typography } from "@mui/material";
import React from "react";
import { AppBar as RaAppBar, AppBarProps, defaultTheme, RaThemeOptions, ToggleThemeButton } from "react-admin";

const darkTheme: RaThemeOptions = {
  palette: { mode: "dark" }
};

export const AppBar = (props: AppBarProps) => (
  <RaAppBar {...props}>
    <Typography flex="1" variant="h6" id="react-admin-title"></Typography>

    {/* To remove when all parts of admin panel migrated to v2 */}
    <a href="v1/admin">
      <Button variant="contained" color="error">
        Old Panel
      </Button>
    </a>
    <ToggleThemeButton lightTheme={defaultTheme} darkTheme={darkTheme} />
  </RaAppBar>
);
