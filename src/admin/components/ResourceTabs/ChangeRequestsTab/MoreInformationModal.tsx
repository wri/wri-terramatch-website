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
import { AutocompleteArrayInput, Form, TextInput, useNotify } from "react-admin";
import { If } from "react-if";
import * as yup from "yup";

import { validateForm } from "@/admin/utils/forms";
import { usePutV2AdminUpdateRequestsUUIDSTATUS } from "@/generated/apiComponents";
import { Option } from "@/types/common";
import { optionToChoices } from "@/utils/options";

export type IStatus = "approve" | "moreinfo" | "reject";

interface ChangeRequestRequestMoreInfoModalProps extends DialogProps {
  handleClose: () => void;
  status: IStatus;
  uuid: string;
  form: Record<string, any>;
}

const statusTitles = {
  reject: "Reject Change Request",
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
  form,
  ...dialogProps
}: ChangeRequestRequestMoreInfoModalProps) => {
  const notify = useNotify();

  const questions: Option[] | undefined = useMemo(() => {
    const flat = form?.form_sections
      // @ts-ignore client error
      ?.map(s => s.form_questions)
      .flat(1);

    // @ts-ignore client error
    return flat.map(q => ({
      title: q?.label ?? "",
      value: q?.uuid ?? ""
    }));
  }, [form?.form_sections]);

  const feebdackFields = useMemo(() => optionToChoices(questions ?? []), [questions]);

  const { mutateAsync: upateStatus, isLoading } = usePutV2AdminUpdateRequestsUUIDSTATUS({
    onSuccess() {
      notify("Change Request status updated", { type: "success" });
    }
  });

  const handleSave = async (data: any) => {
    if (status) {
      const body: any = {
        feedback: data.feedback
      };

      if (data.feedback_fields && status === "moreinfo") {
        body.feedback_fields = data.feedback_fields;
      }

      await upateStatus({
        pathParams: {
          uuid,
          status
        },
        body
      });
    }

    return handleClose();
  };

  return (
    <Dialog {...dialogProps} fullWidth>
      <Form
        onSubmit={handleSave}
        validate={validateForm(status === "moreinfo" ? moreInfoValidationSchema : genericValidationSchema)}
      >
        <If condition={status}>
          <DialogTitle>{statusTitles[status as IStatus]}</DialogTitle>
        </If>
        <DialogContent>
          <TextInput source="feedback" label="Feedback" fullWidth multiline margin="dense" helperText={false} />
          <If condition={status === "moreinfo" && feebdackFields.length > 0}>
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

export default ChangeRequestRequestMoreInfoModal;
