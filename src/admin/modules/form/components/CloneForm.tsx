import { Button, Dialog, DialogActions, DialogContent, DialogTitle, Divider } from "@mui/material";
import { useCallback, useState } from "react";
import { useNotify, useRecordContext } from "react-admin";
import { SubmitHandler, useForm } from "react-hook-form";

import { FormBuilderData, formBuilderToAttributes } from "@/admin/modules/form/components/FormBuilder/types";
import Input from "@/components/elements/Inputs/Input/Input";
import { useFormCreate } from "@/connections/util/Form";
import { useRequestComplete } from "@/hooks/useConnectionUpdate";
import Log from "@/utils/log";

type TitleForm = {
  title: string;
};

export const CloneForm = () => {
  const record = useRecordContext<FormBuilderData>();
  const [open, setOpen] = useState(false);
  const notify = useNotify();
  const formHook = useForm<TitleForm>({
    defaultValues: {
      title: record.title
    }
  });
  const [, { create, isCreating, createFailure }] = useFormCreate({});

  const { register, handleSubmit, formState } = formHook;

  useRequestComplete(
    isCreating,
    useCallback(() => {
      if (createFailure != null) {
        Log.error("Form clone failed", createFailure);
        notify("Form clone failed", { type: "error" });
      } else {
        notify("Form clone succeeded");
      }

      setOpen(false);
    }, [createFailure, notify])
  );

  const cloneForm = useCallback<SubmitHandler<TitleForm>>(
    ({ title }) => create(formBuilderToAttributes({ ...record, title, published: false, frameworkKey: undefined })),
    [create, record]
  );

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
          <Button variant="outlined" onClick={() => setOpen(false)}>
            Close
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};
