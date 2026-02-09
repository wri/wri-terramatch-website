import { useT } from "@transifex/react";
import classNames from "classnames";
import { Else, If, Then } from "react-if";

import { formatEntryValue } from "@/admin/apiProvider/utils/entryFormat";
import Text from "@/components/elements/Text/Text";
import { FormSummaryProps } from "@/components/extensive/WizardForm/FormSummary";
import { useGetFormEntries } from "@/components/extensive/WizardForm/FormSummaryRow/getFormEntries";
import { useFieldsProvider, useFormEntities } from "@/context/wizardForm.provider";
import Button from "@/redesignComponents/actions/Buttons/Button/Button";
import Accordion from "@/redesignComponents/containers/Accordion/Accordion";
import AccordionHeader from "@/redesignComponents/containers/Accordion/AccordionHeader";
import { Edit } from "@/redesignComponents/foundations/Icons";
import { EntityName } from "@/types/common";

import List from "../../List/List";
import { isDemographicType } from "../../TrackingCollapseGrid/types";
import { useFormStepsWithValidation } from "../useFormStepsWithValidation";
import { Framework, toFramework, useFramework } from "@/context/framework.provider";
import type * as yup from "yup";

const getFieldsRequiringAttentionCount = (
  validation: yup.ObjectSchema<Record<string, unknown>>,
  values: Record<string, unknown> | undefined
): number => {
  if (values == null) return 0;
  try {
    validation.validateSync(values, { abortEarly: false });
    return 0;
  } catch (err: unknown) {
    const yupError = err as { inner?: unknown[] };
    return yupError.inner?.length ?? 0;
  }
};

export interface FormSummaryRowProps extends FormSummaryProps {
  type?: EntityName;
  stepId: string;
  index: number;
  nullText?: string;
}

const FormSummaryRow = ({ stepId, index, ...props }: FormSummaryRowProps) => {
  const t = useT();
  const { title } = useFieldsProvider().step(stepId) ?? {};
  const frameworkKey = useFramework();
  const framework = toFramework(frameworkKey) as Framework;
  const stepsWithValidation = useFormStepsWithValidation(useFieldsProvider(), framework);
  const validation = stepsWithValidation[index].validation;
  const valid = props.values == null || validation.isValidSync(props.values);
  const fieldsRequiringAttention = getFieldsRequiringAttentionCount(validation, props.values);
  const entities = useFormEntities();
  const entries = useGetFormEntries({ stepId, ...props, entity: entities[0] });
  return (
    <Accordion
      variant="primary"
      header={
        <AccordionHeader
          title={title ?? ""}
          badge={!valid && fieldsRequiringAttention > 0
            ? t("{count} requires attention", { count: fieldsRequiringAttention })
            : undefined}
          status={valid ? "complete" : "error"}
        />
      }
      actions={
        props.onEdit ? (
          <Button variant="secondary" size="small" leftIcon={<Edit />} onClick={() => props.onEdit?.(index)}>
            {t("Edit")}
          </Button>
        ) : undefined
      }
    >
      <List
        className="flex flex-col gap-4"
        items={entries}
        render={entry => (
          <div
            className={classNames("flex items-start gap-12 transition-all delay-300 duration-300", {
              "w-full flex-col": isDemographicType(entry.value.props?.type)
            })}
          >
            <Text variant="text-body-500" className=" flex-1">
              {entry.title}
            </Text>
            <div
              className={classNames("flex-1", {
                "w-full !min-w-full": isDemographicType(entry.value.props?.type)
              })}
            >
              <If condition={typeof entry.value === "string" || typeof entry.value === "number"}>
                <Then>
                  <Text variant="text-body-300" className="flex-1" containHtml>
                    {formatEntryValue(entry.value)}
                  </Text>
                </Then>
                <Else>
                  <div
                    className={classNames("", {
                      "w-full !min-w-full": isDemographicType(entry.value.props?.type)
                    })}
                  >
                    {formatEntryValue(entry.value)}
                  </div>
                </Else>
              </If>
            </div>
          </div>
        )}
      />
    </Accordion>
  );
};

export default FormSummaryRow;
