import { Flex, Text } from "@chakra-ui/react";
import { useT } from "@transifex/react";
import { FC, useCallback, useEffect } from "react";

import type { IButtonProps } from "@/redesignComponents/actions/Buttons/Button/Button";
import ButtonGroup from "@/redesignComponents/actions/Buttons/ButtonGroup/ButtonGroup";
import Modal from "@/redesignComponents/containers/Modal/Modal";

export interface ModalConfirmationProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  content: React.ReactNode;
  buttonsCancel?: IButtonProps[];
  buttonsPrimary?: IButtonProps[];
  buttonsSecondary?: IButtonProps[];
  size?: "small" | "medium" | "large";
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
  size = "medium",
  classNameGroup
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

  useEffect(() => {
    if (open === false) {
      document.body.style.removeProperty("overflow");
      document.body.style.removeProperty("pointer-events");
    }
    return () => {
      document.body.style.removeProperty("overflow");
      document.body.style.removeProperty("pointer-events");
    };
  }, [open]);

  return (
    <Modal
      open={open}
      onClose={handleClose}
      size={size}
      header={
        <Text textStyle="400-bold" className="text-theme-neutral-800">
          {t(title)}
        </Text>
      }
      content={
        <Flex justifyContent="center" alignItems="center" flexDirection="column" pt={2} width="100%">
          <Text textStyle="400" color="neutral.900" textAlign="left">
            {content}
          </Text>
        </Flex>
      }
      footer={<ButtonGroup groups={groups} classNameGroup={classNameGroup ?? "!w-full"} />}
    />
  );
};

export default ModalConfirmation;
