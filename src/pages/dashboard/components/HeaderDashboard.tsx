import useMediaQuery from "@mui/material/useMediaQuery";
import { T, useT } from "@transifex/react";
import classNames from "classnames";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import { When } from "react-if";

import Button from "@/components/elements/Button/Button";
import {
  VARIANT_DROPDOWN_COLLAPSE,
  VARIANT_DROPDOWN_HEADER
} from "@/components/elements/Inputs/Dropdown/DropdownVariant";
import Menu from "@/components/elements/Menu/Menu";
import { MENU_ITEM_VARIANT_SEARCH } from "@/components/elements/MenuItem/MenuItemVariant";
import FilterSearchBox from "@/components/elements/TableFilters/Inputs/FilterSearchBox";
import { FILTER_SEARCH_BOX_AIRTABLE } from "@/components/elements/TableFilters/Inputs/FilterSearchBoxVariants";
import Text from "@/components/elements/Text/Text";
import ToolTip from "@/components/elements/Tooltip/Tooltip";
import Icon, { IconNames } from "@/components/extensive/Icon/Icon";
import { CountriesProps } from "@/components/generic/Layout/DashboardLayout";
import { useDashboardContext } from "@/context/dashboard.provider";
import { useLoading } from "@/context/loaderAdmin.provider";
import { useGetV2DashboardFrameworks } from "@/generated/apiComponents";
import { useOnMount } from "@/hooks/useOnMount";
import { OptionValue } from "@/types/common";

import { useDashboardData } from "../hooks/useDashboardData";
import BlurContainer from "./BlurContainer";
import ResponsiveDropdownContainer from "./ResponsiveDropdownContainer";

export const PROJECT_INSIGHTS_SECTION_TOOLTIP =
  "In 2025, the Project Insights section will contain additional analyses showing trends and insights.";

interface HeaderDashboardProps {
  isProjectInsightsPage?: boolean;
  isProjectListPage?: boolean;
  isProjectPage?: boolean;
  isHomepage?: boolean;
  dashboardCountries: CountriesProps[];
  defaultSelectedCountry: CountriesProps | undefined;
  setSelectedCountry: (country?: CountriesProps) => void;
}

