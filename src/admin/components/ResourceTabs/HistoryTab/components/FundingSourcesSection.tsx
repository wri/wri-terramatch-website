import { useT } from "@transifex/react";
import { FC, useState } from "react";

import Table from "@/components/elements/Table/Table";
import { VARIANT_TABLE_DASHBOARD_LIST } from "@/components/elements/Table/TableVariants";
import Toggle from "@/components/elements/Toggle/Toggle";
import { VARIANT_TOGGLE_SECONDARY } from "@/components/elements/Toggle/ToggleVariants";
import { getFundingTypesOptions } from "@/constants/options/fundingTypes";
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
    header: "Funding Amount",
    accessorKey: "fundingAmount",
    enableSorting: true
  }
];

const FundingSourcesSection: FC<IProps> = ({ data, currency }) => {
  const t = useT();
  const fundingSourcesItems = [
    { key: "all", render: t("All") },
    ...Array.from(new Set(data?.map(item => item.year as number)))
      .sort((a: number, b: number) => a - b)
      .map((year: number) => ({
        key: String(year),
        render: year
      }))
  ];

  const [activeIndex, setActiveIndex] = useState(0);
  const selectedKey = fundingSourcesItems[activeIndex]?.key;

  const filteredData =
    selectedKey && selectedKey !== "all" ? data?.filter(item => String(item.year) === selectedKey) : data;

  const tableData = filteredData?.map((item: any, index) => ({
    id: index + 1,
    fundingYear: item?.year,
    fundingType: getFundingTypesOptions(t).find(opt => opt.value == item?.type)?.title,
    fundingSource: item?.source,
    fundingAmount: `${currencyInput[currency!] ?? ""} ${item?.amount ? item?.amount?.toLocaleString() : ""}`
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
        defaultActiveIndex={activeIndex}
      />
      <div>
        <Table columns={ColumnsTableFundingSources} data={tableData ?? []} variant={VARIANT_TABLE_DASHBOARD_LIST} />
      </div>
    </div>
  );
};

export default FundingSourcesSection;
