import classNames from "classnames";
import { DetailedHTMLProps, HTMLAttributes, PropsWithChildren, useState } from "react";

import Dropdown from "@/components/elements/Inputs/Dropdown/Dropdown";
import { VARIANT_DROPDOWN_HEADER } from "@/components/elements/Inputs/Dropdown/DropdownVariant";
import Text from "@/components/elements/Text/Text";
import Icon, { IconNames } from "@/components/extensive/Icon/Icon";
import { OptionValue } from "@/types/common";

import Sidebar from "../Sidebar/Sidebar";

interface DashboardLayoutProps extends DetailedHTMLProps<HTMLAttributes<HTMLDivElement>, HTMLDivElement> {
  isLoggedIn?: boolean;
}

const DashboardLayout = (props: PropsWithChildren<DashboardLayoutProps>) => {
  const [isHeaderCollapsed, setIsHeaderCollapsed] = useState(false);
  return (
    <div className="flex min-h-screen w-full">
      <Sidebar />
      <main className={`flex flex-[1_1_0] flex-col ${props.className}`}>
        <header className="flex bg-dashboardHeader bg-cover px-4 pt-5 pb-4">
          <div className={classNames("flex flex-1", { "gap-5": !isHeaderCollapsed, "flex-wrap": isHeaderCollapsed })}>
            <Text variant={"text-28-bold"} className={classNames("text-white", { "w-full": isHeaderCollapsed })}>
              TerraMatch Insights
            </Text>
            <div className="flex items-center gap-3">
              <div className="relative rounded-lg border border-[#989E97]">
                <div className="absolute h-full w-full rounded-lg bg-white bg-opacity-20 backdrop-blur-md" />
                <Dropdown
                  prefix={
                    <div className="flex items-center gap-1">
                      <Icon name={IconNames.FRAMEWORK_PROGRAMME} className="w-5" />
                      <Text variant="text-14-light" className="leading-none">
                        Programme
                      </Text>
                    </div>
                  }
                  inputVariant="text-14-semibold"
                  containerClassName="relative z-10"
                  className="gap-2 text-white"
                  placeholder="Top 100"
                  options={[]}
                  onChange={function (value: OptionValue[]): void {
                    throw new Error("Function not implemented.");
                  }}
                />
              </div>
              <div className="relative rounded-lg border border-[#989E97]">
                <div className="absolute h-full w-full rounded-lg bg-white bg-opacity-20 backdrop-blur-md" />
                <Dropdown
                  prefix={
                    <Text variant="text-14-light" className="leading-none">
                      Sub-Region:
                    </Text>
                  }
                  inputVariant="text-14-semibold"
                  containerClassName="relative z-10"
                  className="gap-2 text-white"
                  placeholder="Top 100"
                  options={[]}
                  onChange={function (value: OptionValue[]): void {
                    throw new Error("Function not implemented.");
                  }}
                />
              </div>
              <div className="relative rounded-lg border border-[#989E97]">
                <div className="absolute h-full w-full rounded-lg bg-white bg-opacity-20 backdrop-blur-md" />
                <Dropdown
                  prefix={
                    <Text variant="text-14-light" className="leading-none">
                      Country:
                    </Text>
                  }
                  placeholder="Global"
                  options={[]}
                  containerClassName="relative z-10"
                  onChange={function (value: OptionValue[]): void {
                    throw new Error("Function not implemented.");
                  }}
                />
              </div>
              <div className="relative max-w-[192px] rounded-lg border border-[#989E97]">
                <div className="absolute h-full w-full rounded-lg bg-white bg-opacity-20 backdrop-blur-md" />
                <Dropdown
                  prefix={
                    <Text variant="text-14-light" className="leading-none">
                      Organization:
                    </Text>
                  }
                  inputVariant="text-14-semibold"
                  multiSelect
                  variant={VARIANT_DROPDOWN_HEADER}
                  placeholder="Private"
                  onChange={value => {
                    console.log(value);
                  }}
                  options={[
                    {
                      title: "Aerobic Agroforestry",
                      value: "1"
                    },
                    {
                      title: "Mexico_FONCET_ANP_FRAILESCAN",
                      value: "2"
                    },
                    {
                      title: "Philippines_CI_Philippines",
                      value: "3"
                    },
                    {
                      title: "Portugal_ReForest_Action_(Proenca-a-Nova)",
                      value: "4"
                    },
                    {
                      title: "Spain_ReForest_Action_(Palencia)",
                      value: "5"
                    }
                  ]}
                />
              </div>
              <button className="text-14-semibold p-1 text-white">Clear Filters</button>
            </div>
          </div>
          <div className="relative h-fit">
            <div className="absolute h-full w-full rounded bg-white bg-opacity-20 backdrop-blur-md" />
            <button
              className="relative z-10 px-4 py-2 font-bold leading-normal text-white"
              onClick={() => setIsHeaderCollapsed(!isHeaderCollapsed)}
            >
              Export
            </button>
          </div>
        </header>
        {props.children}
      </main>
    </div>
  );
};

export default DashboardLayout;
