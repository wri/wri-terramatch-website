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
import { kebabCase } from "lodash";
import { useMemo, useState } from "react";
import { AutocompleteArrayInput, Form, usePrevious, useShowContext } from "react-admin";
import { When } from "react-if";
import * as yup from "yup";

import modules from "@/admin/modules";
import { validateForm } from "@/admin/utils/forms";
import {
  EntityConnectionWithUpdate,
  EntityDtoType,
  EntityUpdateData,
  SupportedEntity,
  useFullEntity
} from "@/connections/Entity";
import { useNotificationContext } from "@/context/notification.provider";
import {
  GetV2FormsENTITYUUIDResponse,
  useGetV2FormsENTITYUUID,
  usePostV2AdminENTITYUUIDReminder,
  usePutV2AdminENTITYUUIDSTATUS
} from "@/generated/apiComponents";
import { singularEntityNameToPlural } from "@/helpers/entity";
import { SingularEntityName } from "@/types/common";
import { optionToChoices } from "@/utils/options";

interface StatusChangeModalProps extends DialogProps {
  handleClose: () => void;
  // During the transition, this is supporting both the actions that v2 expects and the status to
  // update to that v3 expects
  status:
    | "approve"
    | "approved"
    | "moreinfo"
    | "needs-more-information"
    | "restoration-in-progress"
    | "reminder"
    | undefined;
}

const moreInfoValidationSchema = yup.object({
  feedback: yup.string().nullable(),
  feedback_fields: yup.array().min(1).of(yup.string()).required()
});
const genericValidationSchema = yup.object({
  feedback: yup.string().nullable()
});

// While we transition, some entities are getting status updates in v2, and some in v3. This hook supports both.
function useUpdateStatus() {
  const { record, resource } = useShowContext();

  const resourceName = useMemo(() => kebabCase(singularEntityNameToPlural(resource as SingularEntityName)), [resource]);
  const v3Resource = useMemo(
    () => singularEntityNameToPlural(resource as SingularEntityName) as SupportedEntity,
    [resource]
  );
  const [, entityConnection] = useFullEntity(v3Resource, record.uuid);
  const { mutateAsync, isLoading } = usePutV2AdminENTITYUUIDSTATUS({
    onSuccess: () => {
      // Temporary until the entity update goes through v3. Then the prune isn't needed, and the
      // refetch() will pull the updated resource from the store without an API request.
      entityConnection?.refetch();
    }
  });

  return useMemo(() => {
    if ((entityConnection as EntityConnectionWithUpdate<EntityDtoType, EntityUpdateData>).update != null) {
      const updateConnection = entityConnection as EntityConnectionWithUpdate<EntityDtoType, EntityUpdateData>;
      return {
        isUpdating: updateConnection.entityIsUpdating,
        updateStatus: async (status: string, feedback?: string, feedbackFields?: string[]) =>
          updateConnection.update({ status: status as "approved" | "needs-more-information", feedback, feedbackFields })
      };
    } else {
      return {
        isUpdating: isLoading,
        updateStatus: async (status: string, feedback?: string, feedbackFields?: string[]) => {
          const body: any = { feedback };
          if (status === "moreinfo" && feedbackFields != null) {
            body.feedback_fields = feedbackFields;
          }

          await mutateAsync({
            pathParams: {
              uuid: record.id,
              entity: resourceName,
              status
            },
            body
          });
        }
      };
    }
  }, [entityConnection, isLoading, mutateAsync, record.id, resourceName]);
}

const StatusChangeModal = ({ handleClose, status, ...dialogProps }: StatusChangeModalProps) => {
  const { record, refetch, resource } = useShowContext();
  const [feedbackValue, setFeedbackValue] = useState("");
  const { openNotification } = useNotificationContext();
  const t = useT();

  const resourceName = useMemo(() => kebabCase(singularEntityNameToPlural(resource as SingularEntityName)), [resource]);
  const { isUpdating, updateStatus } = useUpdateStatus();
  const previousIsUpdating = usePrevious(isUpdating);
  if (previousIsUpdating && !isUpdating) {
    // For a v3 update, the store already has the updated resource, but react-admin doesn't know about it.
    // This will be a quick cache get in that case, instead of another server round trip.
    refetch();
  }

  const dialogTitle = (() => {
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
    }

    switch (status) {
      case "approve":
      case "approved":
        return `Are you sure you want to approve this ${name}`;

      case "moreinfo":
      case "needs-more-information":
        return `Request more information for ${name}`;

      case "restoration-in-progress":
        return `Are you sure you want to mark ${name} as Restoration In Progress?`;

      case "reminder":
        return `Send a reminder for ${name}`;
    }
  })();

  const { data: formResponse } = useGetV2FormsENTITYUUID<{ data: GetV2FormsENTITYUUIDResponse }>(
    {
      pathParams: {
        entity: resourceName,
        uuid: record.id
      }
    },
    {
      enabled: !!record?.id
    }
  );

  const questions = formResponse?.data.form?.form_sections.flatMap((section: { form_questions: { label: string }[] }) =>
    section.form_questions.map((question: any) => ({
      title: question.label ?? "",
      value: question.uuid ?? ""
    }))
  );

  const feedbackChoices = useMemo(() => optionToChoices(questions ?? []), [questions]);

  const { mutateAsync: mutateAsyncReminder, isLoading: isLoadingReminder } = usePostV2AdminENTITYUUIDReminder({
    onSuccess: () => {
      openNotification("success", "Success!", t("Reminder sent successfully."));
    }
  });

  const handleSave = async (data: any) => {
    if (!record || !status) return;

    const body: any = {
      feedback: feedbackValue
    };

    if (data.feedback_fields && status === "moreinfo") {
      body.feedback_fields = data.feedback_fields;
    }

    if (status === "reminder") {
      await mutateAsyncReminder({
        pathParams: {
          uuid: record.id,
          entity: resourceName
        },
        body
      });
    } else {
      await updateStatus(status, feedbackValue, data.feedback_fields);
    }
    setFeedbackValue("");
    handleClose();
  };

  return (
    <Dialog {...dialogProps} fullWidth>
      <Form
        onSubmit={handleSave}
        validate={validateForm(status === "moreinfo" ? moreInfoValidationSchema : genericValidationSchema)}
      >
        <DialogTitle>{dialogTitle}</DialogTitle>

        <DialogContent>
          <When condition={status !== "restoration-in-progress"}>
            <TextField
              value={feedbackValue}
              onChange={e => setFeedbackValue(e.target.value)}
              label="Feedback"
              fullWidth
              multiline
              margin="dense"
              helperText={false}
            />
          </When>
          <When condition={status === "moreinfo" && feedbackChoices.length > 0}>
            <AutocompleteArrayInput
              source="feedback_fields"
              label="Fields"
              choices={feedbackChoices}
              fullWidth
              margin="dense"
            />
          </When>
        </DialogContent>

        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <When condition={status !== "reminder"}>
            <Button variant="contained" type="submit" disabled={isUpdating}>
              <When condition={isUpdating}>
                <CircularProgress size={18} sx={{ marginRight: 1 }} />
              </When>
              Update Status
            </Button>
          </When>
          <When condition={status === "reminder"}>
            <Button variant="contained" type="submit" disabled={isLoadingReminder}>
              <When condition={isLoadingReminder}>
                <CircularProgress size={18} sx={{ marginRight: 1 }} />
              </When>
              Send Reminder
            </Button>
          </When>
        </DialogActions>
      </Form>
    </Dialog>
  );
};

export default StatusChangeModal;
