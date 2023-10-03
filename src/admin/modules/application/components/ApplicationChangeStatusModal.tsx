import {
  Button,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogProps,
  DialogTitle
} from "@mui/material";
import { useMemo } from "react";
import { AutocompleteArrayInput, Form, RaRecord, TextInput, useNotify, useRefresh, useShowContext } from "react-admin";
import { If } from "react-if";
import * as yup from "yup";

import { validateForm } from "@/admin/utils/forms";
import {
  PatchV2AdminFormsSubmissionsUUIDStatusRequestBody,
  usePatchV2AdminFormsSubmissionsUUIDStatus
} from "@/generated/apiComponents";
import { FormSubmissionRead } from "@/generated/apiSchemas";
import { Option } from "@/types/common";
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
  feedback_fields: yup.array().min(1).of(yup.string()).required()
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

  const questions: Option[] | undefined = useMemo(
    () =>
      record?.current_submission?.form?.form_sections
        // @ts-ignore client error
        ?.map(s => s.form_questions)
        .flat(1)
        // @ts-ignore client error
        .map(q => ({
          title: q?.label ?? "",
          value: q?.label ?? ""
        })),
    [record?.current_submission?.form?.form_sections]
  );

  const feebdackFields = useMemo(() => optionToChoices(questions ?? []), [questions]);

  const { mutateAsync: requestMoreInfo, isLoading } = usePatchV2AdminFormsSubmissionsUUIDStatus({
    onSuccess() {
      refresh();
      notify("Application status updated", { type: "success" });
    }
  });

  const handleSave = async (data: any) => {
    if (status) {
      const body: PatchV2AdminFormsSubmissionsUUIDStatusRequestBody = {
        status,
        feedback_fields: data.feedback_fields
      };

      if (data.feedback) {
        body.feedback = data.feedback;
      }

      await requestMoreInfo({
        // @ts-ignore client error
        pathParams: {
          uuid
        },
        body: {
          feedback: data.feedback,
          status,
          feedback_fields: data.feedback_fields
        }
      });
    }

    return handleClose();
  };

  return (
    <Dialog {...dialogProps} fullWidth>
      <Form
        onSubmit={handleSave}
        validate={validateForm(
          status === "requires-more-information" ? moreInfoValidationSchema : genericValidationSchema
        )}
      >
        <If condition={status}>
          <DialogTitle>{statusTitles[status as status]}</DialogTitle>
        </If>
        <DialogContent>
          <TextInput source="feedback" label="Feedback" fullWidth multiline margin="dense" helperText={false} />
          <If condition={status === "requires-more-information" && feebdackFields.length > 0}>
            <AutocompleteArrayInput
              source="feedback_fields"
              label="Fields"
              choices={feebdackFields}
              fullWidth
              margin="dense"
            />
          </If>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button variant="contained" type="submit" disabled={isLoading}>
            <If condition={isLoading}>
              <CircularProgress size={18} sx={{ marginRight: 1 }} />
            </If>
            Update Status
          </Button>
        </DialogActions>
      </Form>
    </Dialog>
  );
};

export default ApplicationRequestMoreInfoModal;
