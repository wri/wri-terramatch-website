import { Flex, Text } from "@chakra-ui/react";
import { useT } from "@transifex/react";
import { useRouter } from "next/router";
import { FC } from "react";
import * as yup from "yup";

import { formatEntryValue } from "@/admin/apiProvider/utils/entryFormat";
import PageBody from "@/components/extensive/PageElements/Body/PageBody";
import { getFormEntries } from "@/components/extensive/WizardForm/FormSummaryRow/getFormEntries";
import { STEP_QUERY_PARAM } from "@/components/extensive/WizardForm/useFormNavigation";
import { ProjectFullDto } from "@/generated/v3/entityService/entityServiceSchemas";
import { v3EntityName } from "@/helpers/entity";
import { useEntityFormSetup } from "@/hooks/useEntityFormSetup";
import Button from "@/redesignComponents/actions/Buttons/Button/Button";
import Accordion from "@/redesignComponents/containers/Accordion/Accordion";
import AccordionHeader from "@/redesignComponents/containers/Accordion/AccordionHeader";
import { Edit } from "@/redesignComponents/foundations/Icons";

interface ProjectDetailsTabProps {
  project: ProjectFullDto;
}

const EditButton: FC<{ onClick: () => void }> = ({ onClick }) => (
  <Button variant="secondary" size="small" leftIcon={<Edit boxSize={4} />} onClick={onClick}>
    Edit
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

const ProjectDetailTab = ({ project }: ProjectDetailsTabProps) => {
  const t = useT();
  const router = useRouter();
  const { steps, defaultValues, fieldsProvider, isFormLoading, providerLoaded } = useEntityFormSetup(
    "projects",
    project?.uuid
  );

  const formValues = defaultValues ?? {};

  if (isFormLoading || !providerLoaded) {
    return null;
  }

  return (
    <PageBody>
      <Flex flexDirection="column" gap={2}>
        {steps.map(step => {
          const isValid = step.validation.isValidSync(formValues);
          const fieldsRequiringAttention = getFieldsRequiringAttentionCount(step.validation, formValues);
          const entries = getFormEntries(
            fieldsProvider,
            {
              stepId: step.id,
              values: formValues,
              nullText: "Answer Not Provided",
              type: "projects",
              entity: { entityName: "projects", entityUUID: project.uuid }
            },
            t
          );

          return (
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
                  onClick={() =>
                    router.push(
                      `/entity/${v3EntityName("projects")}/edit/${
                        project?.uuid
                      }?${STEP_QUERY_PARAM}=${encodeURIComponent(step.id)}`
                    )
                  }
                />
              }
            >
              <Flex flexDirection="column" gap={3}>
                {entries.map((entry, index) => (
                  <Flex key={`${step.id}-${entry.title}-${index}`} direction="column" gap={1}>
                    <Text fontSize="14px" lineHeight="20px" color="primary.900" fontWeight="bold">
                      {entry.title}
                    </Text>
                    {(() => {
                      const rawValue = entry.value ?? "-";
                      if (typeof rawValue === "string" || typeof rawValue === "number") {
                        return (
                          <Text
                            fontSize="16px"
                            lineHeight="24px"
                            color="neutral.900"
                            dangerouslySetInnerHTML={{ __html: formatEntryValue(rawValue) }}
                          />
                        );
                      }

                      return (
                        <Text fontSize="16px" lineHeight="24px" color="neutral.900">
                          {formatEntryValue(rawValue)}
                        </Text>
                      );
                    })()}
                  </Flex>
                ))}
              </Flex>
            </Accordion>
          );
        })}
      </Flex>
    </PageBody>
  );
};

export default ProjectDetailTab;
