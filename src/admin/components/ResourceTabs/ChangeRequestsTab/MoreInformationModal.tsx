import {
  Button,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogProps,
  DialogTitle,
  TextField
} from "@mui/material";
import { useMemo, useState } from "react";
import { AutocompleteArrayInput, Form, useNotify } from "react-admin";
import * as yup from "yup";

import { Choice } from "@/admin/types/common";
import { validateForm } from "@/admin/utils/forms";
import { FormFieldsProvider } from "@/context/wizardForm.provider";
import { usePutV2AdminUpdateRequestsUUIDSTATUS } from "@/generated/apiComponents";
import { isNotNull } from "@/utils/array";

export type IStatus = "approve" | "moreinfo";

interface ChangeRequestRequestMoreInfoModalProps extends DialogProps {
  handleClose: () => void;
  status: IStatus;
  uuid: string;
  fieldsProvider: FormFieldsProvider;
}

const statusTitles = {
  approve: "Approve Change Request",
  moreinfo: "Request more information for this Change Request"
};

const moreInfoValidationSchema = yup.object({
  feedback: yup.string().nullable(),
  feedback_fields: yup.array().min(1).of(yup.string()).required()
});
const genericValidationSchema = yup.object({
  feedback: yup.string().nullable()
});

const ChangeRequestRequestMoreInfoModal = ({
  handleClose,
  status,
  uuid,
  fieldsProvider,
  ...dialogProps
}: ChangeRequestRequestMoreInfoModalProps) => {
  const notify = useNotify();
  const [feedbackValue, setFeedbackValue] = useState("");

  const feedbackChoices = useMemo<Choice[]>(
    () =>
      fieldsProvider
        .stepIds()
        .flatMap(fieldsProvider.fieldIds)
        .map(fieldsProvider.fieldById)
        .filter(isNotNull)
        .map(({ label, name }) => ({ name: label ?? "", id: name ?? "" })),
    [fieldsProvider]
  );

  const { mutateAsync: updateStatus, isLoading } = usePutV2AdminUpdateRequestsUUIDSTATUS({
    onSuccess() {
      notify("Change Request status updated", { type: "success" });
    }
  });

  const handleSave = async (data: any) => {
    if (status) {
      const body: any = {
        feedback: feedbackValue
      };

      if (data.feedback_fields && status === "moreinfo") {
        body.feedback_fields = data.feedback_fields;
      }

      await updateStatus({
        pathParams: {
          uuid,
          status
        },
        body
      });
    }
    setFeedbackValue("");
    return handleClose();
  };

  return (
    <Dialog {...dialogProps} fullWidth>
      <Form
        onSubmit={handleSave}
        validate={validateForm(status === "moreinfo" ? moreInfoValidationSchema : genericValidationSchema)}
      >
        {status == null ? null : <DialogTitle>{statusTitles[status as IStatus]}</DialogTitle>}
        <DialogContent>
          <TextField
            value={feedbackValue}
            onChange={e => setFeedbackValue(e.target.value)}
            label="Feedback"
            fullWidth
            multiline
            margin="dense"
            helperText={false}
          />
          {status === "moreinfo" && feedbackChoices.length > 0 ? (
            <AutocompleteArrayInput
              source="feedback_fields"
              label="Fields"
              choices={feedbackChoices}
              fullWidth
              margin="dense"
            />
          ) : null}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button variant="contained" type="submit" disabled={isLoading}>
            {isLoading ? <CircularProgress size={18} sx={{ marginRight: 1 }} /> : null}
            Update Status
          </Button>
        </DialogActions>
      </Form>
    </Dialog>
  );
};

export default ChangeRequestRequestMoreInfoModal;
