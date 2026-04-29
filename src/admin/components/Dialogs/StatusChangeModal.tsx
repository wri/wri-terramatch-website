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
import { useT } from "@transifex/react";
import { FC, useCallback, useMemo, useState } from "react";
import { AutocompleteArrayInput, Form, useShowContext } from "react-admin";
import * as yup from "yup";

import modules from "@/admin/modules";
import { Choice } from "@/admin/types/common";
import { validateForm } from "@/admin/utils/forms";
import { FieldDefinition } from "@/components/extensive/WizardForm/types";
import { useFullEntity } from "@/connections/Entity";
import { FormEntity } from "@/connections/Form";
import { ReminderEntityType, useSendReminder } from "@/connections/Reminder";
import { useNotificationContext } from "@/context/notification.provider";
import { useApiFieldsProvider } from "@/context/wizardForm.provider";
import { ReportUpdateAttributes } from "@/generated/v3/entityService/entityServiceSchemas";
import { v3EntityName } from "@/helpers/entity";
import { useRequestComplete } from "@/hooks/useConnectionUpdate";
import { useEntityForm } from "@/hooks/useFormGet";
import { SingularEntityName } from "@/types/common";
import { isNotNull } from "@/utils/array";

type StatusFormValues = {
  feedbackFields?: string[];
};

interface StatusChangeModalProps extends DialogProps {
  handleClose: () => void;
  // During the transition, this is supporting both the actions that v2 expects and the status to
  // update to that v3 expects
  status?: "approved" | "needs-more-information" | "reminder" | "due";
}

const moreInfoValidationSchema = yup.object({
  feedback: yup.string().nullable(),
  feedbackFields: yup.array().min(1, "Feedback fields must have at least 1 item").of(yup.string()).required()
});
const genericValidationSchema = yup.object({
  feedback: yup.string().nullable()
});

const StatusChangeModal: FC<StatusChangeModalProps> = ({ handleClose, status, ...dialogProps }) => {
  const { record, refetch, resource } = useShowContext();
  const [feedbackValue, setFeedbackValue] = useState("");
  const { openNotification } = useNotificationContext();
  const t = useT();

  const v3Resource = useMemo(() => v3EntityName(resource as SingularEntityName) as FormEntity, [resource]);
  const [, { isUpdating, updateFailure, update }] = useFullEntity(v3Resource, record.uuid);

  // For a v3 update, the store already has the updated resource, but react-admin doesn't know about it.
  // This will be a quick cache get in that case, instead of another server round trip.
  useRequestComplete(
    isUpdating,
    updateFailure,
    useCallback(failure => (failure == null ? refetch() : undefined), [refetch])
  );

  const dialogTitle = useMemo(() => {
    let name;
    switch (resource as keyof typeof modules) {
      case "project":
        name = record?.name ?? "Project";
        break;
      case "site":
        name = record?.name ?? "Site";
        break;
      case "nursery":
        name = record?.name ?? "Nursery";
        break;
      case "projectReport":
        name = record?.title ?? "Project Report";
        break;
      case "siteReport":
        name = record?.title ?? "Site Report";
        break;
      case "nurseryReport":
        name = record?.title ?? "Nursery Report";
        break;
      case "financialReport":
        name = record?.organisationName ?? "Financial Report";
        break;
      case "disturbanceReport":
        name = "Disturbance Report";
        break;
      case "srpReport":
        name = "Socio-Economic Report";
        break;
    }

    switch (status) {
      case "approved":
        return `Are you sure you want to approve this ${name}`;

      case "needs-more-information":
        return `Request more information for ${name}`;

      case "reminder":
        return `Send a reminder for ${name}`;

      case "due":
        return `Are you sure you want to reset this ${name}`;
    }
  }, [record, resource, status]);

  const { formData } = useEntityForm(v3Resource, record.id);
  const [providerLoaded, fieldsProvider] = useApiFieldsProvider(formData?.formUuid);
  const feedbackChoices = useMemo<Choice[]>(() => {
    const { stepIds, fieldNames, fieldByName, childNames } = fieldsProvider;
    const fieldToChoice = ({ label, name }: FieldDefinition): Choice => ({ id: name, name: label });
    return stepIds()
      .flatMap(fieldNames)
      .flatMap(fieldId => {
        const field = fieldByName(fieldId);
        if (field == null) return [];

        return [fieldToChoice(field), ...childNames(fieldId).map(fieldByName).filter(isNotNull).map(fieldToChoice)];
      });
  }, [fieldsProvider]);

  const { create: createReminder, isCreating: isLoadingReminder } = useSendReminder(
    { entity: v3Resource as ReminderEntityType, uuid: record.uuid },
    useCallback(() => {
      openNotification("success", "Success!", t("Reminder sent successfully."));
      setFeedbackValue("");
      handleClose();
    }, [openNotification, t, handleClose])
  );

  const handleSave = useCallback(
    (data: StatusFormValues) => {
      if (!record || !status) return;

      if (status === "reminder") {
        createReminder({ feedback: feedbackValue });
      } else {
        if (status === "due") {
          (update as (a: ReportUpdateAttributes) => void)({ status });
        } else {
          update({
            status,
            feedback: feedbackValue,
            feedbackFields: data.feedbackFields
          });
        }
      }
    },
    [createReminder, feedbackValue, record, status, update]
  );

  useRequestComplete(
    isUpdating,
    updateFailure,
    useCallback(() => {
      if (status === "due") {
        // When we reset a report, there are potentially many cached resources in the FE that have
        // been deleted. Since this is a testing utility only, the extra work of having the
        // BE return the set of deleted resources to properly update the FE cache is not worth
        // the effort; we'll just do a hard refresh instead.
        location.reload();
      } else {
        setFeedbackValue("");
        handleClose();
      }
    }, [handleClose, status])
  );

  return !providerLoaded ? null : (
    <Dialog {...dialogProps} fullWidth>
      <Form
        onSubmit={handleSave}
        validate={validateForm(
          status === "needs-more-information" ? moreInfoValidationSchema : genericValidationSchema
        )}
      >
        <DialogTitle>{dialogTitle}</DialogTitle>

        <DialogContent>
          {status !== "due" && (
            <TextField
              value={feedbackValue}
              onChange={e => setFeedbackValue(e.target.value)}
              label="Feedback"
              fullWidth
              multiline
              margin="dense"
              helperText={false}
            />
          )}
          {status === "needs-more-information" && feedbackChoices.length > 0 ? (
            <AutocompleteArrayInput
              source="feedbackFields"
              label="Fields"
              choices={feedbackChoices}
              fullWidth
              margin="dense"
            />
          ) : null}
        </DialogContent>

        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          {status === "reminder" ? (
            <Button variant="contained" type="submit" disabled={isLoadingReminder}>
              {isLoadingReminder && <CircularProgress size={18} sx={{ marginRight: 1 }} />}
              Send Reminder
            </Button>
          ) : (
            <Button variant="contained" type="submit" disabled={isUpdating}>
              {isUpdating && <CircularProgress size={18} sx={{ marginRight: 1 }} />}
              Update Status
            </Button>
          )}
        </DialogActions>
      </Form>
    </Dialog>
  );
};

export default StatusChangeModal;
