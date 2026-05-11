import { useMediaQuery } from "@mui/material";
import { useT } from "@transifex/react";
import classNames from "classnames";
import { FC, useEffect, useState } from "react";

import IconButton from "@/components/elements/IconButton/IconButton";
import Icon, { IconNames } from "@/components/extensive/Icon/Icon";
import { useNavbarContext } from "@/context/navbar.provider";
import InlineMessage from "@/redesignComponents/status/InlineMessage/InlineMessage";

import Container from "../Layout/Container";
import NavbarContent from "./NavbarContent";

const Navbar: FC = () => {
  const t = useT();
  const { isOpen, setIsOpen, linksDisabled } = useNavbarContext();
  const [isOpenMessage, setIsOpenMessage] = useState(true);

  const isLg = useMediaQuery("(min-width:1024px)");

  useEffect(() => {
    if (isLg) {
      setIsOpen?.(false);
    }
  }, [isLg, setIsOpen]);

  return (
    <>
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
          {isOpen ? (
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
          ) : (
            <>
              <NavbarContent className="hidden items-center sm:flex sm:gap-4 lg:gap-8" />
              <IconButton
                className="tour-menu-button block sm:hidden"
                iconProps={{ name: IconNames.MENU, width: 28, height: 16, className: "fill-black" }}
                disabled={linksDisabled}
                onClick={() => setIsOpen?.(e => !e)}
              />
            </>
          )}
        </Container>
        {isOpen && (
          <NavbarContent
            className={classNames(
              "relative flex flex-col items-center justify-center gap-4 sm:hidden",
              isOpen && "h-[calc(100vh-70px)]"
            )}
            handleClose={() => setIsOpen?.(false)}
          />
        )}
      </header>
      {isOpenMessage && (
        <InlineMessage
          className="!w-full"
          variant="warning"
          label={t("We are Improving TerraMatch")}
          caption={t(
            "You may notice some pages look different while we update the design to make your experience better. "
          )}
          size="full-width"
          actionLabel={t("Close")}
          onActionClick={() => setIsOpenMessage(false)}
          isButtonRight={true}
        />
      )}
    </>
  );
};

export default Navbar;
