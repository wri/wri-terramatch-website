import { useCallback, useState } from "react";
import { Button, SaveButton, Toolbar, ToolbarClasses, useEditContext, useRefresh, useUpdate } from "react-admin";
import { useFormContext } from "react-hook-form";

import { ConfirmationDialog } from "@/admin/components/Dialogs/ConfirmationDialog";
import { CloneForm } from "@/admin/modules/form/components/CloneForm";
import { CopyFormToOtherEnv } from "@/admin/modules/form/components/CopyFormToOtherEnv";
import { FormBuilderData } from "@/admin/modules/form/components/FormBuilder/types";

export const FormToolbar = (props: { isEdit?: boolean }) => {
  const { record } = useEditContext();
  const { getValues } = useFormContext<FormBuilderData>();
  const [update] = useUpdate<FormBuilderData>();
  const refresh = useRefresh();

  const [showPublishDialog, setShowPublishDialog] = useState(false);

  const publishForm = useCallback(async () => {
    const values = getValues();
    if (values.published) return;

    await update("form", { id: values.id, data: { ...values, published: true } });
    refresh();
    setShowPublishDialog(false);
  }, [getValues, refresh, update]);

  return (
    <Toolbar>
      <div className={ToolbarClasses.defaultToolbar}>
        <SaveButton />

        <div>
          <CloneForm />
          <CopyFormToOtherEnv />
          {props.isEdit ? (
            <Button
              variant="contained"
              size="medium"
              label={record?.published ? "published" : "publish"}
              sx={{ marginLeft: 2 }}
              disabled={record?.published}
              onClick={() => setShowPublishDialog(true)}
            />
          ) : null}
        </div>
      </div>
      <ConfirmationDialog
        open={showPublishDialog}
        title="Publish Form"
        content={`Are you sure you want to publish ${record?.title}? This will also save all in-progress edits.`}
        onAgree={publishForm}
        onDisAgree={() => setShowPublishDialog(false)}
      />
    </Toolbar>
  );
};
