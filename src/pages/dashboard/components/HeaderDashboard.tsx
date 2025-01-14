import { useT } from "@transifex/react";
import classNames from "classnames";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import { When } from "react-if";

import Dropdown from "@/components/elements/Inputs/Dropdown/Dropdown";
import { VARIANT_DROPDOWN_HEADER } from "@/components/elements/Inputs/Dropdown/DropdownVariant";
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
import { Option, OptionValue } from "@/types/common";

import { PROJECT_INSIGHTS_SECTION_TOOLTIP } from "../constants/tooltips";
import { useDashboardData } from "../hooks/useDashboardData";
import BlurContainer from "./BlurContainer";

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
  const [programmeOptions, setProgrammeOptions] = useState<Option[]>([]);
  const t = useT();
  const router = useRouter();
  const { showLoader, hideLoader } = useLoading();
  const { filters, setFilters, setSearchTerm, searchTerm, setFrameworks, setDashboardCountries, lastUpdatedAt } =
    useDashboardContext();
  const { activeProjects } = useDashboardData(filters);

  const optionsCohort = [
    { title: "Top 100", value: "terrafund" },
    { title: "Landscapes", value: "terrafund-landscapes" },
    { title: "Enterprises", value: "enterprises" }
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
      const options: Option[] = frameworks
        .filter(framework => framework.name && framework.framework_slug)
        .map(framework => ({
          title: framework.name!,
          value: framework.framework_slug!
        }));
      setFrameworks(frameworks);
      setProgrammeOptions(options);
    }
  }, [frameworks]);

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

    router.push(
      {
        pathname: router.pathname,
        query: query
      },
      undefined,
      { shallow: true }
    );
  }, [filters]);

  useEffect(() => {
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
  }, []);

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
      return "Project Insights";
    }
    if (isProjectListPage) {
      return "Project List";
    }
    if (isHomepage) {
      return "Learn More";
    }
    return "TerraMatch Dashboards";
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
          {t(getHeaderTitle())}
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
          {t(lastUpdatedAt ? `Last Updated on ${new Date(lastUpdatedAt).toISOString().split("T")[0]}` : "")}
        </Text>
        <When condition={!isProjectInsightsPage && !isHomepage}>
          <div className="flexl-col flex w-full max-w-full items-start gap-3 overflow-x-clip overflow-y-visible small:items-center">
            <div className="flex max-w-[70%] flex-wrap items-center gap-3 small:flex-nowrap">
              <BlurContainer className="min-w-[200px] lg:min-w-[220px] wide:min-w-[240px]" disabled={isProjectPage}>
                <Dropdown
                  key={filters.programmes.length}
                  showClear
                  showSelectAll
                  showLabelAsMultiple
                  multiSelect
                  prefix={<Text variant="text-14-light">{t("Programme:")}</Text>}
                  inputVariant="text-14-semibold"
                  variant={VARIANT_DROPDOWN_HEADER}
                  value={filters.programmes}
                  placeholder="All Data"
                  multipleText="Multiple programmes"
                  onChange={(value: OptionValue[]) => {
                    handleChange("programmes", value);
                  }}
                  onClear={() => {
                    handleChange("programmes", []);
                  }}
                  options={programmeOptions}
                  optionClassName="hover:bg-grey-200"
                  containerClassName="z-[5]"
                />
              </BlurContainer>
              <BlurContainer className="min-w-[200px] lg:min-w-[220px] wide:min-w-[240px]" disabled={isProjectPage}>
                <Dropdown
                  key={filters.cohort.length}
                  showClear
                  prefix={<Text variant="text-14-light">{t("Cohort:")}</Text>}
                  inputVariant="text-14-semibold"
                  variant={VARIANT_DROPDOWN_HEADER}
                  placeholder="All Data"
                  value={filters.cohort ? [filters.cohort] : []}
                  onChange={(value: OptionValue[]) => {
                    console.log(value);
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
                  containerClassName="z-[5]"
                />
              </BlurContainer>
              <BlurContainer className="min-w-[196px] lg:min-w-[216px] wide:min-w-[236px]" disabled={isProjectPage}>
                <Dropdown
                  key={filters.landscapes.length}
                  showClear
                  showSelectAll
                  showLabelAsMultiple
                  multiSelect
                  prefix={<Text variant="text-14-light">{t("Landscape:")}</Text>}
                  inputVariant="text-14-semibold"
                  variant={VARIANT_DROPDOWN_HEADER}
                  placeholder="All Data"
                  multipleText="Multiple Landscapes"
                  value={filters.landscapes}
                  onChange={value => {
                    handleChange("landscapes", value);
                  }}
                  onClear={() => {
                    handleChange("landscapes", []);
                  }}
                  options={landscapeOption}
                  optionClassName="hover:bg-grey-200"
                  containerClassName="z-[4]"
                />
              </BlurContainer>
              <BlurContainer className="min-w-[175px] lg:min-w-[195px] wide:min-w-[215px]" disabled={isProjectPage}>
                <Dropdown
                  key={filters.country.id}
                  showClear
                  prefix={<Text variant="text-14-light">{t("Country:")}</Text>}
                  inputVariant="text-14-semibold"
                  variant={VARIANT_DROPDOWN_HEADER}
                  placeholder="All Data"
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
                  containerClassName="z-[3]"
                />
              </BlurContainer>
              <BlurContainer className="min-w-[242px] lg:min-w-[272px] wide:min-w-[292px]" disabled={isProjectPage}>
                <Dropdown
                  key={filters.organizations.length}
                  showSelectAll
                  showLabelAsMultiple
                  showClear
                  prefix={<Text variant="text-14-light">{t("Organization Type:")}</Text>}
                  inputVariant="text-14-semibold"
                  multiSelect
                  variant={VARIANT_DROPDOWN_HEADER}
                  placeholder="All Data"
                  multipleText="Multiple Organization Types"
                  value={filters.organizations}
                  onChange={value => {
                    handleChange("organizations", value);
                  }}
                  onClear={() => {
                    handleChange("organizations", []);
                  }}
                  options={organizationOptions}
                  optionClassName="hover:bg-grey-200"
                  containerClassName="z-[2]"
                />
              </BlurContainer>
            </div>
            <div className="flex h-full w-auto flex-col items-start justify-between gap-3 lg:min-w-[287px] small:w-[-webkit-fill-available] small:flex-row small:items-center">
              <button
                className="text-14-semibold min-h-10 whitespace-nowrap p-1 text-white disabled:opacity-70"
                onClick={resetValues}
                disabled={isProjectPage}
              >
                {t("Clear Filters")}
              </button>
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
                  <BlurContainer className="lg:min-w-[287px]">
                    <FilterSearchBox
                      onChange={e => setSearchTerm(e)}
                      placeholder="Search"
                      variant={FILTER_SEARCH_BOX_AIRTABLE}
                      value={searchTerm}
                    />
                  </BlurContainer>
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
