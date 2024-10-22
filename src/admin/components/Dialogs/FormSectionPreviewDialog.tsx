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

import { preparePreviewField } from "@/admin/components/Dialogs/FormQuestionPreviewDialog";
import ModalRoot from "@/components/extensive/Modal/ModalRoot";
import { FormStep } from "@/components/extensive/WizardForm/FormStep";
import ModalProvider from "@/context/modal.provider";
import { FormSectionRead, V2GenericList } from "@/generated/apiSchemas";
import { apiFormSectionToFormStep } from "@/helpers/customForms";

interface ConfirmationDialogProps extends DialogProps {
  section?: FormSectionRead;
  linkedFieldData: (V2GenericList & { input_type: string; multichoice: boolean | null })[];
}

export const FormSectionPreviewDialog = ({ linkedFieldData, section: _section, ...props }: ConfirmationDialogProps) => {
  const formHook = useForm();

  const step = useMemo(() => {
    if (!_section) return null;
    const section = sectionPayloadToFormSectionRead(_section, linkedFieldData);

    return apiFormSectionToFormStep(section, (t: typeof useT) => t);
  }, [_section, linkedFieldData]);

  if (!step) return null;

  return (
    <ModalProvider>
      <Dialog {...props} fullWidth maxWidth="lg" sx={{ zIndex: 40 }}>
        <DialogTitle>
          Field Preview
          <DialogContentText>
            This preview serves for illustrative purposes only, and certain fields may not have full functionality.
          </DialogContentText>
        </DialogTitle>

        <Divider />

        <DialogContent>
          <FormStep {...step} formHook={formHook} onChange={console.log} />
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

const sectionPayloadToFormSectionRead = (section: any, linkedFieldData: any) => {
  section.form_questions = section.form_questions.map((question: any) =>
    preparePreviewField(question, linkedFieldData)
  );
  return section;
};
