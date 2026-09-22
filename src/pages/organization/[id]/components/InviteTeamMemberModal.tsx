import { Text } from "@chakra-ui/react";
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
import { InformationRequiredIcon } from "@/redesignComponents/foundations/Icons";
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
        <div className="flex flex-col gap-3">
          <Text textStyle="400" color="neutral.900">
            {t("Invite Team Member")}
          </Text>
          <div className="flex items-center gap-2">
            <InformationRequiredIcon color="neutral.700" className="mb-[21px]" />
            <Text textStyle="300" color="neutral.800" lineHeight="20px">
              {t(
                "Here, you can invite someone to create a TerraMatch account as member of your organization. This will allow them to access all your applications and project pitches."
              )}
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
