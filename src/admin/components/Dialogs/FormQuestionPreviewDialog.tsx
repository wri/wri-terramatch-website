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
import { FC } from "react";
import { useForm, useFormContext } from "react-hook-form";

import { FormBuilderData } from "@/admin/modules/form/components/FormBuilder/types";
import ModalRoot from "@/components/extensive/Modal/ModalRoot";
import FormField from "@/components/extensive/WizardForm/FormField";
import ModalProvider from "@/context/modal.provider";
import WizardFormProvider, { useLocalStepsProvider } from "@/context/wizardForm.provider";
import Log from "@/utils/log";

interface FormQuestionPreviewDialogProps extends DialogProps {
  questionId?: string;
  formTitle?: string;
}

type QuestionPreviewContentProps = {
  questionId: string;
};

const QuestionPreviewContent: FC<QuestionPreviewContentProps> = ({ questionId }) => {
  const steps = useFormContext<FormBuilderData>().getValues().steps;
  const fieldsProvider = useLocalStepsProvider(steps ?? []);
  // Create a form hook for the preview so it doesn't try to interact with the form builder data.
  const formHook = useForm();

  return (
    <WizardFormProvider fieldsProvider={fieldsProvider}>
      <FormField fieldId={questionId} formHook={formHook} onChange={() => Log.debug("FormField onChange")} />
    </WizardFormProvider>
  );
};

export const FormQuestionPreviewDialog: FC<FormQuestionPreviewDialogProps> = ({ questionId, formTitle, ...props }) =>
  questionId == null ? null : (
    <ModalProvider>
      <Dialog {...props} fullWidth sx={{ zIndex: 40 }}>
        {props.open ? (
          <>
            <DialogTitle>
              Field Preview
              <DialogContentText>
                This preview serves for illustrative purposes only, and certain fields may not have full functionality.
              </DialogContentText>
            </DialogTitle>

            <Divider />

            <DialogContent>
              <QuestionPreviewContent questionId={questionId} />
            </DialogContent>

            <DialogActions sx={{ padding: 3 }}>
              <Button variant="outlined" onClick={e => props.onClose?.(e, "escapeKeyDown")}>
                Close
              </Button>
            </DialogActions>
          </>
        ) : null}
      </Dialog>
      <ModalRoot />
    </ModalProvider>
  );
