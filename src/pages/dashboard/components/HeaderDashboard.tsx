import classNames from "classnames";
import React, { useContext, useEffect, useState } from "react";

import Dropdown from "@/components/elements/Inputs/Dropdown/Dropdown";
import { VARIANT_DROPDOWN_HEADER } from "@/components/elements/Inputs/Dropdown/DropdownVariant";
import Text from "@/components/elements/Text/Text";
import { useGetV2DashboardCountries } from "@/generated/apiComponents";
import { OptionValue } from "@/types/common";

import { RefContext } from "../context/ScrollContext.provider";
import BlurContainer from "./BlurContainer";

const HeaderDashboard = () => {
  const sharedRef = useContext(RefContext);
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

  const { data: dashboardCountries } = useGetV2DashboardCountries<any>({
    queryParams: { country: "all" }
  });

  const dropdwonCountryOptions = [
    {
      title: "Global",
      value: null,
      meta: undefined
    },
    ...(dashboardCountries?.data?.map((country: any) => ({
      title: country.data.label,
      value: country.id,
      meta: <img src={country.data.icon} alt="flag" className="h-4" />
    })) || [])
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

  useEffect(() => {
    const scrollElement = sharedRef?.current;
    const handleScroll = () => {
      if (scrollElement) {
        const currentScrollY = scrollElement.scrollTop;
        if (currentScrollY === 0) {
          setIsHeaderCollapsed(true);
        } else {
          setIsHeaderCollapsed(false);
        }
      }
    };
    scrollElement?.addEventListener("scroll", handleScroll);

    return () => {
      scrollElement?.removeEventListener("scroll", handleScroll);
    };
  }, [sharedRef]);

  return (
    <header className="flex bg-dashboardHeader bg-cover px-4 pb-4 pt-5">
      <div className={classNames("flex flex-1", { "gap-5": !isHeaderCollapsed, "flex-wrap": isHeaderCollapsed })}>
        <Text
          variant={"text-28-bold"}
          className={classNames("whitespace-nowrap text-white", { "w-full": isHeaderCollapsed })}
        >
          TerraMatch Insights
        </Text>
        <div className="flex items-center gap-3">
          <BlurContainer isCollapse={isHeaderCollapsed}>
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
              onChange={(value: OptionValue[]) => {
                handleChange("dropdown1", value);
              }}
              options={dropdwonOptions}
            />
          </BlurContainer>
          <BlurContainer isCollapse={isHeaderCollapsed}>
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
          </BlurContainer>
          <BlurContainer isCollapse={isHeaderCollapsed}>
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
              options={dropdwonCountryOptions}
            />
          </BlurContainer>
          <BlurContainer isCollapse={isHeaderCollapsed}>
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
          </BlurContainer>
          <button className="text-14-semibold p-1 text-white" onClick={resetValues}>
            Clear Filters
          </button>
        </div>
      </div>
      <div className="relative h-fit">
        <div className="absolute h-full w-full rounded bg-white bg-opacity-20 backdrop-blur-md" />
        <button className="relative z-10 px-4 py-2 font-bold leading-normal text-white">Export</button>
      </div>
    </header>
  );
};

export default HeaderDashboard;
