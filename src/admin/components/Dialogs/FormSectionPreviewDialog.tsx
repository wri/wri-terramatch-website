import { DialogProps } from "@mui/material";

import { FormQuestionField } from "@/admin/modules/form/components/FormBuilder/QuestionArrayInput";
import { FormSectionRead } from "@/generated/apiSchemas";

interface ConfirmationDialogProps extends DialogProps {
  section?: FormSectionRead;
  linkedFieldData: FormQuestionField[];
}

// TODO will be adapted in TM-2418
export const FormSectionPreviewDialog = ({ linkedFieldData, section: _section, ...props }: ConfirmationDialogProps) => {
  return null;
  // const formHook = useForm();
  //
  // const step = useMemo(() => {
  //   if (!_section) return null;
  //   const section = sectionPayloadToFormSectionRead(_section, linkedFieldData);
  //
  //   return apiFormSectionToFormStep(section, (t: typeof useT) => t);
  // }, [_section, linkedFieldData]);
  //
  // if (!step) return null;
  //
  // return (
  //   <ModalProvider>
  //     <Dialog {...props} fullWidth maxWidth="lg" sx={{ zIndex: 40 }}>
  //       <DialogTitle>
  //         Field Preview
  //         <DialogContentText>
  //           This preview serves for illustrative purposes only, and certain fields may not have full functionality.
  //         </DialogContentText>
  //       </DialogTitle>
  //
  //       <Divider />
  //
  //       <DialogContent>
  //         <FormStep {...step} formHook={formHook} onChange={() => Log.debug("FormStep onChange")} />
  //       </DialogContent>
  //
  //       <DialogActions sx={{ padding: 3 }}>
  //         <Button variant="outlined" onClick={e => props.onClose?.(e, "escapeKeyDown")}>
  //           Close
  //         </Button>
  //       </DialogActions>
  //     </Dialog>
  //     <ModalRoot />
  //   </ModalProvider>
  // );
};

// const sectionPayloadToFormSectionRead = (section: any, linkedFieldData: FormQuestionField[]) => {
//   section.form_questions = section.form_questions.map((question: any) =>
//     preparePreviewField(question, linkedFieldData)
//   );
//   return section;
// };
