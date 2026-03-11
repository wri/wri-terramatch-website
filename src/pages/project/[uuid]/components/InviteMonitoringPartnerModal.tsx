import { Text } from "@chakra-ui/react";
import { yupResolver } from "@hookform/resolvers/yup";
import { useT } from "@transifex/react";
import { useCallback } from "react";
import { useForm } from "react-hook-form";
import * as yup from "yup";

import { useUserAssociationCreation } from "@/connections/UserAssociation";
import { useToastContext } from "@/context/toast.provider";
import { useRequestComplete } from "@/hooks/useConnectionUpdate";
import Button from "@/redesignComponents/actions/Buttons/Button/Button";
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
    register,
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
    useCallback(() => {
      if (createFailure != null) {
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
    }, [createFailure, setError, onSuccess, openToast, handleClose, t])
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
        <div className="flex flex-col gap-3">
          <Text textStyle="400" color="neutral.900">
            {t("Invite a new team member to join your project as a Monitoring Partner.")}
          </Text>
          <div className="flex items-baseline gap-2">
            <InformationRequiredIcon color="neutral.700" />
            <Text textStyle="400" color="neutral.800" lineHeight="20px">
              {t("This action will provide them access to all your project data and reports.")}
            </Text>
          </div>
          <TextInput
            {...register("email")}
            label={t("Email Address")}
            type="email"
            errorMessage={errors.email?.message}
            required
          />
        </div>
      }
      footer={
        <div className="mt-[-20px] grid w-full grid-cols-2 gap-3">
          <Button variant="borderless" onClick={handleClose}>
            {t("Cancel")}
          </Button>
          <Button onClick={handleSubmit(onSubmit)}>{t("Send Invite")}</Button>
        </div>
      }
    />
  );
};

export default InviteMonitoringPartnerModal;
