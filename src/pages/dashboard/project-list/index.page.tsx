import Checkbox from "@/components/elements/Inputs/Checkbox/Checkbox";
import Menu from "@/components/elements/Menu/Menu";
import { MENU_PLACEMENT_LEFT_BOTTOM } from "@/components/elements/Menu/MenuVariant";
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
  const tableItemMenu = () => [
    {
      id: "1",
      render: () => (
        <div className="flex items-center gap-2" onClick={() => {}}>
          <Icon name={IconNames.POLYGON} className="h-6 w-6" />
          <Text variant="text-12-bold">Edit</Text>
        </div>
      )
    },
    {
      id: "2",
      render: () => (
        <div className="flex items-center gap-2" onClick={() => {}}>
          <Icon name={IconNames.TRASH_PA} className="h-5 w-5" />
          <Text variant="text-12-bold">Delete </Text>
        </div>
      )
    }
  ];

  const columns = [
    {
      header: () => <Checkbox name="" />,
      accessorKey: "checkbox",
      enableSorting: false,
      cell: () => <Checkbox name="" />
    },
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
      accessorKey: "actions",
      enableSorting: false,
      cell: () => (
        <Menu menu={tableItemMenu()} placement={MENU_PLACEMENT_LEFT_BOTTOM}>
          <div className="rounded p-1 hover:bg-primary-200">
            <Icon name={IconNames.ELIPSES} className="roudn h-4 w-4 rounded-sm text-grey-720 hover:bg-primary-200" />
          </div>
        </Menu>
      )
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
    <div className="h-full overflow-hidden bg-neutral-70 px-14 py-8">
      <Table
        columns={columns}
        data={DATA_TABLE_PROJECT_LIST}
        variant={VARIANT_TABLE_DASHBOARD}
        hasPagination={true}
        invertSelectPagination={true}
      />
    </div>
  );
};

export default ProjectList;
