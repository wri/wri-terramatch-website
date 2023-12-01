import React, { useContext, useMemo, useState } from "react";

type NavbarContextType = {
  linksDisabled: boolean;
  isOpen: boolean;
  setIsOpen?: React.Dispatch<React.SetStateAction<boolean>>;
  setLinksDisabled?: React.Dispatch<React.SetStateAction<boolean>>;
};

/* eslint-disable */
export const NavbarContext = React.createContext<NavbarContextType>({
  linksDisabled: false,
  isOpen: false
});
/* eslint-enable */

type NavbarProviderProps = {
  children: React.ReactNode;
};

const NavbarProvider = ({ children }: NavbarProviderProps) => {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [linksDisabled, setLinksDisabled] = useState<boolean>(false);

  // All exported values go here
  const value = useMemo(
    () => ({
      setIsOpen,
      setLinksDisabled,
      isOpen,
      linksDisabled
    }),
    [isOpen, linksDisabled]
  );

  return <NavbarContext.Provider value={value}>{children}</NavbarContext.Provider>;
};

export const useNavbarContext = () => useContext(NavbarContext);

export default NavbarProvider;
