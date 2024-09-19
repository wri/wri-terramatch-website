import { DetailedHTMLProps, HTMLAttributes, PropsWithChildren } from "react";

import Button from "@/components/elements/Button/Button";
import Text from "@/components/elements/Text/Text";

import Sidebar from "../Sidebar/Sidebar";

interface DashboardLayoutProps extends DetailedHTMLProps<HTMLAttributes<HTMLDivElement>, HTMLDivElement> {
  isLoggedIn?: boolean;
}

const DashboardLayout = (props: PropsWithChildren<DashboardLayoutProps>) => {
  return (
    <div className="flex min-h-screen w-full">
      <Sidebar />
      <main className={`flex flex-[1_1_0] flex-col ${props.className}`}>
        <header className="bg-dashboardHeader bg-cover px-8 pt-4 pb-3">
          <div className="flex items-center justify-between">
            <Text variant={"text-28-bold"} className="text-white">
              TerraMatch Insights
            </Text>
            <Button variant="sky-page-admin">Export</Button>
          </div>
          <div>filters</div>
        </header>
        {props.children}
      </main>
    </div>
  );
};

export default DashboardLayout;
