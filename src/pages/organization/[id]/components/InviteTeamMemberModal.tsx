import { yupResolver } from "@hookform/resolvers/yup";
import { useT } from "@transifex/react";
import { useCallback } from "react";
import { useForm } from "react-hook-form";
import * as yup from "yup";

import Button from "@/components/elements/Button/Button";
import Input from "@/components/elements/Inputs/Input/Input";
import Text from "@/components/elements/Text/Text";
import { ModalId } from "@/components/extensive/Modal/ModalConst";
import { ModalBase } from "@/components/extensive/Modal/ModalsBases";
import InlineLoader from "@/components/generic/Loading/InlineLoader";
import { useInviteOrganisationUser } from "@/connections/UserAssociation";
import { useModalContext } from "@/context/modal.provider";
import { useToastContext } from "@/context/toast.provider";
import { useRequestComplete } from "@/hooks/useConnectionUpdate";

interface InviteTeamMemberModalProps {
  organisationUUID: string;
  onSuccess?: () => void;
}

const schema = yup.object({
  email: yup.string().email().required()
});

type FormValues = yup.InferType<typeof schema>;

const InviteTeamMemberModal = ({ organisationUUID, onSuccess }: InviteTeamMemberModalProps) => {
  const t = useT();
  const { closeModal } = useModalContext();
  const { openToast } = useToastContext();

  const {
    register,
    formState: { errors },
    setError,
    reset,
    handleSubmit
  } = useForm<FormValues>({ resolver: yupResolver(schema) });

  const [, { invite: inviteTeamMember, isLoading, inviteFailure }] = useInviteOrganisationUser({
    organisationUuid: organisationUUID
  });

  const hideModal = useCallback(() => {
    closeModal(ModalId.INVITE_MONITORING_PARTNER_MODAL);
    reset();
  }, [closeModal, reset]);

  useRequestComplete(
    isLoading,
    inviteFailure,
    useCallback(
      failure => {
        if (failure == null) {
          if (onSuccess != null) {
            onSuccess();
          }
          openToast(t("Invitation sent successfully"));
          hideModal();
        } else {
          setError("email", {
            message: t("This user already has a TerraMatch account, please try a different email address."),
            type: "validate"
          });
        }
      },
      [onSuccess, openToast, t, setError, hideModal]
    )
  );

  const onSubmit = (data: FormValues) => {
    inviteTeamMember({
      emailAddress: data.email,
      callbackUrl: `${window.location.origin}/auth/signup`
    });
  };

  return (
    <ModalBase>
      <form onSubmit={handleSubmit(onSubmit)} className="flex w-full flex-col gap-8">
        <Text variant="text-bold-headline-1000" className="text-center uppercase">
          {t("Invite Team Member")}
        </Text>
        <Text variant="text-light-body-300" className="mt-2 text-center" containHtml>
          {t(
            "Here, you can invite someone to create a TerraMatch account as member of your organization. This will allow them to access all your applications and project pitches."
          )}
        </Text>
        <Input
          {...register("email", { required: true })}
          label={t("Email Address")}
          type="email"
          error={errors.email}
        />
        <div className="flex w-full justify-between gap-3">
          <Button variant="secondary" onClick={() => hideModal()}>
            {t("Cancel")}
          </Button>
          <Button type="submit" disabled={isLoading}>
            {t("Invite Team Member")}
            <InlineLoader loading={isLoading} />
          </Button>
        </div>
      </form>
    </ModalBase>
  );
};

export default InviteTeamMemberModal;
