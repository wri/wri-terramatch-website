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
import { FC, useCallback, useMemo, useState } from "react";
import { AutocompleteArrayInput, Form, useNotify, useShowContext } from "react-admin";
import * as yup from "yup";

import { Choice } from "@/admin/types/common";
import { validateForm } from "@/admin/utils/forms";
import { useFullEntity } from "@/connections/Entity";
import { FormEntity, useUpdateRequest } from "@/connections/Form";
import { FormFieldsProvider } from "@/context/wizardForm.provider";
import { UpdateRequestAttributes } from "@/generated/v3/entityService/entityServiceSchemas";
import { useRequestSuccess } from "@/hooks/useConnectionUpdate";
import { isNotNull } from "@/utils/array";

export type IStatus = "needs-more-information" | "approved";

interface ChangeRequestRequestMoreInfoModalProps extends DialogProps {
  handleClose: () => void;
  status: IStatus;
  entity: FormEntity;
  fieldsProvider: FormFieldsProvider;
}

const STATUS_TITLES = {
  approved: "Approve Change Request",
  "needs-more-information": "Request more information for this Change Request"
};

const moreInfoValidationSchema = yup.object({
  feedback: yup.string().nullable(),
  feedback_fields: yup.array().min(1).of(yup.string()).required()
});
const genericValidationSchema = yup.object({
  feedback: yup.string().nullable()
});

const ChangeRequestRequestMoreInfoModal: FC<ChangeRequestRequestMoreInfoModalProps> = ({
  handleClose,
  status,
  fieldsProvider,
  entity,
  ...dialogProps
}) => {
  const notify = useNotify();
  const [feedbackValue, setFeedbackValue] = useState("");
  const ctx = useShowContext();
  const [, { refetch: refetchEntity }] = useFullEntity(entity, ctx?.record?.uuid);
  const [, { update, isUpdating, updateFailure }] = useUpdateRequest({
    entity,
    uuid: ctx?.record?.uuid,
    enabled: ctx?.record?.uuid != null
  });
  useRequestSuccess(
    isUpdating,
    updateFailure,
    useCallback(() => {
      notify("Change Request status updated", { type: "success" });
      refetchEntity?.();
      ctx?.refetch?.();
    }, [ctx, notify, refetchEntity]),
    "Change request failed to update"
  );

  const feedbackChoices = useMemo<Choice[]>(
    () =>
      fieldsProvider
        .stepIds()
        .flatMap(fieldsProvider.fieldNames)
        .map(fieldsProvider.fieldByName)
        .filter(isNotNull)
        .map(({ label, name }) => ({ name: label ?? "", id: name ?? "" })),
    [fieldsProvider]
  );

  const handleSave = async (data: any) => {
    if (status != null) {
      const attributes: UpdateRequestAttributes = {
        status,
        feedback: feedbackValue
      };

      if (data.feedback_fields && status === "needs-more-information") {
        attributes.feedbackFields = data.feedback_fields;
      }

      update(attributes);
    }
    setFeedbackValue("");
    return handleClose();
  };

  return (
    <Dialog {...dialogProps} fullWidth>
      <Form
        onSubmit={handleSave}
        validate={validateForm(
          status === "needs-more-information" ? moreInfoValidationSchema : genericValidationSchema
        )}
      >
        {status == null ? null : <DialogTitle>{STATUS_TITLES[status]}</DialogTitle>}
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
          {status === "needs-more-information" && feedbackChoices.length > 0 ? (
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
          <Button variant="contained" type="submit" disabled={isUpdating || updateFailure != null}>
            {isUpdating ? <CircularProgress size={18} sx={{ marginRight: 1 }} /> : null}
            Update Status
          </Button>
        </DialogActions>
      </Form>
    </Dialog>
  );
};

export default ChangeRequestRequestMoreInfoModal;
