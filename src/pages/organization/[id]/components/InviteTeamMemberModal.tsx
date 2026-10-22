import { Flex, Text } from "@chakra-ui/react";
import { yupResolver } from "@hookform/resolvers/yup";
import { useT } from "@transifex/react";
import { useCallback } from "react";
import { Controller, useForm } from "react-hook-form";
import * as yup from "yup";

import { useInviteOrganisationUser } from "@/connections/UserAssociation";
import { useRequestComplete } from "@/hooks/useConnectionUpdate";
import ButtonGroup from "@/redesignComponents/actions/Buttons/ButtonGroup/ButtonGroup";
import Modal from "@/redesignComponents/containers/Modal/Modal";
import TextInput from "@/redesignComponents/Forms/Inputs/TextInput";
import { showToast } from "@/redesignComponents/status/Toast/showToast";
interface InviteTeamMemberModalProps {
  organisationUUID: string;
  open: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

const schema = yup.object({
  firstName: yup.string().trim().required(),
  lastName: yup.string().trim().required(),
  email: yup.string().email().required()
});

type FormValues = yup.InferType<typeof schema>;

const InviteTeamMemberModal = ({ organisationUUID, open, onClose, onSuccess }: InviteTeamMemberModalProps) => {
  const t = useT();

  const {
    control,
    formState: { errors },
    setError,
    reset,
    handleSubmit
  } = useForm<FormValues>({ resolver: yupResolver(schema) });

  const [, { invite: inviteTeamMember, isLoading, inviteFailure }] = useInviteOrganisationUser({
    organisationUuid: organisationUUID
  });

  const hideModal = useCallback(() => {
    onClose();
    reset();
  }, [onClose, reset]);

  useRequestComplete(
    isLoading,
    inviteFailure,
    useCallback(
      failure => {
        if (failure == null) {
          if (onSuccess != null) {
            onSuccess();
          }
          showToast({
            label: t("Invitation sent successfully"),
            type: "success",
            placement: "bottom",
            duration: 5000
          });
          hideModal();
        } else {
          setError("email", {
            message: t("This user already has a TerraMatch account, please try a different email address."),
            type: "validate"
          });
        }
      },
      [onSuccess, t, setError, hideModal]
    )
  );

  const onSubmit = (data: FormValues) => {
    inviteTeamMember({
      emailAddress: data.email,
      firstName: data.firstName,
      lastName: data.lastName,
      callbackUrl: `${window.location.origin}/auth/signup`
    });
  };

  return (
    <Modal
      open={open}
      onClose={hideModal}
      header={
        <Text textStyle="400-bold" color="neutral.800">
          {t("Invite Team Member")}
        </Text>
      }
      width="34.75rem"
      content={
        <Flex className="flex-col gap-3 px-3 pt-2 pb-3">
          <Flex className="flex-col">
            <Text textStyle="400" color="neutral.900">
              {t(
                "Invite someone to join your organisation. If they don’t have a TerraMatch account yet, they’ll be asked to create one."
              )}
            </Text>
            <Text textStyle="400-bold" color="warning.900">
              {t("Once they join, they’ll have access to all of your applications and project pitches.")}
            </Text>
          </Flex>
          <Controller
            name="firstName"
            control={control}
            render={({ field }) => (
              <TextInput {...field} label={t("First Name")} errorMessage={errors.firstName?.message} required />
            )}
          />
          <Controller
            name="lastName"
            control={control}
            render={({ field }) => (
              <TextInput {...field} label={t("Last Name")} errorMessage={errors.lastName?.message} required />
            )}
          />
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
        </Flex>
      }
      footer={
        <ButtonGroup
          buttons={[
            {
              id: "cancel",
              variant: "secondary",
              children: t("Cancel"),
              onClick: hideModal
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

export default InviteTeamMemberModal;
