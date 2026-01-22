import { useT } from "@transifex/react";
import { Else, If, Then } from "react-if";

import { formatEntryValue } from "@/admin/apiProvider/utils/entryFormat";
import Accordion from "@/components/elements/Accordion/Accordion";
import Text from "@/components/elements/Text/Text";
import { FormSummaryProps } from "@/components/extensive/WizardForm/FormSummary";
import { useGetFormEntries } from "@/components/extensive/WizardForm/FormSummaryRow/getFormEntries";
import { useFieldsProvider, useFormEntities } from "@/context/wizardForm.provider";
import { EntityName } from "@/types/common";

import List from "../../List/List";

export interface FormSummaryRowProps extends FormSummaryProps {
  type?: EntityName;
  stepId: string;
  index: number;
  nullText?: string;
}

const FormSummaryRow = ({ stepId, index, ...props }: FormSummaryRowProps) => {
  const t = useT();
  const { title } = useFieldsProvider().step(stepId) ?? {};
  const entities = useFormEntities();
  const entries = useGetFormEntries({ stepId, ...props, entity: entities[0] });
  return (
    <Accordion
      variant="secondary"
      title={title ?? ""}
      ctaButtonProps={
        props.onEdit
          ? {
              text: t("Edit"),
              onClick: () => props.onEdit?.(index)
            }
          : undefined
      }
    >
      <List
        className="flex flex-col gap-4"
        items={entries}
        render={entry => (
          <div className="flex items-start gap-12 transition-all delay-300 duration-300">
            <Text variant="text-body-500" className="flex-1">
              {entry.title}
            </Text>
            <If condition={typeof entry.value === "string" || typeof entry.value === "number"}>
              <Then>
                <Text variant="text-body-300" className="flex-1" containHtml>
                  {formatEntryValue(entry.value)}
                </Text>
              </Then>
              <Else>{formatEntryValue(entry.value)}</Else>
            </If>
          </div>
        )}
      />
    </Accordion>
  );
};

export default FormSummaryRow;
