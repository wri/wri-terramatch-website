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
import { useMemo, useState } from "react";
import { AutocompleteArrayInput, Form, useShowContext } from "react-admin";
import { When } from "react-if";
import * as yup from "yup";

import modules from "@/admin/modules";
import { validateForm } from "@/admin/utils/forms";
import { useNotificationContext } from "@/context/notification.provider";
import {
  GetV2FormsENTITYUUIDResponse,
  useGetV2FormsENTITYUUID,
  usePostV2AdminENTITYUUIDReminder,
  usePutV2AdminENTITYUUIDSTATUS
} from "@/generated/apiComponents";
import ApiSlice, { RESOURCES, ResourceType } from "@/store/apiSlice";
import { optionToChoices } from "@/utils/options";

interface StatusChangeModalProps extends DialogProps {
  handleClose: () => void;
  status: "approve" | "moreinfo" | "restoration-in-progress" | "reminder" | undefined;
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

  const [resourceName, v3Resource] = useMemo(() => {
    switch (resource as keyof typeof modules) {
      case "project":
        return ["projects", "projects"];
      case "site":
        return ["sites", "sites"];
      case "nursery":
        return ["nurseries", "nurseries"];
      case "projectReport":
        return ["project-reports", "projectReports"];
      case "siteReport":
        return ["site-reports", "siteReports"];
      case "nurseryReport":
        return ["nursery-reports", "nurseryReports"];
      default:
        return [resource, resource];
    }
  }, [resource]);

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
        return `Are you sure you want to approve this ${name}`;

      case "moreinfo":
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

  const { mutateAsync, isLoading } = usePutV2AdminENTITYUUIDSTATUS({
    onSuccess: () => {
      const type = v3Resource as ResourceType;
      if (RESOURCES.includes(type)) {
        // Temporary until the entity update goes through v3. Then the prune isn't needed, and the
        // refetch() will pull the updated resource from the store without an API request.
        ApiSlice.pruneCache(type, [record.id]);
      }
      refetch();
    }
  });
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
      await mutateAsync({
        pathParams: {
          uuid: record.id,
          entity: resourceName,
          status
        },
        body
      });
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
            <Button variant="contained" type="submit" disabled={isLoading}>
              <When condition={isLoading}>
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
