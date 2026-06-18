import { useT } from "@transifex/react";
import { FC, useCallback } from "react";
import { Flex, Text } from "@chakra-ui/react";

import ButtonGroup from "@/redesignComponents/actions/Buttons/ButtonGroup/ButtonGroup";
import { IButtonProps } from "@/redesignComponents/actions/Buttons/Button/Button";
import Modal from "@/redesignComponents/containers/Modal/Modal";

export interface ModalConfirmationProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  content: string;
  buttonsCancel?: IButtonProps[];
  buttonsPrimary?: IButtonProps[];
  buttonsSecondary?: IButtonProps[];
  size?: "small" | "medium" | "large";
}

const ModalConfirmation: FC<ModalConfirmationProps> = ({
  open,
  onOpenChange,
  title,
  content,
  buttonsCancel,
  buttonsPrimary,
  buttonsSecondary,
  size = "medium"
}) => {
  const t = useT();

  const handleClose = useCallback(() => {
    onOpenChange(false);
  }, [onOpenChange]);

  return (
    <Modal
      open={open}
      onClose={handleClose}
      size={size}
      header={<b className="text-theme-neutral-800">{t(title)}</b>}
      content={
        <Flex justifyContent="center" alignItems="center" flexDirection="column" pt={2} width="100%">
          <Text textStyle="400" color="neutral.900" textAlign="center">
            {content}
          </Text>
        </Flex>
      }
      footer={
        <ButtonGroup
          buttons={buttonsCancel?.map(button => ({ ...button, size: "small", variant: "secondary" })) ?? []}
          groups={[
            {
              id: "secondary",
              buttons: buttonsSecondary?.map(button => ({ ...button, size: "small", variant: "secondary" })) ?? []
            },
            {
              id: "primary",
              buttons: buttonsPrimary?.map(button => ({ ...button, size: "small", variant: "primary" })) ?? []
            }
          ]}
        />
      }
    />
  );
};

export default ModalConfirmation;
