import { DetailedHTMLProps, HTMLAttributes, PropsWithChildren } from "react";

import Navbar from "@/components/generic/Navbar/Navbar";

interface MainLayoutProps extends DetailedHTMLProps<HTMLAttributes<HTMLDivElement>, HTMLDivElement> {}

const MainLayout = (props: PropsWithChildren<MainLayoutProps>) => {
  return (
    <div className="flex min-h-screen w-full flex-col">
      <Navbar />
      <main className={`flex flex-[1_1_0] flex-col ${props.className}`}>{props.children}</main>
    </div>
  );
};

export default MainLayout;
