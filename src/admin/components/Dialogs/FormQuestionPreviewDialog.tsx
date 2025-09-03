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

import { normalizeQuestionCreatePayload } from "@/admin/apiProvider/dataNormalizers/formDataNormalizer";
import { FormQuestionField } from "@/admin/modules/form/components/FormBuilder/QuestionArrayInput";
import ModalRoot from "@/components/extensive/Modal/ModalRoot";
import { FieldMapper } from "@/components/extensive/WizardForm/FieldMapper";
import ModalProvider from "@/context/modal.provider";
import { FormQuestionRead } from "@/generated/apiSchemas";
import { apiFormQuestionToFormField } from "@/helpers/customForms";
import Log from "@/utils/log";

interface ConfirmationDialogProps extends DialogProps {
  question?: FormQuestionRead;
  linkedFieldData: FormQuestionField[];
  formTitle?: string;
}

export const FormQuestionPreviewDialog = ({
  linkedFieldData,
  question: _question,
  formTitle,
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
    <ModalProvider>
      <Dialog {...props} fullWidth sx={{ zIndex: 40 }}>
        <DialogTitle>
          Field Preview
          <DialogContentText>
            This preview serves for illustrative purposes only, and certain fields may not have full functionality.
          </DialogContentText>
        </DialogTitle>

        <Divider />

        <DialogContent>
          <FieldMapper
            field={field}
            formHook={formHook}
            onChange={() => Log.debug("Field Mapper onChange")}
            formSubmissionOrg={{ title: formTitle }}
          />
        </DialogContent>

        <DialogActions sx={{ padding: 3 }}>
          <Button variant="outlined" onClick={e => props.onClose?.(e, "escapeKeyDown")}>
            Close
          </Button>
        </DialogActions>
      </Dialog>
      <ModalRoot />
    </ModalProvider>
  );
};

export const preparePreviewField = (_question: FormQuestionRead, linkedFieldData: FormQuestionField[]) => {
  const question = questionPayloadToFormQuestionRead(
    normalizeQuestionCreatePayload(_question, linkedFieldData),
    linkedFieldData
  );

  question.uuid = question.uuid || "preview-" + Math.floor(Math.random() * 100000);
  return { ...question, ...question.additional_props };
};

const questionPayloadToFormQuestionRead = (question: any, linkedFieldData: any) => {
  question.options = question.form_question_options;
  question.children =
    question.child_form_questions?.map?.((child: FormQuestionRead) => preparePreviewField(child, linkedFieldData)) ||
    [];

  return question;
};
