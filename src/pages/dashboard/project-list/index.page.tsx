import { useRouter } from "next/router";

import Table from "@/components/elements/Table/Table";
import { VARIANT_TABLE_DASHBOARD } from "@/components/elements/Table/TableVariants";
import Text from "@/components/elements/Text/Text";
import Icon, { IconNames } from "@/components/extensive/Icon/Icon";
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
  const columns = [
    {
      header: "Project",
      accessorKey: "project"
    },
    {
      header: "Organization",
      accessorKey: "organization"
    },
    {
      header: "Programme",
      accessorKey: "programme",
      cell: (props: any) => {
        const value = props.getValue();
        return value === "TerraFund Top 100" ? (
          <Text variant="text-14-light">
            TerraFund
            <br />
            Top 100
          </Text>
        ) : (
          <Text variant="text-14-light">{value}</Text>
        );
      }
    },
    {
      header: "Country",
      accessorKey: "country",
      cell: (props: any) => {
        const { label, image } = props.getValue();
        return (
          <div className="flex items-center gap-2">
            <img src={image} alt="flas" className="h-6 w-10 min-w-[40px] object-cover" />
            <Text variant="text-14-light">{label}</Text>
          </div>
        );
      }
    },
    {
      header: "Trees Planted",
      accessorKey: "treesPlanted"
    },
    {
      header: "Restoration Hectares",
      accessorKey: "restorationHectares"
    },
    {
      header: "Jobs Created",
      accessorKey: "jobsCreated"
    },
    {
      header: "",
      accessorKey: "link",
      enableSorting: false,
      cell: () => {
        return (
          <Icon
            name={IconNames.IC_ARROW_COLLAPSE}
            className="h-3 w-3 rotate-90 text-darkCustom hover:cursor-pointer hover:text-primary"
          />
        );
      }
    }
  ];

  const router = useRouter();
  const { filters, setFilters, dashboardCountries, frameworks } = useDashboardContext();
  const { activeProjects } = useDashboardData(filters);

  const DATA_TABLE_PROJECT_LIST = activeProjects
    ? activeProjects?.map(
        (item: {
          uuid: string;
          name: string;
          organisation: string;
          programme: string;
          country_slug: string;
          project_country: string;
          trees_under_restoration: number;
          hectares_under_restoration: number;
          jobs_created: number;
        }) => ({
          uuid: item.uuid,
          project: item?.name,
          organization: item?.organisation,
          programme: getFrameworkName(frameworks, item?.programme),
          country: {
            country_slug: item?.country_slug,
            label: item?.project_country,
            image: `/flags/${item?.country_slug?.toLowerCase()}.svg`
          },
          treesPlanted: item.trees_under_restoration.toLocaleString(),
          restorationHectares: item.hectares_under_restoration.toLocaleString(),
          jobsCreated: item.jobs_created.toLocaleString()
        })
      )
    : [];

  return (
    <div className="h-full overflow-scroll bg-neutral-70 px-14 py-8">
      <Table
        columns={columns}
        data={DATA_TABLE_PROJECT_LIST}
        variant={VARIANT_TABLE_DASHBOARD}
        classNameWrapper="max-h-[calc(100%_-_4rem)] h-[calc(100%_-_4rem)] !px-0"
        hasPagination={true}
        invertSelectPagination={true}
        onRowClick={(row: { uuid: string; country: { country_slug: string } }) => {
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
      />
    </div>
  );
};

export default ProjectList;
