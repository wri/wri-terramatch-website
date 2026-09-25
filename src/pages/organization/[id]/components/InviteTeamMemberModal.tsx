import { Flex, Text } from "@chakra-ui/react";
import { yupResolver } from "@hookform/resolvers/yup";
import { useT } from "@transifex/react";
import { showToast } from "@worldresources/wri-design-systems";
import { useCallback } from "react";
import { Controller, useForm } from "react-hook-form";
import * as yup from "yup";

import { useInviteOrganisationUser } from "@/connections/UserAssociation";
import { useRequestComplete } from "@/hooks/useConnectionUpdate";
import ButtonGroup from "@/redesignComponents/actions/Buttons/ButtonGroup/ButtonGroup";
import Modal from "@/redesignComponents/containers/Modal/Modal";
import TextInput from "@/redesignComponents/Forms/Inputs/TextInput";
import InlineMessage from "@/redesignComponents/status/InlineMessage/InlineMessage";
interface InviteTeamMemberModalProps {
  organisationUUID: string;
  open: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

const schema = yup.object({
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
            duration: 5000,
            maxWidth: "auto"
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
      callbackUrl: `${window.location.origin}/auth/signup`
    });
  };

  return (
    <Modal
      open={open}
      onClose={hideModal}
      header={<b className="text-theme-neutral-800">{t("Invite Monitoring Partner")}</b>}
      content={
        <Flex className="flex-col gap-3">
          <Text textStyle="300" color="neutral.800" lineHeight="20px">
            {t(
              "Enter an email address to invite a new user to create a TerraMatch account and join your organization."
            )}
          </Text>
          <InlineMessage
            label={t("This user will receive an email with a link to create a TerraMatch account and join your organization.")}
            variant="warning"
            size="small"
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
              variant: "borderless",
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
