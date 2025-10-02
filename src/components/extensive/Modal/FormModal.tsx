import { yupResolver } from "@hookform/resolvers/yup";
import { useT } from "@transifex/react";
import { FC, useMemo } from "react";
import { useForm } from "react-hook-form";

import Button from "@/components/elements/Button/Button";
import IconButton from "@/components/elements/IconButton/IconButton";
import Text from "@/components/elements/Text/Text";
import { IconNames } from "@/components/extensive/Icon/Icon";
import SimpleForm from "@/components/extensive/SimpleForm/SimpleForm";
import { getSchema } from "@/components/extensive/WizardForm/utils";
import { useModalContext } from "@/context/modal.provider";
import { useFieldsProvider } from "@/context/wizardForm.provider";

import { ModalId } from "./ModalConst";
import { ModalBase } from "./ModalsBases";

export interface FormModalProps {
  title?: string;
  onSubmit: (data: any) => void;
  defaultValues?: Record<string, any>;
}

const FormModal: FC<FormModalProps> = ({ title, onSubmit, defaultValues }) => {
  const t = useT();
  const { closeModal } = useModalContext();

  const fieldsProvider = useFieldsProvider();
  const resolver = useMemo(() => yupResolver(getSchema(fieldsProvider, t)), [fieldsProvider, t]);
  const formHook = useForm({ resolver, mode: "onSubmit", defaultValues });
  const fieldIds = useMemo(() => fieldsProvider.fieldNames(fieldsProvider.stepIds()[0]), [fieldsProvider]);

  return (
    <ModalBase className="w-[800px] p-0">
      <div className="flex w-full items-center justify-between gap-4 border-b border-neutral-300 bg-neutral-50 p-8">
        <Text variant="text-bold-headline-1000" className="flex-1">
          {title}
        </Text>
        <IconButton
          iconProps={{ name: IconNames.CROSS_CIRCLE, width: 32 }}
          onClick={() => closeModal(ModalId.FORM_MODAL)}
        />
      </div>
      <form
        className="w-full p-15"
        onSubmit={formHook.handleSubmit(data => {
          onSubmit(data);
          formHook.reset();
        })}
      >
        <SimpleForm fieldIds={fieldIds} formHook={formHook} />
        <Button type="submit" className="m-auto mt-15">
          {t("Save")}
        </Button>
      </form>
    </ModalBase>
  );
};

export default FormModal;
