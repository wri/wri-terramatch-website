import { Flex, Text } from "@chakra-ui/react";
import { useT } from "@transifex/react";
import { Dictionary } from "lodash";
import { useRouter } from "next/router";
import { FC, Fragment, isValidElement } from "react";
import * as yup from "yup";

import { formatEntryValue } from "@/admin/apiProvider/utils/entryFormat";
import PageBody from "@/components/extensive/PageElements/Body/PageBody";
import { useGetFormEntries } from "@/components/extensive/WizardForm/FormSummaryRow/getFormEntries";
import { STEP_QUERY_PARAM } from "@/components/extensive/WizardForm/useFormNavigation";
import { FormStepWithValidation } from "@/components/extensive/WizardForm/useFormStepsWithValidation";
import WizardFormProvider from "@/context/wizardForm.provider";
import { SiteFullDto } from "@/generated/v3/entityService/entityServiceSchemas";
import { isEntityAwaitingApproval, v3EntityName } from "@/helpers/entity";
import { useGetEditEntityHandler } from "@/hooks/entity/useGetEditEntityHandler";
import { useEntityFormSetup } from "@/hooks/useEntityFormSetup";
import Button from "@/redesignComponents/actions/Buttons/Button/Button";
import Accordion from "@/redesignComponents/containers/Accordion/Accordion";
import AccordionHeader from "@/redesignComponents/containers/Accordion/AccordionHeader";
import { EditIcon } from "@/redesignComponents/foundations/Icons";

interface SiteDetailsTabProps {
  site: SiteFullDto;
}

const EditButton: FC<{ onClick: () => void; text: string }> = ({ onClick, text }) => (
  <Button variant="secondary" size="small" leftIcon={<EditIcon boxSize={4} />} onClick={onClick}>
    {text}
  </Button>
);

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

type DetailStepProps = {
  step: FormStepWithValidation;
  formValues: Dictionary<unknown>;
  site: SiteFullDto;
};

const DetailStep: FC<DetailStepProps> = ({ step, formValues, site }) => {
  const t = useT();
  const router = useRouter();
  const isValid = step.validation.isValidSync(formValues);
  const fieldsRequiringAttention = getFieldsRequiringAttentionCount(step.validation, formValues);
  const entries = useGetFormEntries({
    stepId: step.id,
    values: formValues,
    nullText: "Answer Not Provided",
    entity: { entityName: "sites", entityUUID: site.uuid },
    type: "sites"
  });

  const { handleEdit } = useGetEditEntityHandler({
    entityName: "sites",
    entityUUID: site.uuid,
    entityStatus: site.status ?? "started",
    updateRequestStatus: site.updateRequestStatus ?? "no-update"
  });

  return entries.length === 0 ? null : (
    <Accordion
      key={step.id}
      header={
        <AccordionHeader
          title={step.title ?? ""}
          status={isValid ? "complete" : "error"}
          badge={
            !isValid && fieldsRequiringAttention > 0
              ? t("{count} requires attention", { count: fieldsRequiringAttention })
              : undefined
          }
        />
      }
      actions={
        <EditButton
          onClick={() => {
            if (isEntityAwaitingApproval(site.status, site.updateRequestStatus)) {
              handleEdit();
            } else {
              router.push(
                `/entity/${v3EntityName("sites")}/edit/${site.uuid}?${STEP_QUERY_PARAM}=${encodeURIComponent(step.id)}`
              );
            }
          }}
          text={t("Edit")}
        />
      }
    >
      <Flex flexDirection="column" gap={3}>
        {entries.map((entry, index) => (
          <Fragment key={`${step.id}-${entry.title}-${index}`}>
            <Flex direction="column" gap={1}>
              {entry.title === "Additional Information" ? null : (
                <Text textStyle="300-bold" color="primary.900">
                  {entry.title}:
                </Text>
              )}
              {(() => {
                const rawValue = entry.value ?? "-";
                if (typeof rawValue === "string" || typeof rawValue === "number") {
                  return (
                    <Text
                      textStyle="400"
                      color="neutral.900"
                      dangerouslySetInnerHTML={{ __html: formatEntryValue(rawValue) }}
                    />
                  );
                }
                if (isValidElement(rawValue)) {
                  return rawValue;
                }

                return (
                  <Text textStyle="400" color="neutral.900">
                    {formatEntryValue(String(rawValue))}
                  </Text>
                );
              })()}
            </Flex>
          </Fragment>
        ))}
      </Flex>
    </Accordion>
  );
};

const SiteDetailTab: FC<SiteDetailsTabProps> = ({ site }) => {
  const { steps, defaultValues, fieldsProvider, isFormLoading, providerLoaded } = useEntityFormSetup(
    "sites",
    site.uuid
  );

  const formValues = defaultValues ?? {};

  if (isFormLoading || !providerLoaded) {
    return null;
  }

  return (
    <PageBody className="bg-theme-neutral-100 mx-auto w-[82vw] px-4 py-7">
      <Flex flexDirection="column" gap={2}>
        <WizardFormProvider fieldsProvider={fieldsProvider}>
          {steps.map(step => (
            <DetailStep key={step.id} step={step} formValues={formValues} site={site} />
          ))}
        </WizardFormProvider>
      </Flex>
    </PageBody>
  );
};

export default SiteDetailTab;
