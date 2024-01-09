import { Button, Dialog, DialogActions, DialogContent, DialogTitle, Divider } from "@mui/material";
import { useState } from "react";
import { useNotify, useRecordContext } from "react-admin";
import { useForm } from "react-hook-form";

import { normalizeFormCreatePayload } from "@/admin/apiProvider/dataNormalizers/formDataNormalizer";
import { AdminTokenStorageKey } from "@/admin/apiProvider/utils/token";
import { appendAdditionalFormQuestionFields } from "@/admin/modules/form/components/FormBuilder/QuestionArrayInput";
import Input from "@/components/elements/Inputs/Input/Input";
import { fetchGetV2FormsLinkedFieldListing } from "@/generated/apiComponents";

export const CloneForm = () => {
  const record: any = useRecordContext();
  const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;
  const token = localStorage.getItem(AdminTokenStorageKey);
  const [open, setOpen] = useState(false);
  const notify = useNotify();
  const formHook = useForm<any>({
    defaultValues: {
      title: record.title
    }
  });

  const { register, handleSubmit, formState } = formHook;

  const cloneForm = async ({ title: formTitle }: any) => {
    const linkedFieldsData: any = await fetchGetV2FormsLinkedFieldListing({});
    const formData = { ...record, title: formTitle };
    const formBody = JSON.parse(
      JSON.stringify(
        normalizeFormCreatePayload(formData, appendAdditionalFormQuestionFields(linkedFieldsData.data) as any),
        null,
        2
      )
        .replace(/"(uuid|stage_id|id|form_id)":\s?("\w.+"|null|undefined),?/gim, "")
        .replace(/,\n\s*(])/gim, "]")
        .replace(/,\n\s*(})/gim, "}")
    );
    if (!formBody.document) {
      delete formBody.document;
    }
    if (!formBody.documentation) {
      delete formBody.documentation;
    }
    if (!formBody.documentation_label) {
      delete formBody.documentation_label;
    }
    if (!formBody.subtitle) {
      delete formBody.subtitle;
    }
    delete formBody.framework_key;

    const response = await fetch(`${baseUrl}/api/v2/admin/forms`, {
      method: "POST",
      headers: {
        "content-type": "application/json",
        //@ts-ignore
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify(formBody)
    });

    if (response.status === 201) {
      notify("Successful");
    }
    setOpen(false);
  };

  return (
    <>
      <Button onClick={() => setOpen(true)}>Clone Form</Button>

      <Dialog open={open} fullWidth>
        <DialogTitle>Clone Form</DialogTitle>

        <Divider />

        <DialogContent className="flex flex-col gap-8">
          <Input
            type="text"
            {...register("title", { required: true })}
            label="Form title"
            description="Update copy form title"
            //@ts-ignore
            error={formState.errors.title}
          />
        </DialogContent>

        <DialogActions sx={{ padding: 3 }}>
          <Button variant="outlined" onClick={handleSubmit(cloneForm)}>
            Clone
          </Button>
          <Button variant="outlined" onClick={e => setOpen(false)}>
            Close
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};
