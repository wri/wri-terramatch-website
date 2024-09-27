import { DetailedHTMLProps, HTMLAttributes, PropsWithChildren } from "react";

import HeaderDashboard from "@/pages/dashboards/components/HeaderDashboard";
import RefProvider from "@/pages/dashboards/context/ScrollContext.provider";

import Sidebar from "../Sidebar/Sidebar";

interface DashboardLayoutProps extends DetailedHTMLProps<HTMLAttributes<HTMLDivElement>, HTMLDivElement> {
  isLoggedIn?: boolean;
}

const DashboardLayout = (props: PropsWithChildren<DashboardLayoutProps>) => {
  return (
    <RefProvider>
      <div className="flex max-h-screen min-h-screen w-full">
        <Sidebar />
        <main className={`flex flex-[1_1_0] flex-col ${props.className}`}>
          <HeaderDashboard />
          {props.children}
        </main>
      </div>
    </RefProvider>
  );
};

export default DashboardLayout;
