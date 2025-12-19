import {
  Button,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogProps,
  DialogTitle
} from "@mui/material";
import { flatten } from "lodash";
import { useCallback, useMemo, useState } from "react";
import { AutocompleteArrayInput, Form, RaRecord, TextInput, useNotify, useRefresh, useShowContext } from "react-admin";
import * as yup from "yup";

import { Choice } from "@/admin/types/common";
import { validateForm } from "@/admin/utils/forms";
import { useForm } from "@/connections/Form";
import { useSubmission } from "@/connections/FormSubmission";
import { FormSubmissionRead } from "@/generated/apiSchemas";
import { useRequestSuccess } from "@/hooks/useConnectionUpdate";
import { optionToChoices } from "@/utils/options";

import { status } from "./ApplicationShowAside";

interface ApplicationRequestMoreInfoModalProps extends DialogProps {
  handleClose: () => void;
  status: null | status;
}

const statusTitles = {
  rejected: "Reject Application",
  approved: "Approve Application",
  "requires-more-information": "Request more information for this Application"
};

const moreInfoValidationSchema = yup.object({
  feedback: yup.string().nullable(),
  feedbackFields: yup.array().min(1).of(yup.string()).required()
});
const genericValidationSchema = yup.object({
  feedback: yup.string().nullable()
});

const ApplicationRequestMoreInfoModal = ({
  handleClose,
  status,
  ...dialogProps
}: ApplicationRequestMoreInfoModalProps) => {
  const refresh = useRefresh();
  const notify = useNotify();
  const { record } = useShowContext<FormSubmissionRead & RaRecord>();
  const uuid = record?.current_submission?.uuid as string;
  const formUuid = record?.current_submission?.form_uuid as string;
  const [, { data: form }] = useForm({ id: formUuid, enabled: formUuid != null });
  const [isAllSelected, setIsAllSelected] = useState(false);

  const feedbackFields = useMemo(
    (): Choice[] =>
      optionToChoices(
        flatten(form?.sections.map(({ questions }) => questions)).map(({ label }) => ({
          title: label,
          value: label
        })) ?? []
      ),
    [form?.sections]
  );

  const [, { update, isUpdating, updateFailure }] = useSubmission({ id: uuid, enabled: uuid != null });
  useRequestSuccess(
    isUpdating,
    updateFailure,
    () => {
      refresh();
      notify("Application status updated", { type: "success" });
    },
    "Application update failed"
  );

  const handleSave = useCallback(
    (data: any) => {
      if (status != null && update != null) {
        update({
          status,
          feedback: data.feedback,
          feedbackFields: isAllSelected ? feedbackFields.map(f => f.id) : data.feedbackFields
        });
      }

      return handleClose();
    },
    [feedbackFields, handleClose, isAllSelected, status, update]
  );

  return (
    <Dialog {...dialogProps} fullWidth>
      <Form
        onSubmit={handleSave}
        validate={validateForm(
          status === "requires-more-information" && !isAllSelected ? moreInfoValidationSchema : genericValidationSchema
        )}
      >
        {status == null ? null : <DialogTitle>{statusTitles[status as status]}</DialogTitle>}
        <DialogContent>
          <TextInput source="feedback" label="Feedback" fullWidth multiline margin="dense" helperText={false} />
          {status === "requires-more-information" && feedbackFields.length > 0 && !isAllSelected ? (
            <AutocompleteArrayInput
              source="feedbackFields"
              label="Fields"
              choices={feedbackFields}
              fullWidth
              margin="dense"
            />
          ) : null}
          {isAllSelected && (
            <div>
              All Fields selected | <button onClick={() => setIsAllSelected(false)}>Clear</button>
            </div>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          {status === "requires-more-information" && !isAllSelected && (
            <Button onClick={() => setIsAllSelected(true)}>Select All Fields</Button>
          )}
          <Button variant="contained" type="submit" disabled={isUpdating}>
            {isUpdating ? <CircularProgress size={18} sx={{ marginRight: 1 }} /> : null}
            Update Status
          </Button>
        </DialogActions>
      </Form>
    </Dialog>
  );
};

export default ApplicationRequestMoreInfoModal;
