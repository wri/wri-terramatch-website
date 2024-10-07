import { DetailedHTMLProps, HTMLAttributes, PropsWithChildren } from "react";

import HeaderDashboard from "@/pages/dashboard/components/HeaderDashboard";

import Sidebar from "../Sidebar/Sidebar";

interface DashboardLayoutProps extends DetailedHTMLProps<HTMLAttributes<HTMLDivElement>, HTMLDivElement> {
  isLoggedIn?: boolean;
}

const DashboardLayout = (props: PropsWithChildren<DashboardLayoutProps>) => {
  return (
    <div className="flex max-h-screen min-h-screen w-full bg-neutral-70">
      <Sidebar />
      <main className={`flex flex-[1_1_0] flex-col overflow-hidden ${props.className}`}>
        <HeaderDashboard />
        {props.children}
      </main>
    </div>
  );
};

export default DashboardLayout;
