import React, { FC, Fragment, useMemo } from "react";
import { TabbedShowLayout, TabProps, useShowContext } from "react-admin";

import Accordion from "@/components/elements/Accordion/Accordion";
import { FieldInputType } from "@/components/extensive/WizardForm/types";
import { FormEntity } from "@/connections/Form";
import { useApiFieldsProvider } from "@/context/wizardForm.provider";
import { formDefaultValues } from "@/helpers/customForms";
import { v3EntityName } from "@/helpers/entity";
import { useEntityForm } from "@/hooks/useFormGet";
import { EntityName } from "@/types/common";
import { isNotNull } from "@/utils/array";
import { formatDescriptionData, formatDocumentData } from "@/utils/financialReport";

import FinancialDescriptionsSection from "./components/FinancialDescriptionsSection";
import FinancialDocumentsSection from "./components/FinancialDocumentsSection";
import FinancialMetrics from "./components/FinancialMetrics";
import FundingSourcesSection from "./components/FundingSourcesSection";

interface IProps extends Omit<TabProps, "label" | "children"> {
  label?: string;
  entity?: EntityName;
}

const SUPPORTED_INPUT_TYPES: FieldInputType[] = ["financialIndicators", "fundingType"];

const HistoryTab: FC<IProps> = ({ label, entity, ...rest }) => {
  const { isLoading: ctxLoading, record } = useShowContext();
  const entityName = entity ?? record?.entity;
  const entityUuid = record?.uuid;

  const { formData, isLoading: queryLoading } = useEntityForm(v3EntityName(entityName) as FormEntity, entityUuid);
  const [providerLoaded, fieldsProvider] = useApiFieldsProvider(
    formData?.formUuid,
    undefined,
    // We only display data for the types in SUPPORTED_INPUT_TYPES, so speed up this component by
    // ignoring everything else.
    ({ inputType }) => SUPPORTED_INPUT_TYPES.includes(inputType)
  );
  const isLoading = ctxLoading || queryLoading || !providerLoaded;

  const values = useMemo(
    () => (formData?.answers == null ? {} : formDefaultValues(formData?.answers, fieldsProvider)),
    [fieldsProvider, formData?.answers]
  );

  const fields = useMemo(
    () => fieldsProvider.stepIds().flatMap(fieldsProvider.fieldNames).map(fieldsProvider.fieldByName).filter(isNotNull),
    [fieldsProvider]
  );

  if (isLoading || !record) return null;

  return (
    <TabbedShowLayout.Tab label={label ?? "History"} {...rest}>
      <div className="flex flex-col gap-8 p-2">
        {fields.map(field =>
          field.inputType === "financialIndicators" ? (
            <Fragment key={field.name}>
              <FinancialMetrics data={values[field.name]} years={field.years ?? undefined} />
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
            </Fragment>
          ) : field.inputType === "fundingType" ? (
            <Accordion
              key={field.name}
              title="Major Funding Sources by Year"
              variant="drawer"
              className="rounded-lg bg-white px-6 py-4 shadow-all"
            >
              <FundingSourcesSection data={values[field.name]} currency={record.currency} />
            </Accordion>
          ) : null
        )}
      </div>
    </TabbedShowLayout.Tab>
  );
};

export default HistoryTab;
