import { useT } from "@transifex/react";
import classNames from "classnames";
import { useRouter } from "next/router";
import React, { useContext, useEffect, useState } from "react";
import { When } from "react-if";

import Dropdown from "@/components/elements/Inputs/Dropdown/Dropdown";
import { VARIANT_DROPDOWN_HEADER } from "@/components/elements/Inputs/Dropdown/DropdownVariant";
import FilterSearchBox from "@/components/elements/TableFilters/Inputs/FilterSearchBox";
import { FILTER_SEARCH_BOX_AIRTABLE } from "@/components/elements/TableFilters/Inputs/FilterSearchBoxVariants";
import Text from "@/components/elements/Text/Text";
import { useGetV2DashboardCountries } from "@/generated/apiComponents";
import { OptionValue } from "@/types/common";

import { RefContext } from "../context/ScrollContext.provider";
import BlurContainer from "./BlurContainer";

const HeaderDashboard = () => {
  const sharedRef = useContext(RefContext);
  const t = useT();
  const router = useRouter();
  const [isHeaderCollapsed, setIsHeaderCollapsed] = useState(true);
  const isProjectInsights = router.pathname.includes("dashboard/project-insights");
  const isProjectList = router.pathname === "/dashboard/project-list";
  const isProjectPage = router.pathname === "dashboard/project";
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
    queryParams: {}
  });

  const dropdwonCountryOptions =
    dashboardCountries?.data?.map((country: any) => ({
      title: country.data.label,
      value: country.id,
      prefix: <img src={country.data.icon} alt="flag" className="h-4" />
    })) || [];
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
  const handleChangeCountry = (value: OptionValue[]) => {
    setFilterValues(prevValues => ({
      ...prevValues,
      dropdown3: value
    }));
    const selectedCountry = dashboardCountries?.data.find((country: { id: OptionValue }) => {
      if (country.id === value[0]) {
        return country;
      }
    });

    router.push(`/dashboard/country/${selectedCountry?.country_slug}`);
  };

  const getHeaderTitle = () => {
    if (isProjectInsights) {
      return "Project Insights";
    }
    if (isProjectList) {
      return "Project List";
    }
    return "TerraMatch Insights";
  };

  return (
    <header className="flex bg-dashboardHeader bg-cover px-4 pb-4 pt-5">
      <div className={classNames("flex flex-1", { "gap-5": !isHeaderCollapsed, "flex-wrap gap-3": isHeaderCollapsed })}>
        <Text
          variant={"text-28-bold"}
          className={classNames("whitespace-nowrap text-white", { "w-full": isHeaderCollapsed })}
        >
          {t(getHeaderTitle())}
        </Text>
        <div className="flex items-center gap-3">
          <BlurContainer isCollapse={isHeaderCollapsed} disabled={isProjectPage}>
            <Dropdown
              showClear
              showSelectAll
              multiSelect
              prefix={
                <Text variant="text-14-light" className="leading-none">
                  {t("Programme:")}
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
              optionClassName="hover:bg-grey-200"
            />
          </BlurContainer>
          <BlurContainer isCollapse={isHeaderCollapsed} disabled={isProjectPage}>
            <Dropdown
              showClear
              showSelectAll
              multiSelect
              prefix={
                <Text variant="text-14-light" className="leading-none">
                  {t("Landscape:")}
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
              optionClassName="hover:bg-grey-200"
            />
          </BlurContainer>
          <BlurContainer isCollapse={isHeaderCollapsed} className="min-w-[190px]" disabled={isProjectPage}>
            <Dropdown
              showClear
              prefix={
                <Text variant="text-14-light" className="leading-none">
                  {t("Country:")}
                </Text>
              }
              inputVariant="text-14-semibold"
              variant={VARIANT_DROPDOWN_HEADER}
              placeholder="Global"
              value={filterValues.dropdown3}
              onChange={value => {
                handleChangeCountry(value);
              }}
              onClear={() => router.push(`/dashboard/country`)}
              options={dropdwonCountryOptions}
              optionClassName="hover:bg-grey-200"
            />
          </BlurContainer>
          <BlurContainer isCollapse={isHeaderCollapsed} disabled={isProjectPage}>
            <Dropdown
              showSelectAll
              showClear
              prefix={
                <Text variant="text-14-light" className="leading-none">
                  {t("Organization:")}
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
              optionClassName="hover:bg-grey-200"
            />
          </BlurContainer>
          <button
            className="text-14-semibold p-1 text-white disabled:opacity-70"
            onClick={resetValues}
            disabled={isProjectPage}
          >
            {t("Clear Filters")}
          </button>
        </div>
      </div>
      <div className="flex flex-col items-end justify-end gap-3">
        <When condition={isProjectList}>
          <BlurContainer isCollapse={isHeaderCollapsed}>
            <FilterSearchBox onChange={() => {}} placeholder="Search" variant={FILTER_SEARCH_BOX_AIRTABLE} />
          </BlurContainer>
        </When>
      </div>
    </header>
  );
};

export default HeaderDashboard;
