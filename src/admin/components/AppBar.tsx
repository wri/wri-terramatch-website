import { Typography } from "@mui/material";
import { AppBar as RaAppBar, AppBarProps, Link } from "react-admin";

export const AppBar = (props: AppBarProps) => (
  <RaAppBar {...props}>
    <div className="logo-header">
      <Link to="/">
        <div className="ic-header" />
      </Link>
    </div>

    <Typography flex="1" variant="h6" id="react-admin-title"></Typography>
  </RaAppBar>
);
