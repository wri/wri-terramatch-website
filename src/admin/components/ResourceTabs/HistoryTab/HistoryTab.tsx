import React, { FC } from "react";
import { TabbedShowLayout, TabProps } from "react-admin";

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

const financialDescriptionsItems = [
  {
    label: "2020",
    description:
      "The organization faced significant revenue decline of 15% due to pandemic-related disruptions while maintaining stable operating margins through aggressive cost-cutting measures."
  },
  {
    label: "2021",
    description:
      "Strong recovery emerged with 28% revenue growth driven by digital transformation initiatives and pent-up market demand, though increased operational expenses compressed profit margins."
  }
];

const financialDocumentsItems = [
  { year: "2020", files: ["GFW Pro High Level Arch Diagram Feb 2023", "TERRAFUND Reference Letter New"] },
  { year: "2022", files: [] }
];

const fundingSourcesItems = [
  { key: "2020", render: 2020 },
  { key: "2021", render: 2021 },
  { key: "2022", render: 2022 },
  { key: "2023", render: 2023 },
  { key: "2024", render: 2024 }
];

const HistoryTab: FC<IProps> = ({ label, entity, ...rest }) => {
  return (
    <TabbedShowLayout.Tab label={label ?? "History"} {...rest}>
      <div className="flex flex-col gap-8">
        <FinancialMetrics />
        <Accordion
          title="Financial Documents per Year"
          variant="drawer"
          className="rounded-lg bg-white px-6 py-4 shadow-all"
        >
          <FinancialDocumentsSection files={financialDocumentsItems} />
        </Accordion>
        <Accordion
          title="Descriptions of Financials per Year"
          variant="drawer"
          className="rounded-lg bg-white px-6 py-4 shadow-all"
        >
          <FinancialDescriptionsSection items={financialDescriptionsItems} />
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
