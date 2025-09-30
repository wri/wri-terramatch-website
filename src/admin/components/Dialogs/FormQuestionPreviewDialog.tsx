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

import { FormQuestionField } from "@/admin/modules/form/components/FormBuilder/QuestionArrayInput";
import { FormBuilderData } from "@/admin/modules/form/components/FormBuilder/types";
import ModalRoot from "@/components/extensive/Modal/ModalRoot";
import FormField from "@/components/extensive/WizardForm/FormField";
import ModalProvider from "@/context/modal.provider";
import WizardFormProvider, { useLocalStepsProvider } from "@/context/wizardForm.provider";
import Log from "@/utils/log";

interface FormQuestionPreviewDialogProps extends DialogProps {
  questionId?: string;
  linkedFieldData: FormQuestionField[];
  formTitle?: string;
}

export const FormQuestionPreviewDialog: FC<FormQuestionPreviewDialogProps> = ({
  linkedFieldData,
  questionId,
  formTitle,
  ...props
}) => {
  const steps = useFormContext<FormBuilderData>().getValues().steps;
  const fieldsProvider = useLocalStepsProvider(steps ?? []);
  const field = questionId == null ? undefined : fieldsProvider.fieldById(questionId);
  // Create a form hook for the preview so it doesn't try to interact with the form builder data.
  const formHook = useForm();

  if (field == null) return null;

  return (
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
              <WizardFormProvider fieldsProvider={fieldsProvider}>
                <FormField field={field} formHook={formHook} onChange={() => Log.debug("FormField onChange")} />
              </WizardFormProvider>
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
};
