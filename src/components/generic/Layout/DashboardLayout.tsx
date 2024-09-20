import { DetailedHTMLProps, HTMLAttributes, PropsWithChildren } from "react";

import Dropdown from "@/components/elements/Inputs/Dropdown/Dropdown";
import Text from "@/components/elements/Text/Text";
import { OptionValue } from "@/types/common";

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
            <div className="relative">
              <div className="absolute h-full w-full rounded bg-white bg-opacity-20 backdrop-blur-md" />
              <button className="relative z-10 px-4 py-2 font-bold leading-normal text-white">Export</button>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="relative rounded-lg border border-[#989E97]">
              <div className="absolute h-full w-full rounded-lg bg-white bg-opacity-20 backdrop-blur-md" />
              <Dropdown
                containerClassName="relative z-10"
                className="text-white"
                placeholder="Framework"
                options={[]}
                onChange={function (value: OptionValue[]): void {
                  throw new Error("Function not implemented.");
                }}
              />
            </div>
            <div className="relative rounded-lg border border-[#989E97]">
              <div className="absolute h-full w-full rounded-lg bg-white bg-opacity-20 backdrop-blur-md" />
              <Dropdown
                containerClassName="relative z-10"
                className="text-white"
                placeholder="Landscape"
                options={[]}
                onChange={function (value: OptionValue[]): void {
                  throw new Error("Function not implemented.");
                }}
              />
            </div>
            <div className="relative rounded-lg border border-[#989E97]">
              <div className="absolute h-full w-full rounded-lg bg-white bg-opacity-20 backdrop-blur-md" />
              <Dropdown
                containerClassName="relative z-10"
                className="text-white"
                placeholder="Country"
                options={[]}
                onChange={function (value: OptionValue[]): void {
                  throw new Error("Function not implemented.");
                }}
              />
            </div>
            <div className="relative rounded-lg border border-[#989E97]">
              <div className="absolute h-full w-full rounded-lg bg-white bg-opacity-20 backdrop-blur-md" />
              <Dropdown
                containerClassName="relative z-10"
                className="text-white"
                placeholder="Organization"
                options={[]}
                onChange={function (value: OptionValue[]): void {
                  throw new Error("Function not implemented.");
                }}
              />
            </div>
            <div className="relative -scale-x-150">
              <div className="absolute h-full w-full rounded bg-white bg-opacity-20 backdrop-blur-md" />
              <button className="text-8 relative z-10 p-1 text-white">X</button>
            </div>
          </div>
        </header>
        {props.children}
      </main>
    </div>
  );
};

export default DashboardLayout;
