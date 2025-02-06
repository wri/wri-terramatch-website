import { AppBar as RaAppBar, AppBarProps, Link } from "react-admin";

export const AppBar = (props: AppBarProps) => (
  <RaAppBar {...props}>
    <div className="logo-header">
      <Link to="/" title="Homepage" aria-label="Homepage">
        <div className="ic-header" />
      </Link>
    </div>
  </RaAppBar>
);
