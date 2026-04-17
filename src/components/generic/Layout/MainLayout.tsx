import { DetailedHTMLProps, HTMLAttributes, PropsWithChildren } from "react";

import Navbar from "@/components/generic/Navbar/Navbar";

interface MainLayoutProps extends DetailedHTMLProps<HTMLAttributes<HTMLDivElement>, HTMLDivElement> {}

const MainLayout = (props: PropsWithChildren<MainLayoutProps>) => {
  return (
    <div className="flex h-screen w-full flex-col">
      <Navbar />
      <main className={`flex min-h-0 flex-[1_1_0] flex-col overflow-auto ${props.className}`}>{props.children}</main>
    </div>
  );
};

export default MainLayout;
