import { useT } from "@transifex/react";
import classNames from "classnames";
import React from "react";
import { When } from "react-if";

import Dropdown from "@/components/elements/Inputs/Dropdown/Dropdown";
import { VARIANT_DROPDOWN_HEADER } from "@/components/elements/Inputs/Dropdown/DropdownVariant";
import Menu from "@/components/elements/Menu/Menu";
import { MENU_ITEM_VARIANT_SEARCH } from "@/components/elements/MenuItem/MenuItemVariant";
import FilterSearchBox from "@/components/elements/TableFilters/Inputs/FilterSearchBox";
import { FILTER_SEARCH_BOX_AIRTABLE } from "@/components/elements/TableFilters/Inputs/FilterSearchBoxVariants";
import Text from "@/components/elements/Text/Text";
import { CountriesProps } from "@/components/generic/Layout/DashboardLayout";
import { useDashboardContext } from "@/context/dashboard.provider";
import { OptionValue } from "@/types/common";

import BlurContainer from "./BlurContainer";

interface HeaderDashboardProps {
  isProjectInsightsPage?: boolean;
  isProjectListPage?: boolean;
  isProjectPage?: boolean;
  dashboardCountries: CountriesProps[];
  defaultSelectedCountry: CountriesProps | undefined;
  toSelectedCountry: (country_slug?: string) => void;
  setSelectedCountry: (country?: CountriesProps) => void;
}

