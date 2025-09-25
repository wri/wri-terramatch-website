import { AppBar as RaAppBar, AppBarProps, Link, Logout, MenuItemLink, UserMenu } from "react-admin";

import Icon, { IconNames } from "@/components/extensive/Icon/Icon";
import { logout } from "@/generated/v3/utils";
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
      <Logout
        onClick={() => {
          logout();
          window.location.href = "/auth/login";
        }}
      />
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
