import { Flex, Text } from "@chakra-ui/react";
import { useT } from "@transifex/react";
import { ComponentProps, FC, useCallback } from "react";

import type { IButtonProps } from "@/redesignComponents/actions/Buttons/Button/Button";
import ButtonGroup from "@/redesignComponents/actions/Buttons/ButtonGroup/ButtonGroup";
import Modal from "@/redesignComponents/containers/Modal/Modal";

export interface ModalConfirmationProps
  extends Omit<ComponentProps<typeof Modal>, "header" | "footer" | "onClose" | "content"> {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  content: React.ReactNode;
  buttonsCancel?: IButtonProps[];
  buttonsPrimary?: IButtonProps[];
  buttonsSecondary?: IButtonProps[];
  confirmButton?: IButtonProps;
  cancelButton?: Omit<IButtonProps, "onClick">;
  contentLayout?: "text" | "custom";
  footerBorderColor?: string;
  classNameGroup?: string;
}

const ModalConfirmation: FC<ModalConfirmationProps> = ({
  open,
  onOpenChange,
  title,
  content,
  buttonsCancel,
  buttonsPrimary,
  buttonsSecondary,
  confirmButton,
  cancelButton,
  contentLayout = "text",
  footerBorderColor,
  size = "medium",
  classNameGroup,
  ...modalProps
}) => {
  const t = useT();

  const handleClose = useCallback(() => {
    onOpenChange(false);
  }, [onOpenChange]);

  const groups = [
    ...(buttonsCancel == null || buttonsCancel.length === 0 ? [] : [{ id: "cancel", buttons: buttonsCancel }]),
    ...(buttonsSecondary == null || buttonsSecondary.length === 0
      ? []
      : [{ id: "secondary", buttons: buttonsSecondary }]),
    ...(buttonsPrimary == null || buttonsPrimary.length === 0 ? [] : [{ id: "primary", buttons: buttonsPrimary }])
  ];

  return (
    <Modal
      {...modalProps}
      open={open}
      onClose={handleClose}
      size={size}
      header={
        <Text textStyle="400-bold" color="neutral.800">
          {t(title)}
        </Text>
      }
      content={
        contentLayout === "custom" ? (
          content
        ) : (
          <Flex justifyContent="center" alignItems="center" flexDirection="column" pt={2} width="100%">
            <Text textStyle="400" color="neutral.900" textAlign="left">
              {content}
            </Text>
          </Flex>
        )
      }
      footer={
        confirmButton != null ? (
          <ButtonGroup
            borderColor={footerBorderColor}
            buttons={[
              { id: "cancel", variant: "secondary", children: t("Cancel"), ...cancelButton, onClick: handleClose },
              confirmButton
            ]}
          />
        ) : (
          <ButtonGroup borderColor={footerBorderColor} groups={groups} classNameGroup={classNameGroup ?? "!w-full"} />
        )
      }
    />
  );
};

export default ModalConfirmation;