const HeaderDashboard = (props: HeaderDashboardProps) => {
  const {
    isProjectInsightsPage,
    isProjectListPage,
    isProjectPage,
    toSelectedCountry,
    dashboardCountries,
    setSelectedCountry
  } = props;
  const t = useT();

  const optionMenu = [
    {
      id: "1",
      country: "Angola",
      organization: "Annette Ward (3SC)",
      project: "Goshen Global Vision",
      programme: "TerraFund Top100"
    },
    {
      id: "2",
      country: "Kenya",
      organization: "Annette Ward (3SC)",
      project: "Goshen Global Vision",
      programme: "TerraFund Top100"
    },
    {
      id: "3",
      country: "Ghana",
      organization: "Annette Ward (3SC)",
      project: "Goshen Global Vision",
      programme: "TerraFund Top100"
    },
    {
      id: "4",
      country: "Congo",
      organization: "Annette Ward (3SC)",
      project: "Goshen Global Vision",
      programme: "TerraFund Top100"
    },
    {
      id: "5",
      country: "Central African Republic",
      organization: "Annette Ward (3SC)",
      project: "Goshen Global Vision",
      programme: "TerraFund Top100"
    },
    {
      id: "6",
      country: "Cameroon",
      organization: "Annette Ward (3SC)",
      project: "Goshen Global Vision",
      programme: "TerraFund Top100"
    },
    {
      id: "7",

      country: "Åland Islands",
      organization: "Annette Ward (3SC)",
      project: "Goshen Global Vision",
      programme: "TerraFund Top100"
    }
  ];
  const { filters, setFilters } = useDashboardContext();

  const organizationOptions = [
    {
      title: "Non-profit organization",
      value: "non-profit-organization"
    },
    {
      title: "For-profit organization",
      value: "for-profit-organization"
    }
  ];
  const programmeOptions = [
    {
      title: "Top 100",
      value: "terrafund"
    },
    {
      title: "PPC",
      value: "ppc"
    },
    {
      title: "Enterprise",
      value: "enterprise"
    },
    {
      title: "HBF",
      value: "hbf"
    },
    {
      title: "Terrafund Landscapes",
      value: "terrafund-landscapes"
    }
  ];
  const landscapeOption = [
    { title: "Kenya’s Greater Rift Valley", value: "kenya_greater_rift_valley" },
    { title: "Ghana Cocoa Belt ", value: "ghana_cocoa_belt" },
    { title: "Lake Kivu and Rusizi River Basin ", value: "lake_kivu_rusizi_river_basin" }
  ];

  const resetValues = () => {
    setFilters({
      programmes: [],
      landscapes: [],
      country: {
        country_slug: "",
        id: 0,
        data: {
          label: "",
          icon: ""
        }
      },
      organizations: []
    });
  };

  const handleChange = (selectName: string, value: OptionValue[]) => {
    setFilters(prevValues => ({
      ...prevValues,
      [selectName]: value
    }));
  };

  const handleChangeCountry = (value: OptionValue[]) => {
    const selectedCountry = dashboardCountries?.find((country: CountriesProps) => country.id === value[0]);

    if (selectedCountry) {
      toSelectedCountry(selectedCountry.country_slug);
      setSelectedCountry(selectedCountry);
      setFilters(prevValues => ({
        ...prevValues,
        country: selectedCountry
      }));
    } else {
      setFilters(prevValues => ({
        ...prevValues,
        country: {
          country_slug: "",
          id: 0,
          data: {
            label: "",
            icon: ""
          }
        }
      }));
    }
  };

  const getHeaderTitle = () => {
    if (isProjectInsightsPage) {
      return "Project Insights";
    }
    if (isProjectListPage) {
      return "Project List";
    }
    return "TerraMatch Insights";
  };

  return (
    <header className="flex max-w-full justify-between gap-3 bg-dashboardHeader bg-cover px-4 pb-4 pt-5">
      <div
        className={classNames("flex flex-1 flex-wrap gap-3", {
          "max-w-[calc(100%_-_260px)] lg:max-w-[calc(100%_-_295px)]": isProjectListPage,
          "max-w-full": !isProjectListPage
        })}
      >
        <Text variant={"text-28-bold"} className="w-full whitespace-nowrap text-white">
          {t(getHeaderTitle())}
        </Text>
        <When condition={!isProjectInsightsPage}>
          <div className="flexl-col flex max-w-full items-start gap-3 overflow-x-clip overflow-y-visible small:items-center">
            <div className="flex max-w-full flex-1 flex-wrap items-center gap-3 small:flex-nowrap">
              <BlurContainer disabled={isProjectPage}>
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
                  value={filters.programmes}
                  placeholder="Programme"
                  onChange={(value: OptionValue[]) => {
                    handleChange("programmes", value);
                  }}
                  onClear={() => {
                    handleChange("programmes", []);
                  }}
                  options={programmeOptions}
                  optionClassName="hover:bg-grey-200"
                />
              </BlurContainer>
              <BlurContainer disabled={isProjectPage}>
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
                  placeholder="Landscape"
                  value={filters.landscapes}
                  onChange={value => {
                    handleChange("landscapes", value);
                  }}
                  onClear={() => {
                    handleChange("landscapes", []);
                  }}
                  options={landscapeOption}
                  optionClassName="hover:bg-grey-200"
                />
              </BlurContainer>
              <BlurContainer className="min-w-[190px]" disabled={isProjectPage}>
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
                  value={filters.country?.id ? [filters.country.id] : undefined}
                  onChange={value => {
                    handleChangeCountry(value);
                  }}
                  onClear={() => {
                    toSelectedCountry();
                    setSelectedCountry(undefined);
                    setFilters(prevValues => ({
                      ...prevValues,
                      country: {
                        country_slug: "",
                        id: 0,
                        data: {
                          label: "",
                          icon: ""
                        }
                      }
                    }));
                  }}
                  options={dashboardCountries.map((country: CountriesProps) => ({
                    title: country.data.label,
                    value: country.id,
                    prefix: <img src={country.data.icon} alt="flag" className="h-4" />
                  }))}
                  optionClassName="hover:bg-grey-200"
                />
              </BlurContainer>
              <BlurContainer disabled={isProjectPage}>
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
                  placeholder="Organization"
                  value={filters.organizations}
                  onChange={value => {
                    handleChange("organizations", value);
                  }}
                  onClear={() => {
                    handleChange("organizations", []);
                  }}
                  options={organizationOptions}
                  optionClassName="hover:bg-grey-200"
                />
              </BlurContainer>
            </div>
            <button
              className="text-14-semibold whitespace-nowrap p-1 text-white disabled:opacity-70"
              onClick={resetValues}
              disabled={isProjectPage}
            >
              {t("Clear Filters")}
            </button>
          </div>
        </When>
      </div>
      <div className="flex flex-col items-end justify-end gap-3 lg:min-w-[287px]">
        <When condition={isProjectListPage}>
          <Menu
            classNameContentMenu="max-w-[196px] lg:max-w-[287px] w-inherit h-[252px]"
            menuItemVariant={MENU_ITEM_VARIANT_SEARCH}
            menu={optionMenu.map(option => ({
              id: option.id,
              render: () => (
                <span className="leading-[normal] tracking-[normal]">
                  <Text variant="text-12-semibold" className="text-darkCustom" as="span">
                    {t(option.country)},&nbsp;{t(option.organization)},&nbsp;
                  </Text>
                  <Text variant="text-12-light" className="text-darkCustom" as="span">
                    {t(option.project)},&nbsp;{t(option.programme)}
                  </Text>
                </span>
              )
            }))}
          >
            <BlurContainer className="lg:min-w-[287px]">
              <FilterSearchBox onChange={() => {}} placeholder="Search" variant={FILTER_SEARCH_BOX_AIRTABLE} />
            </BlurContainer>
          </Menu>
        </When>
      </div>
    </header>
  );
};

export default HeaderDashboard;
