import { FC, useState } from "react";

import Table from "@/components/elements/Table/Table";
import { VARIANT_TABLE_DASHBOARD_LIST } from "@/components/elements/Table/TableVariants";
import Toggle from "@/components/elements/Toggle/Toggle";
import { VARIANT_TOGGLE_SECONDARY } from "@/components/elements/Toggle/ToggleVariants";
import { V2FundingTypeRead } from "@/generated/apiSchemas";
import { currencyInput } from "@/utils/financialReport";

interface IProps {
  data?: V2FundingTypeRead[];
  currency?: string;
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

const FundingSourcesSection: FC<IProps> = ({ data, currency }) => {
  const fundingSourcesItems = Array.from(new Set(data?.map(item => item.year as number)))
    .sort((a: number, b: number) => a - b)
    .map((year: number) => ({
      key: String(year),
      render: year
    }));

  const [activeIndex, setActiveIndex] = useState(-1);
  const selectedYear =
    activeIndex >= 0 && fundingSourcesItems.length > 0 ? Number(fundingSourcesItems[activeIndex].key) : undefined;

  const filteredData = selectedYear !== undefined ? data?.filter(item => item.year === selectedYear) : data;

  const tableData = filteredData?.map((item: any, index) => ({
    id: index + 1,
    fundingYear: item?.year,
    fundingType: item?.type,
    fundingSource: item?.source,
    fundingAmount: `${currencyInput[currency!] ?? ""} ${item?.amount}`
  }));

  const handleToggle = (index: number) => {
    setActiveIndex(index);
  };

  return (
    <div className="flex flex-col gap-4">
      <Toggle
        variant={VARIANT_TOGGLE_SECONDARY}
        items={fundingSourcesItems}
        onChangeActiveIndex={handleToggle}
        defaultActiveIndex={activeIndex >= 0 ? activeIndex : undefined}
      />
      <div>
        <Table columns={ColumnsTableFundingSources} data={tableData ?? []} variant={VARIANT_TABLE_DASHBOARD_LIST} />
      </div>
    </div>
  );
};

export default FundingSourcesSection;
