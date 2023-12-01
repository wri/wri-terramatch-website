import { Typography } from "@mui/material";
import { AppBar as RaAppBar, AppBarProps, defaultTheme, RaThemeOptions, ToggleThemeButton } from "react-admin";

const darkTheme: RaThemeOptions = {
  palette: { mode: "dark" }
};

export const AppBar = (props: AppBarProps) => (
  <RaAppBar {...props}>
    <Typography flex="1" variant="h6" id="react-admin-title"></Typography>
    <ToggleThemeButton lightTheme={defaultTheme} darkTheme={darkTheme} />
  </RaAppBar>
);
