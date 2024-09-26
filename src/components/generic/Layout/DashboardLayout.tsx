import classNames from "classnames";
import { DetailedHTMLProps, HTMLAttributes, PropsWithChildren, useState } from "react";

import Dropdown from "@/components/elements/Inputs/Dropdown/Dropdown";
import { VARIANT_DROPDOWN_HEADER } from "@/components/elements/Inputs/Dropdown/DropdownVariant";
import Text from "@/components/elements/Text/Text";
import { OptionValue } from "@/types/common";

import Sidebar from "../Sidebar/Sidebar";

interface DashboardLayoutProps extends DetailedHTMLProps<HTMLAttributes<HTMLDivElement>, HTMLDivElement> {
  isLoggedIn?: boolean;
}

const DashboardLayout = (props: PropsWithChildren<DashboardLayoutProps>) => {
  const [isHeaderCollapsed, setIsHeaderCollapsed] = useState(false);
  const dropdwonOptions = [
    {
      title: "Tree Planting",
      value: "1"
    },
    {
      title: "Direct Seeding",
      value: "2"
    },
    {
      title: "Natural Regeneration",
      value: "3"
    }
  ];

  const [filterValues, setFilterValues] = useState<{
    dropdown1: OptionValue[];
    dropdown2: OptionValue[];
    dropdown3: OptionValue[];
    dropdown4: OptionValue[];
  }>({
    dropdown1: [],
    dropdown2: [],
    dropdown3: [],
    dropdown4: []
  });

  const resetValues = () => {
    setFilterValues({
      dropdown1: [],
      dropdown2: [],
      dropdown3: [],
      dropdown4: []
    });
  };

  const handleChange = (selectName: string, value: OptionValue[]) => {
    setFilterValues(prevValues => ({
      ...prevValues,
      [selectName]: value
    }));
  };

  return (
    <div className="flex max-h-screen min-h-screen w-full">
      <Sidebar />
      <main className={`flex flex-[1_1_0] flex-col ${props.className}`}>
        <header className="flex bg-dashboardHeader bg-cover px-4 pt-5 pb-4">
          <div className={classNames("flex flex-1", { "gap-5": !isHeaderCollapsed, "flex-wrap": isHeaderCollapsed })}>
            <Text
              variant={"text-28-bold"}
              className={classNames("whitespace-nowrap text-white", { "w-full": isHeaderCollapsed })}
            >
              TerraMatch Insights
            </Text>
            <div className="flex items-center gap-3">
              <div className="relative max-w-[192px]  rounded-lg border border-[#989E97]">
                <div className="absolute h-full w-full rounded-lg bg-white bg-opacity-20 backdrop-blur-md" />
                <Dropdown
                  prefix={
                    <Text variant="text-14-light" className="leading-none">
                      Programme:
                    </Text>
                  }
                  inputVariant="text-14-semibold"
                  variant={VARIANT_DROPDOWN_HEADER}
                  value={filterValues.dropdown1}
                  placeholder="Top100"
                  onChange={value => {
                    handleChange("dropdown1", value);
                  }}
                  options={dropdwonOptions}
                />
              </div>
              <div className="relative max-w-[192px]  rounded-lg border border-[#989E97]">
                <div className="absolute h-full w-full rounded-lg bg-white bg-opacity-20 backdrop-blur-md" />
                <Dropdown
                  prefix={
                    <Text variant="text-14-light" className="leading-none">
                      Landscape:
                    </Text>
                  }
                  inputVariant="text-14-semibold"
                  variant={VARIANT_DROPDOWN_HEADER}
                  placeholder="Top100"
                  value={filterValues.dropdown2}
                  onChange={value => {
                    handleChange("dropdown2", value);
                  }}
                  options={dropdwonOptions}
                />
              </div>
              <div className="relative max-w-[192px]  rounded-lg border border-[#989E97]">
                <div className="absolute h-full w-full rounded-lg bg-white bg-opacity-20 backdrop-blur-md" />
                <Dropdown
                  prefix={
                    <Text variant="text-14-light" className="leading-none">
                      Country:
                    </Text>
                  }
                  inputVariant="text-14-semibold"
                  variant={VARIANT_DROPDOWN_HEADER}
                  placeholder="Global"
                  value={filterValues.dropdown3}
                  onChange={value => {
                    handleChange("dropdown3", value);
                  }}
                  options={dropdwonOptions}
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
                  value={filterValues.dropdown4}
                  onChange={value => {
                    handleChange("dropdown4", value);
                  }}
                  options={dropdwonOptions}
                />
              </div>
              <button className="text-14-semibold p-1 text-white" onClick={resetValues}>
                Clear Filters
              </button>
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
