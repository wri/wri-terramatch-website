import { DetailedHTMLProps, HTMLAttributes, PropsWithChildren } from "react";

import Navbar from "@/components/generic/Navbar/Navbar";

interface MainLayoutProps extends DetailedHTMLProps<HTMLAttributes<HTMLDivElement>, HTMLDivElement> {
  isLoggedIn?: boolean;
}

const MainLayout = (props: PropsWithChildren<MainLayoutProps>) => {
  return (
    <div className="flex min-h-screen w-full flex-col">
      <Navbar isLoggedIn={props.isLoggedIn} />
      <main className={`flex flex-[1_1_0] flex-col ${props.className}`}>{props.children}</main>
    </div>
  );
};

export default MainLayout;
