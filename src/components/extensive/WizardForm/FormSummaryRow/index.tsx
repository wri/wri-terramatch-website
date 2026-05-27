import { Text } from "@chakra-ui/react";
import { useT } from "@transifex/react";
import classNames from "classnames";
import type * as yup from "yup";

import { formatEntryValue } from "@/admin/apiProvider/utils/entryFormat";
import { FormSummaryProps } from "@/components/extensive/WizardForm/FormSummary";
import { useGetFormEntries } from "@/components/extensive/WizardForm/FormSummaryRow/getFormEntries";
import { Framework, toFramework, useFramework } from "@/context/framework.provider";
import { useFieldsProvider, useFormEntities } from "@/context/wizardForm.provider";
import Button from "@/redesignComponents/actions/Buttons/Button/Button";
import Accordion from "@/redesignComponents/containers/Accordion/Accordion";
import AccordionHeader from "@/redesignComponents/containers/Accordion/AccordionHeader";
import { EditIcon } from "@/redesignComponents/foundations/Icons";
import { EntityName } from "@/types/common";

import List from "../../List/List";
import SpecialEntryRenderer, {
  SPECIAL_ENTRY_TITLES
} from "../../PageElements/PageContent/components/SpecialEntryRenderer";
import { isTrackingType } from "../../TrackingCollapseGrid/types";
import { countFeedbackInStep, hasFeedbackInStep } from "../feedbackUtils";
import { useFormStepsWithValidation } from "../useFormStepsWithValidation";

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
  const fieldsProvider = useFieldsProvider();
  const { title } = fieldsProvider.step(stepId) ?? {};
  const frameworkKey = useFramework();
  const framework = toFramework(frameworkKey) as Framework;
  const stepsWithValidation = useFormStepsWithValidation(fieldsProvider, framework);
  const validation = stepsWithValidation[index].validation;
  const hasStepFeedback = hasFeedbackInStep(fieldsProvider, stepId, props.feedbackFieldsOptions);
  const valid = (props.values == null || validation.isValidSync(props.values)) && !hasStepFeedback;
  const fieldsRequiringAttention = getFieldsRequiringAttentionCount(validation, props.values);
  const entities = useFormEntities();
  const entries = useGetFormEntries({ stepId, ...props, entity: entities[0] });
  const feedbackFieldsCount = countFeedbackInStep(fieldsProvider, stepId, props.feedbackFieldsOptions);

  return (
    <Accordion
      variant="primary"
      header={
        <AccordionHeader
          title={title ?? ""}
          badge={
            !valid && (fieldsRequiringAttention > 0 || feedbackFieldsCount > 0)
              ? t("{count} requires attention", { count: fieldsRequiringAttention + feedbackFieldsCount })
              : undefined
          }
          status={hasStepFeedback ? "warning" : valid ? "complete" : "error"}
        />
      }
      actions={
        props.onEdit ? (
          <Button variant="secondary" size="small" leftIcon={<EditIcon />} onClick={() => props.onEdit?.(index)}>
            {t("Edit")}
          </Button>
        ) : undefined
      }
    >
      <List
        className="flex flex-col gap-3"
        items={entries}
        render={entry => {
          if (SPECIAL_ENTRY_TITLES.has(entry.title ?? "") || entry.inputType === "file") {
            return <SpecialEntryRenderer entry={entry} entityName={entities[0]?.entityName} />;
          }
          return (
            <>
              <div
                className={classNames("flex w-full flex-col items-start gap-1 transition-all delay-300 duration-300")}
              >
                <Text textStyle="300-bold" className="w-full flex-1" color="primary.900">
                  {entry.title}
                </Text>
                <div
                  className={classNames("w-full flex-1", {
                    "!min-w-full": isTrackingType(entry.value?.props?.type)
                  })}
                >
                  {typeof entry.value === "string" ? (
                    <Text
                      textStyle="400"
                      className="flex-1"
                      color="neutral.900"
                      dangerouslySetInnerHTML={{ __html: entry.value }}
                    />
                  ) : typeof entry.value === "number" ? (
                    <Text textStyle="400" className="flex-1" color="neutral.900">
                      {entry.value}
                    </Text>
                  ) : (
                    <div
                      className={classNames("w-full", {
                        "!min-w-full": isTrackingType(entry.value?.props?.type)
                      })}
                    >
                      {formatEntryValue(entry.value)}
                    </div>
                  )}
                </div>
              </div>
            </>
          );
        }}
      />
    </Accordion>
  );
};

export default FormSummaryRow;
