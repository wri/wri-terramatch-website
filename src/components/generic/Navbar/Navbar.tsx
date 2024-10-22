import { useMediaQuery } from "@mui/material";
import classNames from "classnames";
import { useEffect } from "react";
import { Else, If, Then, When } from "react-if";

import IconButton from "@/components/elements/IconButton/IconButton";
import Icon, { IconNames } from "@/components/extensive/Icon/Icon";
import { useNavbarContext } from "@/context/navbar.provider";

import Container from "../Layout/Container";
import NavbarContent from "./NavbarContent";

export interface NavbarProps {
  isLoggedIn?: boolean;
}

const Navbar = (props: NavbarProps): JSX.Element => {
  const { isOpen, setIsOpen, linksDisabled } = useNavbarContext();

  const isLg = useMediaQuery("(min-width:1024px)");

  useEffect(() => {
    if (isLg) {
      setIsOpen?.(false);
    }
  }, [isLg, setIsOpen]);

  return (
    <header
      className={classNames(
        "sticky top-0 z-50 flex w-full flex-col justify-center bg-white px-4 sm:flex-row",
        isOpen && "border-none"
      )}
    >
      <Container className="flex h-[70px] items-center justify-between">
        <a href={"/home"} title="Homepage" aria-label="Homepage">
          <Icon name={IconNames.WRI_LOGO} width={108} height={30} className="min-w-[108px]" />
        </a>
        <When condition={!isOpen}>
          <NavbarContent className="hidden items-center sm:flex sm:gap-4 lg:gap-8" isLoggedIn={props.isLoggedIn} />
        </When>
        <If condition={isOpen}>
          <Then>
            <IconButton
              iconProps={{
                name: IconNames.X_CIRCLE,
                width: 30,
                height: 30,
                className: "block sm:hidden fill-black"
              }}
              disabled={linksDisabled}
              onClick={() => setIsOpen?.(e => !e)}
            />
          </Then>
          <Else>
            <IconButton
              className="tour-menu-button block sm:hidden"
              iconProps={{ name: IconNames.MENU, width: 28, height: 16, className: "fill-black" }}
              disabled={linksDisabled}
              onClick={() => setIsOpen?.(e => !e)}
            />
          </Else>
        </If>
      </Container>
      <When condition={isOpen}>
        <NavbarContent
          className={classNames(
            "relative flex flex-col items-center justify-center gap-4 sm:hidden",
            isOpen && "h-[calc(100vh-70px)]"
          )}
          isLoggedIn={props.isLoggedIn}
          handleClose={() => setIsOpen?.(false)}
        />
      </When>
    </header>
  );
};

export default Navbar;
