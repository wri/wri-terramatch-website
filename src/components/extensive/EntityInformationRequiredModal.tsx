import { Flex, Text } from "@chakra-ui/react";
import { useT } from "@transifex/react";
import { kebabCase } from "lodash";
import { useRouter } from "next/router";
import { FC } from "react";

import { STEP_QUERY_PARAM } from "@/components/extensive/WizardForm/useFormNavigation";
import { FormEntity } from "@/connections/Form";
import { useGetReadableEntityName } from "@/hooks/entity/useGetReadableEntityName";
import ModalConfirmation from "@/redesignComponents/containers/Modal/ModalConfirmation";
import { InformationRequiredIcon } from "@/redesignComponents/foundations/Icons";
import { EntityName, SingularEntityName } from "@/types/common";

type EntityInformationRequiredModalProps = {
  feedback?: string | null;
  entityName: FormEntity;
  entityUuid: string;
  formStepId?: string | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

const EntityInformationRequiredModal: FC<EntityInformationRequiredModalProps> = ({
  open,
  onOpenChange,
  feedback,
  entityName,
  entityUuid,
  formStepId
}) => {
  const t = useT();
  const router = useRouter();

  const { getReadableEntityName } = useGetReadableEntityName();
  const readableEntityName = getReadableEntityName(entityName as EntityName | SingularEntityName, true);

  const handleClose = () => onOpenChange(false);

  const handleProvideFeedback = () => {
    const targetStepId = formStepId ?? "summary";

    handleClose();
    router.push(
      `/entity/${kebabCase(entityName)}/edit/${entityUuid}?${STEP_QUERY_PARAM}=${encodeURIComponent(targetStepId)}`
    );
  };

  return (
    <ModalConfirmation
      open={open}
      onOpenChange={open => !open && handleClose()}
      title={t("Information Required")}
      content={
        <Flex direction="column" align="center" gap={3}>
          <InformationRequiredIcon color="warning.500" boxSize={"2rem"} />
          <Text textStyle="400" color="neutral.900">
            {t(
              "A Reviewer requested additional details on this {entityName}. Please review the feedback provided and update the relevant fields.",
              { entityName: readableEntityName }
            )}
          </Text>
          <Text textStyle="400" color="neutral.900">
            {feedback ?? t("No feedback provided")}
          </Text>
        </Flex>
      }
      buttonsPrimary={[
        {
          id: "provide-feedback",
          children: t("Update {entityName}", { entityName: readableEntityName }),
          className: "!w-full",
          variant: "primary",
          onClick: handleProvideFeedback
        }
      ]}
      buttonsCancel={[
        { id: "close", children: t("Close"), onClick: handleClose, className: "!w-full", variant: "secondary" }
      ]}
    />
  );
};

export default EntityInformationRequiredModal;