const HeaderDashboard = (props: HeaderDashboardProps) => {
  const {
    isProjectInsightsPage,
    isProjectListPage,
    isProjectPage,
    isHomepage,
    dashboardCountries,
    setSelectedCountry
  } = props;
  const t = useT();
  const router = useRouter();
  const { showLoader, hideLoader } = useLoading();
  const { filters, setFilters, setSearchTerm, searchTerm, setFrameworks, setDashboardCountries, lastUpdatedAt } =
    useDashboardContext();
  const { activeProjects } = useDashboardData(filters);
  const [isFiltersOpen, setIsFiltersOpen] = useState(false);
  const isMobile = useMediaQuery("(max-width: 1200px)");

  const optionsCohort = [
    { title: "Top 100", value: "terrafund" },
    { title: "Landscapes", value: "terrafund-landscapes" }
  ];

  const optionMenu = activeProjects
    ? activeProjects?.map(
        (
          item: {
            project_country: string;
            organisation: string;
            name: string;
            programme: string;
            uuid: string;
            country_slug: string;
          },
          index: number
        ) => ({
          id: index,
          country: item?.project_country,
          organization: item?.organisation,
          project: item?.name,
          programme: item?.programme,
          uuid: item?.uuid,
          country_slug: item?.country_slug
        })
      )
    : [];

  const organizationOptions = [
    {
      title: t("Non-profit Organization"),
      value: "non-profit-organization"
    },
    {
      title: t("Enterprise Organization"),
      value: "for-profit-organization"
    }
  ];

  const landscapeOption = [
    { title: "Greater Rift Valley of Kenya", value: "Greater Rift Valley of Kenya" },
    { title: "Ghana Cocoa Belt ", value: "Ghana Cocoa Belt" },
    { title: "Lake Kivu & Rusizi River Basin ", value: "Lake Kivu & Rusizi River Basin" }
  ];

  const { data: frameworks } = useGetV2DashboardFrameworks({
    queryParams: {}
  });

  useEffect(() => {
    if (frameworks) {
      setFrameworks(frameworks);
    }
  }, [frameworks, setFrameworks]);

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
      organizations: [],
      cohort: "",
      uuid: ""
    });
    setSearchTerm("");
  };

  useEffect(() => {
    const query: any = {
      ...router.query,
      programmes: filters.programmes,
      landscapes: filters.landscapes,
      country: filters.country?.country_slug || undefined,
      organizations: filters.organizations,
      cohort: filters.cohort,
      uuid: filters.uuid
    };

    Object.keys(query).forEach(key => !query[key]?.length && delete query[key]);

    const currentQuery = JSON.stringify(router.query);
    const newQuery = JSON.stringify(query);

    if (currentQuery !== newQuery) {
      router.push(
        {
          pathname: router.pathname,
          query: query
        },
        undefined,
        { shallow: true }
      );
    }
  }, [
    router,
    filters.programmes,
    filters.landscapes,
    filters.country?.country_slug,
    filters.organizations,
    filters.cohort,
    filters.uuid
  ]);

  useOnMount(() => {
    setDashboardCountries(dashboardCountries);
    const { programmes, landscapes, country, organizations, cohort, uuid } = router.query;
    const newFilters = {
      programmes: programmes ? (Array.isArray(programmes) ? programmes : [programmes]) : [],
      landscapes: landscapes ? (Array.isArray(landscapes) ? landscapes : [landscapes]) : [],
      country: country ? dashboardCountries.find(c => c.country_slug === country) || filters.country : filters.country,
      organizations: organizations ? (Array.isArray(organizations) ? organizations : [organizations]) : [],
      cohort: Array.isArray(cohort) ? cohort[0] : cohort ?? "",
      uuid: (uuid as string) || ""
    };

    setFilters(newFilters);
  });

  const handleChange = (selectName: string, value: OptionValue[]) => {
    setFilters(prevValues => ({
      ...prevValues,
      uuid: "",
      [selectName]: value
    }));
  };

  const handleChangeCountry = (value: OptionValue[]) => {
    const selectedCountry = dashboardCountries?.find((country: CountriesProps) => country.id === value[0]);

    if (selectedCountry) {
      setSelectedCountry(selectedCountry);
      setFilters(prevValues => ({
        ...prevValues,
        uuid: "",
        country: selectedCountry
      }));
    } else {
      setFilters(prevValues => ({
        ...prevValues,
        uuid: "",
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
      return <T _str="Project Insights" _tags="dash" />;
    }
    if (isProjectListPage) {
      return <T _str="Project List" _tags="dash" />;
    }
    if (isHomepage) {
      return <T _str="Learn More" _tags="dash" />;
    }
    return <T _str="TerraMatch Dashboards" _tags="dash" />;
  };

  return (
    <header
      className={classNames("flex max-w-full justify-between gap-3 bg-dashboardHeader bg-cover", {
        "px-4 pb-4 pt-5": !isHomepage,
        "bg-center px-14 py-10": isHomepage
      })}
    >
      <div className="flex max-w-full flex-1 flex-wrap gap-3">
        <Text variant={"text-28-bold"} className="relative w-full whitespace-nowrap text-white">
          {getHeaderTitle()}
          <When condition={isProjectInsightsPage}>
            <ToolTip
              title={""}
              content={t(PROJECT_INSIGHTS_SECTION_TOOLTIP)}
              placement="top"
              width="w-64 lg:w-96"
              trigger="click"
              className="ml-1 !inline-block !whitespace-normal"
            >
              <Icon name={IconNames.INFO_CIRCLE} className="h-3.5 w-3.5 text-white lg:h-5 lg:w-5" />
            </ToolTip>
          </When>
          <Text variant="text-18" as={"span"} className="absolute top-1 text-white lg:top-2">
            &nbsp;&nbsp;{t("BETA")}
          </Text>
        </Text>
        <Text variant="text-16" className="absolute top-3 right-3 text-white ">
          {t("Last Updated on {date}", {
            date: lastUpdatedAt ? new Date(lastUpdatedAt).toISOString().split("T")[0] : ""
          })}
        </Text>
        <When condition={!isProjectInsightsPage && !isHomepage}>
          <BlurContainer className="hidden mobile:block">
            <button
              onClick={() => {
                setIsFiltersOpen(true);
              }}
              className="relative z-[4] flex w-full items-center justify-center gap-2 py-2"
            >
              <Icon name={IconNames.FILTER} className="h-3 w-3 text-white" />
              <Text variant="text-14-bold" className="text-white">
                Filters
              </Text>
            </button>
          </BlurContainer>
          <div
            className={classNames(
              "flexl-col flex w-full max-w-full transform items-start gap-3 overflow-x-clip overflow-y-visible transition-all duration-300 small:items-center mobile:absolute mobile:left-0 mobile:z-30 mobile:h-full mobile:flex-col mobile:bg-white",
              {
                "mobile:top-[60px] mobile:h-[calc(100vh-60px)]": isFiltersOpen,
                "mobile:-top-full": !isFiltersOpen
              }
            )}
          >
            <div className="hidden w-full items-center justify-center py-4 mobile:flex">
              <Text variant={"text-16-bold"} className="text-black">
                Filters
              </Text>
              <button
                onClick={() => {
                  setIsFiltersOpen(false);
                }}
              >
                <Icon name={IconNames.CLEAR} className="absolute right-0 mr-2 h-4 w-4 text-black" />
              </button>
            </div>
            <div className="flex max-w-[90%] flex-wrap items-center gap-3 small:flex-nowrap mobile:w-full mobile:max-w-full mobile:flex-col">
              <ResponsiveDropdownContainer
                className="min-w-[196px] lg:min-w-[216px] wide:min-w-[236px]"
                disabled={isProjectPage}
                isMobile={isMobile}
                showClear
                showSelectAll
                showLabelAsMultiple
                multiSelect
                prefix={<Text variant="text-14-light">{t("Landscape")}:</Text>}
                inputVariant="text-14-semibold"
                variant={isMobile ? VARIANT_DROPDOWN_COLLAPSE : VARIANT_DROPDOWN_HEADER}
                placeholder={t("All Data")}
                multipleText={t("Multiple Landscapes")}
                value={filters.landscapes}
                onChange={value => {
                  handleChange("landscapes", value);
                }}
                onClear={() => {
                  handleChange("landscapes", []);
                }}
                options={landscapeOption}
                optionClassName="hover:bg-grey-200"
                containerClassName="z-[4] w-full"
              />
              <ResponsiveDropdownContainer
                className="min-w-[175px] lg:min-w-[195px] wide:min-w-[215px]"
                disabled={isProjectPage}
                isMobile={isMobile}
                showClear
                prefix={<Text variant="text-14-light">{t("Country")}:</Text>}
                inputVariant="text-14-semibold"
                variant={isMobile ? VARIANT_DROPDOWN_COLLAPSE : VARIANT_DROPDOWN_HEADER}
                placeholder={t("All Data")}
                value={filters.country?.id ? [filters.country.id] : undefined}
                onChange={value => {
                  handleChangeCountry(value);
                }}
                onClear={() => {
                  setSelectedCountry(undefined);
                  setFilters(prevValues => ({
                    ...prevValues,
                    uuid: "",
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
                  prefix: (
                    <img src={country.data.icon} alt="flag" className="h-4 w-[26.5px] min-w-[26.5px] object-cover" />
                  )
                }))}
                optionClassName="hover:bg-grey-200"
                containerClassName="z-[3] w-full"
              />
              <ResponsiveDropdownContainer
                className="min-w-[242px] lg:min-w-[272px] wide:min-w-[292px]"
                disabled={isProjectPage}
                isMobile={isMobile}
                showSelectAll
                showLabelAsMultiple
                showClear
                prefix={<Text variant="text-14-light">{t("Organization Type")}:</Text>}
                inputVariant="text-14-semibold"
                multiSelect
                variant={isMobile ? VARIANT_DROPDOWN_COLLAPSE : VARIANT_DROPDOWN_HEADER}
                placeholder={t("All Data")}
                multipleText={t("Multiple Organizations Types")}
                value={filters.organizations}
                onChange={value => {
                  handleChange("organizations", value);
                }}
                onClear={() => {
                  handleChange("organizations", []);
                }}
                options={organizationOptions}
                optionClassName="hover:bg-grey-200"
                containerClassName="z-[2] w-full"
              />
              <ResponsiveDropdownContainer
                className="min-w-[200px] lg:min-w-[220px] wide:min-w-[240px]"
                disabled={isProjectPage}
                isMobile={isMobile}
                showClear
                prefix={<Text variant="text-14-light">{t("Cohort")}:</Text>}
                inputVariant="text-14-semibold"
                variant={isMobile ? VARIANT_DROPDOWN_COLLAPSE : VARIANT_DROPDOWN_HEADER}
                placeholder={t("All Data")}
                value={filters.cohort ? [filters.cohort] : []}
                onChange={(value: OptionValue[]) => {
                  return setFilters(prevValues => ({
                    ...prevValues,
                    uuid: "",
                    cohort: value[0] as string
                  }));
                }}
                onClear={() => {
                  setFilters(prevValues => ({
                    ...prevValues,
                    uuid: "",
                    cohort: ""
                  }));
                }}
                options={optionsCohort}
                optionClassName="hover:bg-grey-200"
                containerClassName="z-[5] w-full"
              />
            </div>
            <div className="flex h-full w-auto flex-col items-start justify-between gap-3 lg:min-w-[287px] small:w-[-webkit-fill-available] small:flex-row small:items-center mobile:w-full mobile:justify-end mobile:p-4">
              <When condition={isMobile}>
                <Button
                  variant="primary"
                  className="text-14-semibold min-h-10 w-full whitespace-nowrap p-1 py-2 text-white disabled:opacity-70"
                  onClick={resetValues}
                  disabled={isProjectPage}
                >
                  {t("Clear Filters")}
                </Button>
              </When>
              <When condition={!isMobile}>
                <button
                  className="text-14-semibold min-h-10 whitespace-nowrap p-1 text-white disabled:opacity-70"
                  onClick={resetValues}
                  disabled={isProjectPage}
                >
                  {t("Clear Filters")}
                </button>
              </When>
              <When condition={isProjectListPage}>
                <Menu
                  classNameContentMenu="max-w-[196px] lg:max-w-[287px] w-inherit max-h-[252px]"
                  menuItemVariant={MENU_ITEM_VARIANT_SEARCH}
                  disabled={searchTerm.length < 3 || !optionMenu.length}
                  isDefaultOpen={true}
                  menu={optionMenu.map(
                    (option: {
                      id: number;
                      country: string;
                      organization: string;
                      project: string;
                      programme: string;
                      uuid: string;
                      country_slug: string;
                    }) => ({
                      id: option.id,
                      render: () => (
                        <span
                          className="leading-[normal] tracking-[normal]"
                          onClick={async () => {
                            showLoader();
                            setFilters(prevValues => ({
                              ...prevValues,
                              uuid: option.uuid as string,
                              country:
                                dashboardCountries?.find(country => country.country_slug === option?.country_slug) ||
                                prevValues.country
                            }));
                            router.push({
                              pathname: "/dashboard",
                              query: { ...filters, country: option?.country_slug, uuid: option.uuid as string }
                            });
                            hideLoader();
                          }}
                        >
                          <Text variant="text-12-semibold" className="text-darkCustom" as="span">
                            {t(option.country)},&nbsp;{t(option.organization)},&nbsp;
                          </Text>
                          <Text variant="text-12-light" className="text-darkCustom" as="span">
                            {t(option.project)},&nbsp;{t(option.programme)}
                          </Text>
                        </span>
                      )
                    })
                  )}
                >
                  <When condition={!isMobile}>
                    <BlurContainer className="lg:min-w-[287px]">
                      <FilterSearchBox
                        onChange={e => setSearchTerm(e)}
                        placeholder="Search"
                        variant={FILTER_SEARCH_BOX_AIRTABLE}
                        value={searchTerm}
                      />
                    </BlurContainer>
                  </When>
                </Menu>
              </When>
            </div>
          </div>
        </When>
      </div>
    </header>
  );
};

export default HeaderDashboard;
