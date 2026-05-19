import { Text } from "@chakra-ui/react";
// @ts-ignore
import { yupResolver } from "@hookform/resolvers/yup";
import { useT } from "@transifex/react";
import { useCallback } from "react";
import { Controller, useForm } from "react-hook-form";
import * as yup from "yup";

import { useUserAssociationCreation } from "@/connections/UserAssociation";
import { useToastContext } from "@/context/toast.provider";
import { useRequestComplete } from "@/hooks/useConnectionUpdate";
import ButtonGroup from "@/redesignComponents/actions/Buttons/ButtonGroup/ButtonGroup";
import Modal from "@/redesignComponents/containers/Modal/Modal";
import TextInput from "@/redesignComponents/Forms/Inputs/TextInput";
import { InformationRequiredIcon } from "@/redesignComponents/foundations/Icons";
import ApiSlice from "@/store/apiSlice";
interface InviteMonitoringPartnerModalProps {
  projectUUID: string;
  open: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

const schema = yup.object({
  email: yup.string().email().required()
});

type FormValues = yup.InferType<typeof schema>;

const InviteMonitoringPartnerModal = ({ projectUUID, open, onClose, onSuccess }: InviteMonitoringPartnerModalProps) => {
  const t = useT();
  const { openToast } = useToastContext();

  const {
    control,
    formState: { errors },
    setError,
    reset,
    handleSubmit
  } = useForm<FormValues>({ resolver: yupResolver(schema) });

  const [, { isCreating, createFailure, create: invitePartner }] = useUserAssociationCreation({
    uuid: projectUUID,
    model: "projects"
  });

  const handleClose = useCallback(() => {
    reset();
    onClose();
  }, [reset, onClose]);

  useRequestComplete(
    isCreating,
    createFailure,
    useCallback(
      failure => {
        if (failure != null) {
          setError("email", {
            message: t(
              "This user is already a monitoring partner for this project, please try a different email address."
            ),
            type: "validate"
          });
        } else {
          ApiSlice.pruneCache("associatedUsers");
          onSuccess?.();
          openToast(t("Invitation sent successfully"));
          handleClose();
        }
      },
      [setError, onSuccess, openToast, handleClose, t]
    )
  );

  const onSubmit = (data: FormValues) => {
    invitePartner({
      emailAddress: data.email,
      isManager: false
    });
  };

  return (
    <Modal
      open={open}
      onClose={handleClose}
      header={<b className="text-theme-neutral-800">{t("Invite Monitoring Partner")}</b>}
      content={
        <div className="mb-[-12px] flex flex-col gap-3">
          <Text textStyle="400" color="neutral.900">
            {t("Invite a new team member to join your project as a Monitoring Partner.")}
          </Text>
          <div className="flex items-center gap-2">
            <InformationRequiredIcon color="neutral.700" className="mb-[21px]" />
            <Text textStyle="300" color="neutral.800" lineHeight="20px">
              {t("This action will provide them access to all your project data and reports.")}
            </Text>
          </div>
          <Controller
            name="email"
            control={control}
            render={({ field }) => (
              <TextInput
                {...field}
                label={t("Email Address")}
                type="email"
                errorMessage={errors.email?.message}
                required
              />
            )}
          />
        </div>
      }
      footer={
        <ButtonGroup
          buttons={[
            {
              id: "cancel",
              variant: "borderless",
              children: t("Cancel"),
              onClick: handleClose
            },
            {
              id: "send",
              children: t("Send Invite"),
              onClick: handleSubmit(onSubmit)
            }
          ]}
        />
      }
    />
  );
};

export default InviteMonitoringPartnerModal;
