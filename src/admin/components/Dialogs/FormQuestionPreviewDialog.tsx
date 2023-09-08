import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogProps,
  DialogTitle,
  Divider
} from "@mui/material";
import { useT } from "@transifex/react";
import { useMemo } from "react";
import { useForm } from "react-hook-form";

import { normalizeQuestionCreatePayload } from "@/admin/apiProvider/dataProviders/formDataProvider";
import { FieldMapper } from "@/components/extensive/WizardForm/FieldMapper";
import { FormQuestionRead, V2GenericList } from "@/generated/apiSchemas";
import { apiFormQuestionToFormField } from "@/helpers/customForms";

interface ConfirmationDialogProps extends DialogProps {
  question?: FormQuestionRead;
  linkedFieldData: (V2GenericList & { input_type: string; multichoice: boolean | null })[];
}

export const FormQuestionPreviewDialog = ({
  linkedFieldData,
  question: _question,
  ...props
}: ConfirmationDialogProps) => {
  const formHook = useForm();

  const field = useMemo(() => {
    if (!_question) return null;

    const question = preparePreviewField(_question, linkedFieldData);

    return apiFormQuestionToFormField(question, (t: typeof useT) => t, 1, [question]);
  }, [_question, linkedFieldData]);

  if (!field) return null;

  return (
    <Dialog {...props} fullWidth>
      <DialogTitle>
        Field Preview
        <DialogContentText>
          This preview serves for illustrative purposes only, and certain fields may not have full functionality.
        </DialogContentText>
      </DialogTitle>

      <Divider />

      <DialogContent>
        <FieldMapper field={field} formHook={formHook} onChange={console.log} />
      </DialogContent>

      <DialogActions sx={{ padding: 3 }}>
        <Button variant="outlined" onClick={e => props.onClose?.(e, "escapeKeyDown")}>
          Close
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export const preparePreviewField = (_question: FormQuestionRead, linkedFieldData: any) => {
  const question = questionPayloadToFormQuestionRead(
    normalizeQuestionCreatePayload(_question, linkedFieldData),
    linkedFieldData
  );

  question.uuid = question.uuid || "preview-" + Math.floor(Math.random() * 100000);
  return question;
};

const questionPayloadToFormQuestionRead = (question: any, linkedFieldData: any) => {
  question.options = question.form_question_options;
  question.children =
    question.child_form_questions?.map?.((child: FormQuestionRead) => preparePreviewField(child, linkedFieldData)) ||
    [];

  return question;
};
