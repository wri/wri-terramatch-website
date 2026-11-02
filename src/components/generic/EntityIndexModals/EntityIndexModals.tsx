import { Box, Flex, List, Text } from "@chakra-ui/react";
import { useT } from "@transifex/react";
import { FC, useCallback, useMemo, useState } from "react";

import ButtonGroup from "@/redesignComponents/actions/Buttons/ButtonGroup/ButtonGroup";
import Modal from "@/redesignComponents/containers/Modal/Modal";
import ModalDelete from "@/redesignComponents/containers/Modal/ModalDelete";
import ModalSubmit from "@/redesignComponents/containers/Modal/ModalSubmit";
import { CheckApprovedIcon } from "@/redesignComponents/foundations/Icons";

export interface EntityIndexModalItem {
  id: string;
  name: string | null;
}

interface CopyBlock {
  title: string;
  description: string;
}

export interface EntityIndexModalsCopy {
  fallbackName: string;
  delete: { singular: CopyBlock; plural: CopyBlock };
  submit: { singular: CopyBlock; plural: CopyBlock };
  submitted: { singularTitle: string; pluralTitle: string; pluralIntro: string };
}

export interface EntityIndexModalsProps {
  copy: EntityIndexModalsCopy;
  items: EntityIndexModalItem[];
  submittedItems: EntityIndexModalItem[];
  openDeleteModal: boolean;
  openSubmitModal: boolean;
  openSubmittedModal: boolean;
  onDeleteModalOpenChange: (open: boolean) => void;
  onSubmitModalOpenChange: (open: boolean) => void;
  onSubmittedModalOpenChange: (open: boolean) => void;
  onDelete: () => void | Promise<void>;
  onSubmit: () => void | Promise<void>;
}

const EntityNameList: FC<{ names: string[] }> = ({ names }) => (
  <Flex flexDirection="column" gap={4} bg="neutral.200" py={2} px={3} rounded={4}>
    <List.Root as="ul" pl={4} spaceY={2} listStyleType="disc">
      {names.map((name, index) => (
        <List.Item key={`${name}-${index}`} _marker={{ color: "neutral.900" }}>
          <Text textStyle="400" color="neutral.900" as="span">
            {name}
          </Text>
        </List.Item>
      ))}
    </List.Root>
  </Flex>
);

export const EntityIndexModals: FC<EntityIndexModalsProps> = ({
  copy,
  items,
  submittedItems,
  openDeleteModal,
  openSubmitModal,
  openSubmittedModal,
  onDeleteModalOpenChange,
  onSubmitModalOpenChange,
  onSubmittedModalOpenChange,
  onDelete,
  onSubmit
}) => {
  const t = useT();
  const [isDeleting, setIsDeleting] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const modalItems = useMemo(
    () => items.map(({ id, name }) => ({ id, label: name ?? copy.fallbackName })),
    [copy.fallbackName, items]
  );
  const submittedNames = useMemo(
    () => submittedItems.map(({ name }) => name ?? copy.fallbackName),
    [copy.fallbackName, submittedItems]
  );
  const isSingleSubmitted = submittedNames.length === 1;

  const handleDelete = useCallback(async () => {
    try {
      setIsDeleting(true);
      await onDelete();
      onDeleteModalOpenChange(false);
    } finally {
      setIsDeleting(false);
    }
  }, [onDelete, onDeleteModalOpenChange]);

  const handleSubmit = useCallback(async () => {
    try {
      setIsSubmitting(true);
      await onSubmit();
      onSubmitModalOpenChange(false);
    } finally {
      setIsSubmitting(false);
    }
  }, [onSubmit, onSubmitModalOpenChange]);

  const handleCloseSubmitted = useCallback(() => {
    onSubmittedModalOpenChange(false);
  }, [onSubmittedModalOpenChange]);

  return (
    <>
      <ModalDelete
        open={openDeleteModal}
        onOpenChange={onDeleteModalOpenChange}
        items={modalItems}
        singular={copy.delete.singular}
        plural={copy.delete.plural}
        isLoading={isDeleting}
        onConfirm={handleDelete}
      />
      <ModalSubmit
        open={openSubmitModal}
        onOpenChange={onSubmitModalOpenChange}
        items={modalItems}
        singular={copy.submit.singular}
        plural={copy.submit.plural}
        isLoading={isSubmitting}
        confirmLabel={t("Submit")}
        onConfirm={handleSubmit}
      />
      <Modal
        open={openSubmittedModal && submittedNames.length > 0}
        onClose={handleCloseSubmitted}
        size="medium"
        header={
          <Text textStyle="400-bold" color="neutral.800">
            {isSingleSubmitted ? copy.submitted.singularTitle : copy.submitted.pluralTitle}
          </Text>
        }
        content={
          isSingleSubmitted ? (
            <Flex justifyContent="center" alignItems="center" flexDirection="column" pt={2} px={4}>
              <CheckApprovedIcon boxSize={8} color="success.500" mb={2} />
              <Text textStyle="500-bold" color="neutral.900" textAlign="center">
                {submittedNames[0]}
              </Text>
              <Text textStyle="400" color="neutral.900">
                {t("has been submitted.")}
              </Text>
            </Flex>
          ) : (
            <Box px={4}>
              <Text textStyle="400" color="neutral.900" display="flex" gap={0.5} mb={3} alignItems="center">
                <CheckApprovedIcon boxSize={5} color="success.500" mr={2} />
                {copy.submitted.pluralIntro}
                <Text textStyle="400-bold" color="neutral.900" ml={0.5}>
                  {t("have been submitted:")}
                </Text>
              </Text>
              <EntityNameList names={submittedNames} />
            </Box>
          )
        }
        footer={
          <ButtonGroup
            buttons={[
              {
                id: "close",
                className: "!w-fit",
                variant: "secondary",
                children: t("Close"),
                autoFocus: true,
                onClick: handleCloseSubmitted
              }
            ]}
          />
        }
      />
    </>
  );
};

export default EntityIndexModals;
