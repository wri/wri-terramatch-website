import { yupResolver } from "@hookform/resolvers/yup";
import { useT } from "@transifex/react";
import { useForm } from "react-hook-form";

import Button from "@/components/elements/Button/Button";
import IconButton from "@/components/elements/IconButton/IconButton";
import Text from "@/components/elements/Text/Text";
import { IconNames } from "@/components/extensive/Icon/Icon";
import SimpleForm from "@/components/extensive/SimpleForm/SimpleForm";
import { FormField } from "@/components/extensive/WizardForm/types";
import { getSchema } from "@/components/extensive/WizardForm/utils";
import { useModalContext } from "@/context/modal.provider";

import { ModalId } from "./ModalConst";
import { ModalBase } from "./ModalsBases";

export interface FormModalProps {
  title?: string;
  fields: FormField[];
  onSubmit: (data: any) => void;
  defaultValues?: Record<string, any>;
}

const FormModal = ({ title, fields, onSubmit, defaultValues }: FormModalProps) => {
  const t = useT();
  const { closeModal } = useModalContext();

  const formHook = useForm({
    resolver: yupResolver(getSchema(fields)),
    mode: "onSubmit",
    defaultValues
  });

  return (
    <ModalBase className="w-[800px] p-0">
      <div className="flex w-full items-center justify-between gap-4 border-b border-neutral-300 bg-neutral-50 px-8 py-6">
        <Text variant="text-20-bold" className="flex-1 leading-[normal]">
          {title}
        </Text>
        <IconButton
          iconProps={{ name: IconNames.CROSS_CIRCLE, width: 24 }}
          onClick={() => closeModal(ModalId.FORM_MODAL)}
          className="text-darkCustom-100 hover:text-primary"
        />
      </div>
      <form
        className="custom-modal-form relative w-full overflow-y-auto px-8 py-10 "
        onSubmit={formHook.handleSubmit(data => {
          onSubmit(data);
          formHook.reset();
        })}
      >
        <SimpleForm fields={fields} formHook={formHook} onChange={() => {}} />
        <div className="mt-10 flex w-full justify-end">
          <Button type="submit" className="px-6 py-3">
            {t("Save")}
          </Button>
        </div>
      </form>
    </ModalBase>
  );
};

export default FormModal;
