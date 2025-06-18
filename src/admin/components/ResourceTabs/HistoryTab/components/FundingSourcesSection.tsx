import { FC } from "react";

import Table from "@/components/elements/Table/Table";
import { VARIANT_TABLE_DASHBOARD_LIST } from "@/components/elements/Table/TableVariants";
import Toggle from "@/components/elements/Toggle/Toggle";
import { TogglePropsItem } from "@/components/elements/Toggle/Toggle";
import { VARIANT_TOGGLE_SECONDARY } from "@/components/elements/Toggle/ToggleVariants";

interface IProps {
  items: TogglePropsItem[];
}

const ColumnsTableFundingSources = [
  {
    id: "id",
    header: "#",
    accessorKey: "id",
    enableSorting: true
  },
  {
    id: "fundingYear",
    header: "Funding Year",
    accessorKey: "fundingYear",
    enableSorting: true
  },
  {
    id: "fundingType",
    header: "Funding Type",
    accessorKey: "fundingType",
    enableSorting: true
  },
  {
    id: "fundingSource",
    header: "Funding Source",
    accessorKey: "fundingSource",
    enableSorting: true
  },
  {
    id: "fundingAmount",
    header: "Funding amount",
    accessorKey: "fundingAmount",
    enableSorting: true
  }
];

const dataMock = [
  {
    id: 1,
    fundingYear: "2020",
    fundingType: "Private grant from foundation",
    fundingSource: "IFAD",
    fundingAmount: "$440,053.67"
  },
  {
    id: 2,
    fundingYear: "2021",
    fundingType: "Private grant from foundation",
    fundingSource: "IFAD",
    fundingAmount: "$440,053.67"
  },
  {
    id: 3,
    fundingYear: "2022",
    fundingType: "Private grant from foundation",
    fundingSource: "IFAD",
    fundingAmount: "$440,053.67"
  },
  {
    id: 4,
    fundingYear: "2023",
    fundingType: "Private grant from foundation",
    fundingSource: "IFAD",
    fundingAmount: "$440,053.67"
  },
  {
    id: 5,
    fundingYear: "2024",
    fundingType: "Private grant from foundation",
    fundingSource: "IFAD",
    fundingAmount: "$440,053.67"
  },
  {
    id: 6,
    fundingYear: "2025",
    fundingType: "Private grant from foundation",
    fundingSource: "IFAD",
    fundingAmount: "$440,053.67"
  },
  {
    id: 7,
    fundingYear: "2026",
    fundingType: "Private grant from foundation",
    fundingSource: "IFAD",
    fundingAmount: "$440,053.67"
  },
  {
    id: 8,
    fundingYear: "2027",
    fundingType: "Private grant from foundation",
    fundingSource: "IFAD",
    fundingAmount: "$440,053.67"
  }
];

const FundingSourcesSection: FC<IProps> = ({ items }) => {
  return (
    <div className="flex flex-col gap-4">
      <Toggle variant={VARIANT_TOGGLE_SECONDARY} items={items} />
      <div>
        <Table columns={ColumnsTableFundingSources} data={dataMock} variant={VARIANT_TABLE_DASHBOARD_LIST} />
      </div>
    </div>
  );
};

export default FundingSourcesSection;
