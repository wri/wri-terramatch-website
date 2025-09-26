import { DialogProps } from "@mui/material";

import { FormQuestionField } from "@/admin/modules/form/components/FormBuilder/QuestionArrayInput";
import { FormQuestionRead } from "@/generated/apiSchemas";

interface ConfirmationDialogProps extends DialogProps {
  question?: FormQuestionRead;
  linkedFieldData: FormQuestionField[];
  formTitle?: string;
}

// TODO will be adapted in TM-2418
export const FormQuestionPreviewDialog = ({
  linkedFieldData,
  question: _question,
  formTitle,
  ...props
}: ConfirmationDialogProps) => {
  return null;
  // const formHook = useForm();
  //
  // const field = useMemo(() => {
  //   if (!_question) return null;
  //
  //   const question = preparePreviewField(_question, linkedFieldData);
  //
  //   return apiFormQuestionToFormField(question, (t: typeof useT) => t, 1, [question]);
  // }, [_question, linkedFieldData]);
  //
  // if (!field) return null;
  //
  // return (
  //   <ModalProvider>
  //     <Dialog {...props} fullWidth sx={{ zIndex: 40 }}>
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
  //         <FieldMapper field={field} formHook={formHook} onChange={() => Log.debug("Field Mapper onChange")} />
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

// export const preparePreviewField = (_question: FormQuestionRead, linkedFieldData: FormQuestionField[]) => {
//   const question = questionPayloadToFormQuestionRead(
//     normalizeQuestionCreatePayload(_question, linkedFieldData),
//     linkedFieldData
//   );
//
//   question.uuid = question.uuid || "preview-" + Math.floor(Math.random() * 100000);
//   return { ...question, ...question.additional_props };
// };
//
// const questionPayloadToFormQuestionRead = (question: any, linkedFieldData: any) => {
//   question.options = question.form_question_options;
//   question.children =
//     question.child_form_questions?.map?.((child: FormQuestionRead) => preparePreviewField(child, linkedFieldData)) ||
//     [];
//
//   return question;
// };
