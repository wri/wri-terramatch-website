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
import { AutocompleteArrayInput, Form, useShowContext } from "react-admin";
import { When } from "react-if";
import * as yup from "yup";

import modules from "@/admin/modules";
import { validateForm } from "@/admin/utils/forms";
import { SupportedEntity, useFullEntity } from "@/connections/Entity";
import { useNotificationContext } from "@/context/notification.provider";
import { usePostV2AdminENTITYUUIDReminder } from "@/generated/apiComponents";
import { SiteUpdateAttributes } from "@/generated/v3/entityService/entityServiceSchemas";
import { singularEntityNameToPlural } from "@/helpers/entity";
import { useRequestComplete } from "@/hooks/useConnectionUpdate";
import { useEntityForm } from "@/hooks/useFormGet";
import { SingularEntityName } from "@/types/common";
import { optionToChoices } from "@/utils/options";

interface StatusChangeModalProps extends DialogProps {
  handleClose: () => void;
  // During the transition, this is supporting both the actions that v2 expects and the status to
  // update to that v3 expects
  status?: "approved" | "needs-more-information" | "reminder";
}

const moreInfoValidationSchema = yup.object({
  feedback: yup.string().nullable(),
  feedback_fields: yup.array().min(1).of(yup.string()).required()
});
const genericValidationSchema = yup.object({
  feedback: yup.string().nullable()
});

const StatusChangeModal = ({ handleClose, status, ...dialogProps }: StatusChangeModalProps) => {
  const { record, refetch, resource } = useShowContext();
  const [feedbackValue, setFeedbackValue] = useState("");
  const { openNotification } = useNotificationContext();
  const t = useT();

  const resourceName = useMemo(() => kebabCase(singularEntityNameToPlural(resource as SingularEntityName)), [resource]);
  const v3Resource = useMemo(
    () => singularEntityNameToPlural(resource as SingularEntityName) as SupportedEntity,
    [resource]
  );
  const [, { isUpdating, update }] = useFullEntity(v3Resource, record.uuid);

  // For a v3 update, the store already has the updated resource, but react-admin doesn't know about it.
  // This will be a quick cache get in that case, instead of another server round trip.
  useRequestComplete(isUpdating, refetch);

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
      case "financialReport":
        name = record?.organisationName ?? "Financial Report";
        break;
      case "disturbanceReport":
        name = "Disturbance Report";
        break;
    }

    switch (status) {
      case "approved":
        return `Are you sure you want to approve this ${name}`;

      case "needs-more-information":
        return `Request more information for ${name}`;

      case "reminder":
        return `Send a reminder for ${name}`;
    }
  })();

  const { formData: formResponse } = useEntityForm(resourceName, record.id);

  // Helper function to recursively extract all questions including follow-up questions
  const extractAllQuestions = (questions: any[]): any[] => {
    return questions.flatMap((question: any) => {
      const currentQuestion = {
        title: question.label ?? "",
        value: question.uuid ?? ""
      };

      // If the question has children (follow-up questions), include them too
      if (question.children && Array.isArray(question.children)) {
        return [currentQuestion, ...extractAllQuestions(question.children)];
      }

      return [currentQuestion];
    });
  };

  const questions = formResponse?.data.form?.form_sections.flatMap((section: { form_questions: any[] }) =>
    extractAllQuestions(section.form_questions)
  );

  const feedbackChoices = useMemo(() => optionToChoices(questions ?? []), [questions]);

  const { mutateAsync: mutateAsyncReminder, isLoading: isLoadingReminder } = usePostV2AdminENTITYUUIDReminder({
    onSuccess: () => {
      openNotification("success", "Success!", t("Reminder sent successfully."));
    }
  });

  const handleSave = async (data: any) => {
    if (!record || !status) return;

    if (status === "reminder") {
      await mutateAsyncReminder({
        pathParams: {
          uuid: record.id,
          entity: resourceName
        },
        body: { feedback: feedbackValue }
      });
    } else {
      // A little type munging to get this happy with the site-specific status update.
      (update as (attributes: Partial<SiteUpdateAttributes>) => undefined)({
        status,
        feedback: feedbackValue,
        feedbackFields: data.feedback_fields
      });
    }
    setFeedbackValue("");
    handleClose();
  };

  return (
    <Dialog {...dialogProps} fullWidth>
      <Form
        onSubmit={handleSave}
        validate={validateForm(
          status === "needs-more-information" ? moreInfoValidationSchema : genericValidationSchema
        )}
      >
        <DialogTitle>{dialogTitle}</DialogTitle>

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
          <When condition={status === "needs-more-information" && feedbackChoices.length > 0}>
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
