import { useT } from "@transifex/react";
import classNames from "classnames";
import { useRouter } from "next/router";
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
  const t = useT();
  const router = useRouter();
  const [isHeaderCollapsed, setIsHeaderCollapsed] = useState(true);
  const isProjectPage = router.pathname.includes("dashboard/project");
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
    if (value[0] === "global") {
      router.push(`/dashboard/programme`);
      return;
    }
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

  return (
    <header className="flex bg-dashboardHeader bg-cover px-4 pt-5 pb-4">
      <div className={classNames("flex flex-1", { "gap-5": !isHeaderCollapsed, "flex-wrap": isHeaderCollapsed })}>
        <Text
          variant={"text-28-bold"}
          className={classNames("whitespace-nowrap text-white", { "w-full": isHeaderCollapsed })}
        >
          {t("TerraMatch Insights")}
        </Text>
        <div className="flex items-center gap-3">
          <BlurContainer isCollapse={isHeaderCollapsed} disabled={isProjectPage}>
            <Dropdown
              showClear
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
            />
          </BlurContainer>
          <BlurContainer isCollapse={isHeaderCollapsed} disabled={isProjectPage}>
            <Dropdown
              showClear
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
              options={dropdwonCountryOptions}
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
      <div className="relative h-fit">
        <div className="absolute h-full w-full rounded bg-white bg-opacity-20 backdrop-blur-md" />
        <button className="relative z-10 px-4 py-2 font-bold leading-normal text-white">{t("Export")}</button>
      </div>
    </header>
  );
};

export default HeaderDashboard;
