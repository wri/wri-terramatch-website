import React, { FC } from "react";
import { TabbedShowLayout, TabProps, useShowContext } from "react-admin";

import Accordion from "@/components/elements/Accordion/Accordion";
import { EntityName } from "@/types/common";

import FinancialDescriptionsSection from "./components/FinancialDescriptionsSection";
import FinancialDocumentsSection from "./components/FinancialDocumentsSection";
import FinancialMetrics from "./components/FinancialMetrics";
import FundingSourcesSection from "./components/FundingSourcesSection";

interface IProps extends Omit<TabProps, "label" | "children"> {
  label?: string;
  entity?: EntityName;
}

const fundingSourcesItems = [
  { key: "2020", render: 2020 },
  { key: "2021", render: 2021 },
  { key: "2022", render: 2022 },
  { key: "2023", render: 2023 },
  { key: "2024", render: 2024 }
];

const HistoryTab: FC<IProps> = ({ label, entity, ...rest }) => {
  const ctx = useShowContext();
  const financialCollection = ctx?.record?.financialCollection;
  const documentsYears = financialCollection
    ?.filter((financial: any) => financial?.collection == "description-documents")
    .map((financial: any) => ({ year: financial?.year, files: financial?.documentation }));

  const descriptionYears = financialCollection
    ?.filter((financial: any) => financial?.collection == "description-documents")
    .map((financial: any) => ({ label: financial?.year, description: financial?.description }));

  return (
    <TabbedShowLayout.Tab label={label ?? "History"} {...rest}>
      <div className="flex flex-col gap-8">
        <FinancialMetrics />
        <Accordion
          title="Financial Documents per Year"
          variant="drawer"
          className="rounded-lg bg-white px-6 py-4 shadow-all"
        >
          <FinancialDocumentsSection files={documentsYears} />
        </Accordion>
        <Accordion
          title="Descriptions of Financials per Year"
          variant="drawer"
          className="rounded-lg bg-white px-6 py-4 shadow-all"
        >
          <FinancialDescriptionsSection items={descriptionYears} />
        </Accordion>
        <Accordion
          title="Major Funding Sources by Year"
          variant="drawer"
          className="rounded-lg bg-white px-6 py-4 shadow-all"
        >
          <FundingSourcesSection items={fundingSourcesItems} />
        </Accordion>
      </div>
    </TabbedShowLayout.Tab>
  );
};

export default HistoryTab;
