import { AppBar as RaAppBar, AppBarProps, Link, Logout, MenuItemLink, UserMenu } from "react-admin";

import Icon, { IconNames } from "@/components/extensive/Icon/Icon";
export const AppBar = (props: AppBarProps) => {
  const CustomUserMenu = (props: any) => (
    <UserMenu {...props}>
      <MenuItemLink
        to="#"
        primaryText="Dashboard"
        leftIcon={<Icon name={IconNames.IC_SWITCH} className="p-0.5" />}
        onClick={() => {
          window.location.href = "/dashboard";
        }}
      />
      <Logout />
    </UserMenu>
  );

  return (
    <RaAppBar {...props} userMenu={<CustomUserMenu />}>
      <div className="logo-header">
        <Link to="/" title="Homepage" aria-label="Homepage">
          <div className="ic-header" />
        </Link>
      </div>
    </RaAppBar>
  );
};
