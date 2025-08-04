import { useMediaQuery } from "@mui/material";
import { useT } from "@transifex/react";
import classNames from "classnames";
import { useRouter } from "next/router";

import Table from "@/components/elements/Table/Table";
import { VARIANT_TABLE_DASHBOARD_LIST } from "@/components/elements/Table/TableVariants";
import Text from "@/components/elements/Text/Text";
import Icon, { IconNames } from "@/components/extensive/Icon/Icon";
import { useGadmChoices } from "@/connections/Gadm";
import { useDashboardContext } from "@/context/dashboard.provider";
import { getFrameworkName } from "@/utils/dashboardUtils";

import { useDashboardData } from "../hooks/useDashboardData";

export interface DashboardTableDataProps {
  label: string;
  valueText: string;
  value: number;
}

export interface GraphicLegendProps {
  label: string;
  value: string;
  color: string;
}

export interface DashboardDataProps {
  value?: string;
  unit?: string;
  secondValue?: string;
  graphic?: string;
  tableData?: DashboardTableDataProps[];
  maxValue?: number;
  graphicLegend?: GraphicLegendProps[];
  graphicTargetLandUseTypes?: DashboardTableDataProps[];
  objetiveText?: string;
  preferredLanguage?: string;
  landTenure?: string;
}

const ProjectList = () => {
  const t = useT();
  const isMobile = useMediaQuery("(max-width: 1200px)");

  const columns = [
    {
      header: t("Project"),
      accessorKey: "project",
      meta: { width: isMobile ? "90%" : "23%" },
      cell: ({ row }: { row: { original: { project: string; country: { image: string }; organization: string } } }) => {
        const { project, country, organization } = row.original;
        if (isMobile) {
          return (
            <div className="flex items-start gap-2">
              <img src={country.image} alt="flag" className="h-6 w-10 min-w-[40px] object-cover" />
              <div>
                <Text variant="text-14-light">{project}</Text>
                <Text variant="text-14-light" className=" text-neutral-650">
                  {organization}
                </Text>
              </div>
            </div>
          );
        }
        return project;
      }
    },
    ...(isMobile
      ? []
      : [
          {
            header: t("Organization"),
            accessorKey: "organization",
            meta: { width: "19%" }
          },
          {
            header: t("Programme"),
            accessorKey: "programme",
            meta: { width: "13%" }
          },
          {
            header: t("Country"),
            accessorKey: "country",
            cell: (props: any) => {
              const { label, image } = props.getValue();
              return (
                <div className="flex items-center gap-2">
                  <img src={image} alt="flag" className="h-6 w-10 min-w-[40px] object-cover" />
                  <Text variant="text-14-light">{label}</Text>
                </div>
              );
            },
            meta: { width: "13%" }
          },
          {
            header: t("Trees Planted"),
            accessorKey: "treesPlanted"
          },
          {
            header: t("Restoration Hectares"),
            accessorKey: "restorationHectares"
          },
          {
            header: t("Jobs Created"),
            accessorKey: "jobsCreated"
          }
        ]),

    {
      header: "",
      accessorKey: "link",
      enableSorting: false,
      cell: () => {
        return (
          <Icon
            name={IconNames.IC_ARROW_COLLAPSE}
            className={classNames(
              "h-3 w-3 rotate-90 text-darkCustom hover:cursor-pointer hover:text-primary",
              "mobile:h-4 mobile:w-4"
            )}
          />
        );
      }
    }
  ];

  const router = useRouter();
  const { filters, setFilters, dashboardCountries, frameworks } = useDashboardContext();
  const { activeProjects } = useDashboardData(filters);
  const countryChoices = useGadmChoices({ level: 0 });

  const DATA_TABLE_PROJECT_LIST = activeProjects
    ? activeProjects
        .map((item: any) => {
          return {
            uuid: item.uuid,
            project: item.name,
            organization: item.organisationName,
            programme: getFrameworkName(frameworks, item.frameworkKey),
            country: {
              country_slug: item.country,
              label: countryChoices.find(country => country.id === item.country)?.name,
              image: `/flags/${item.country?.toLowerCase()}.svg`
            },
            treesPlanted: (item.treesPlantedCount || 0).toLocaleString(),
            restorationHectares: (item.totalHectaresRestoredSum || 0).toLocaleString(),
            jobsCreated: (item.totalJobsCreated || 0).toLocaleString()
          };
        })
        .sort(
          (a: { organization: string }, b: { organization: any }) => a.organization?.localeCompare(b.organization) || 0
        )
    : [];

  return (
    <div className="h-full overflow-scroll bg-neutral-70 py-8 px-14 mobile:overflow-hidden mobile:p-0">
      <Table
        columns={columns}
        data={DATA_TABLE_PROJECT_LIST}
        variant={VARIANT_TABLE_DASHBOARD_LIST}
        contentClassName="h-full max-h-full overflow-auto pr-2 mobile:pr-0 pb-[120px]"
        hasPagination={true}
        classNameWrapper="!overflow-visible mobile:px-0"
        invertSelectPagination={true}
        onRowClick={(row: {
          project: string;
          country: { image: string; country_slug: string };
          organization: string;
          uuid: string;
        }) => {
          setFilters(prevValues => ({
            ...prevValues,
            uuid: row.uuid as string,
            country:
              dashboardCountries?.find(country => country.country_slug === row?.country?.country_slug) ||
              prevValues.country
          }));
          router.push({
            pathname: "/dashboard",
            query: { ...filters, country: row?.country?.country_slug, uuid: row.uuid as string }
          });
        }}
        initialTableState={{ pagination: { pageSize: 10 } }}
        classPagination="mobile:absolute mobile:bottom-0 mobile:bg-neutral-70 mobile:py-4 mobile:w-full mobile:shadow-dashboard"
      />
    </div>
  );
};

export default ProjectList;
