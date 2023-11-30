import { useState } from "react";
import { Button, SaveButton, Toolbar, ToolbarClasses, useEditContext, useRefresh } from "react-admin";
import { When } from "react-if";

import { ConfirmationDialog } from "@/admin/components/Dialogs/ConfirmationDialog";
import { CopyFormToOtherEnv } from "@/admin/modules/form/components/CopyFormToOtherEnv";
import { usePatchV2AdminFormsUUIDPublish } from "@/generated/apiComponents";

export const FormToolbar = (props: { isEdit?: boolean }) => {
  const { record } = useEditContext();
  const refresh = useRefresh();

  const [showPublishDialog, setShowPublishDialog] = useState(false);
  const { mutate: publishForm } = usePatchV2AdminFormsUUIDPublish({
    onSuccess() {
      refresh();
      setShowPublishDialog(false);
    }
  });

  return (
    <Toolbar>
      <div className={ToolbarClasses.defaultToolbar}>
        <SaveButton />

        <div>
          <CopyFormToOtherEnv />
          <When condition={props.isEdit}>
            <Button
              variant="contained"
              size="medium"
              label={record?.published ? "published" : "publish"}
              sx={{ marginLeft: 2 }}
              disabled={record?.published}
              onClick={() => setShowPublishDialog(true)}
            />
          </When>
        </div>
      </div>
      <ConfirmationDialog
        open={showPublishDialog}
        title="Publish Form"
        content={`Are you sure you want to publish ${record?.title}?`}
        onAgree={() => {
          //@ts-ignore
          publishForm({ pathParams: { uuid: record?.uuid } });
        }}
        onDisAgree={() => setShowPublishDialog(false)}
      />
    </Toolbar>
  );
};
