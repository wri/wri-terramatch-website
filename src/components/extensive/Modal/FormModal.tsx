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

import { ModalBase } from "./ModalsBases";

export interface FormModalProps {
  title?: string;
  fields: FormField[];
  onSubmit: (data: any) => void;
}

const FormModal = ({ title, fields, onSubmit }: FormModalProps) => {
  const t = useT();
  const { closeModal } = useModalContext();

  const formHook = useForm({
    resolver: yupResolver(getSchema(fields)),
    mode: "onSubmit"
  });

  return (
    <ModalBase className="w-[800px] p-0">
      <div className="flex w-full items-center justify-between gap-4 border-b border-neutral-300 bg-neutral-50 p-8">
        <Text variant="text-bold-headline-1000" className="flex-1">
          {title}
        </Text>
        <IconButton iconProps={{ name: IconNames.CROSS_CIRCLE, width: 32 }} onClick={closeModal} />
      </div>
      <form
        className="w-full p-15"
        onSubmit={formHook.handleSubmit(data => {
          onSubmit(data);
          formHook.reset();
        })}
      >
        <SimpleForm fields={fields} formHook={formHook} onChange={() => {}} />
        <Button type="submit" className="m-auto mt-15">
          {t("Save")}
        </Button>
      </form>
    </ModalBase>
  );
};

export default FormModal;
