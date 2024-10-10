import Table from "@/components/elements/Table/Table";
import { VARIANT_TABLE_DASHBOARD } from "@/components/elements/Table/TableVariants";
import Text from "@/components/elements/Text/Text";
import Icon, { IconNames } from "@/components/extensive/Icon/Icon";
import { useGetV2DashboardCountries } from "@/generated/apiComponents";

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
      accessorKey: "programme"
    },
    {
      header: "Country",
      accessorKey: "country",
      cell: (props: any) => {
        const { label, image } = props.getValue();
        return (
          <div className="flex items-center gap-2">
            <img src={image} alt="flas" className="h-6 w-8 object-cover" />
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
          <a href="/dashboard/project">
            <Icon name={IconNames.IC_ARROW_COLLAPSE} className="h-3 w-3 rotate-90 text-darkCustom hover:text-primary" />
          </a>
        );
      }
    }
  ];

  const { data: dashboardCountries } = useGetV2DashboardCountries<any>({
    queryParams: {}
  });

  const DATA_TABLE_PROJECT_LIST = dashboardCountries
    ? dashboardCountries.data.map((country: any) => ({
        project: "Annette Ward (3SC)",
        organization: "Goshen Global Vision",
        programme: "TerraFund Top100",
        country: { label: country.data.label, image: country.data.icon },
        treesPlanted: "12,000,000",
        restorationHectares: "15,700",
        jobsCreated: "9,000,000"
      }))
    : [];

  return (
    <div className="h-full overflow-scroll bg-neutral-70 px-14 py-8">
      <Table
        columns={columns}
        data={DATA_TABLE_PROJECT_LIST}
        variant={VARIANT_TABLE_DASHBOARD}
        classNameWrapper="h-[calc(100%_-_4rem)]"
        hasPagination={true}
        invertSelectPagination={true}
      />
    </div>
  );
};

export default ProjectList;
