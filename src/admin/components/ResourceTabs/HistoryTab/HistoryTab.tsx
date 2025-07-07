import { useT } from "@transifex/react";
import React, { FC } from "react";
import { TabbedShowLayout, TabProps, useShowContext } from "react-admin";

import { setDefaultConditionalFieldsAnswers } from "@/admin/utils/forms";
import Accordion from "@/components/elements/Accordion/Accordion";
import { useFrameworkContext } from "@/context/framework.provider";
import { GetV2FormsENTITYUUIDResponse, useGetV2FormsENTITYUUID } from "@/generated/apiComponents";
import { getCustomFormSteps, normalizedFormDefaultValue } from "@/helpers/customForms";
import { EntityName } from "@/types/common";
import { formatDescriptionData, formatDocumentData } from "@/utils/financialReport";

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
  const { isLoading: ctxLoading, record } = useShowContext();
  const t = useT();
  const { framework } = useFrameworkContext();
  const entityName = entity ?? record?.entity;
  const entityUuid = record?.uuid;

  const { data: response, isLoading: queryLoading } = useGetV2FormsENTITYUUID<{ data: GetV2FormsENTITYUUIDResponse }>({
    pathParams: {
      uuid: entityUuid as string,
      entity: entityName as string
    }
  });

  const isLoading = ctxLoading || queryLoading;

  if (isLoading || !record) return null;

  const formSteps = getCustomFormSteps(response?.data.form!, t, undefined, framework);
  const values = record.migrated
    ? setDefaultConditionalFieldsAnswers(normalizedFormDefaultValue(response?.data.answers!, formSteps), formSteps)
    : normalizedFormDefaultValue(response?.data.answers!, formSteps);

  return (
    <TabbedShowLayout.Tab label={label ?? "History"} {...rest}>
      <div className="flex flex-col gap-8">
        {formSteps.map(step =>
          step?.fields?.map(field =>
            field.type == "financialTableInput" ? (
              <>
                <FinancialMetrics data={values[field.name]} years={field?.fieldProps?.years} />
                <Accordion
                  title="Financial Documents per Year"
                  variant="drawer"
                  className="rounded-lg bg-white px-6 py-4 shadow-all"
                >
                  <FinancialDocumentsSection files={formatDocumentData(values[field.name])} />
                </Accordion>
                <Accordion
                  title="Descriptions of Financials per Year"
                  variant="drawer"
                  className="rounded-lg bg-white px-6 py-4 shadow-all"
                >
                  <FinancialDescriptionsSection items={formatDescriptionData(values[field.name])} />
                </Accordion>
                <Accordion
                  title="Major Funding Sources by Year"
                  variant="drawer"
                  className="rounded-lg bg-white px-6 py-4 shadow-all"
                >
                  <FundingSourcesSection items={fundingSourcesItems} />
                </Accordion>
              </>
            ) : (
              <></>
            )
          )
        )}
      </div>
    </TabbedShowLayout.Tab>
  );
};

export default HistoryTab;
