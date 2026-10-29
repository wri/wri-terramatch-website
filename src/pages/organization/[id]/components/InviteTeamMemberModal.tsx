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
import ApiSlice, { PendingError } from "@/store/apiSlice";
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

  // The API returns one message per validation failure; map the ones the user can act on to their copy.
  const inviteErrorMessage = useCallback(
    (failure: PendingError) => {
      const message = [failure.message].flat().join(" ");
      if (message.includes("already been invited")) {
        return t("This user has already been invited to this organisation, please try a different email address.");
      }
      if (message.includes("already a member")) {
        return t("This user is already a member of the organisation.");
      }
      if (message.includes("user type cannot be added")) {
        return t("This user type cannot be added to the organisation, please try a different email address.");
      }
      if (message.includes("pending request to join another organisation")) {
        return t(
          "This user has a pending request to join another organisation. If this is incorrect, please reach out to TerraMatch support at support@terramatch.org."
        );
      }
      return t("Unable to send the invite. Please try again.");
    },
    [t]
  );

  useRequestComplete(
    isLoading,
    inviteFailure,
    useCallback(
      failure => {
        if (failure == null) {
          // The invited member is added to the team list on the server, so drop the cached index to show it now.
          ApiSlice.pruneCache("associatedUsers");
          if (onSuccess != null) {
            onSuccess();
          }
          showToast({
            label: t("Invite sent successfully"),
            type: "success",
            placement: "bottom",
            duration: 5000
          });
          hideModal();
        } else {
          setError("email", { message: inviteErrorMessage(failure), type: "validate" });
        }
      },
      [onSuccess, t, setError, hideModal, inviteErrorMessage]
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
