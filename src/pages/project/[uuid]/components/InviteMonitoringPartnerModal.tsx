import { yupResolver } from "@hookform/resolvers/yup";
import { useT } from "@transifex/react";
import { useForm } from "react-hook-form";
import * as yup from "yup";

import Button from "@/components/elements/Button/Button";
import Input from "@/components/elements/Inputs/Input/Input";
import Text from "@/components/elements/Text/Text";
import { ModalBase } from "@/components/extensive/Modal/Modal";
import { useModalContext } from "@/context/modal.provider";
import { useToastContext } from "@/context/toast.provider";
import { usePostV2ProjectsUUIDInvite } from "@/generated/apiComponents";

interface InviteMonitoringPartnerModalProps {
  projectUUID: string;
  onSuccess?: () => void;
}

const schema = yup.object({
  email: yup.string().email().required()
});

type FormValues = yup.InferType<typeof schema>;

const InviteMonitoringPartnerModal = ({ projectUUID, onSuccess }: InviteMonitoringPartnerModalProps) => {
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

  const { mutate: invitePartner } = usePostV2ProjectsUUIDInvite({
    onSuccess() {
      onSuccess?.();
      openToast(t("Invitation sent successfully"));
      hideModal();
    },
    onError() {
      setError("email", {
        message: t("This user is already a monitoring partner for this project, please try a different email address."),
        type: "validate"
      });
    }
  });

  const onSubmit = (data: FormValues) => {
    invitePartner({
      pathParams: { uuid: projectUUID },
      queryParams: {
        email_address: data.email,
        callback_url: window.location.origin + `/auth/signup`
      }
    });
  };

  const hideModal = () => {
    closeModal();
    reset();
  };

  return (
    <ModalBase>
      <form onSubmit={handleSubmit(onSubmit)} className="flex w-full flex-col gap-8">
        <Text variant="text-bold-headline-1000" className="text-center uppercase">
          {t("Invite Monitoring Partner")}
        </Text>
        <Text variant="text-light-body-300" className="mt-2 text-center" containHtml>
          {t(
            "Here, you can invite someone to create a TerraMatch account as an observer. This will allow them to access all your project data and reports."
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
          <Button type="submit">{t("Invite monitoring partner")}</Button>
        </div>
      </form>
    </ModalBase>
  );
};

export default InviteMonitoringPartnerModal;
