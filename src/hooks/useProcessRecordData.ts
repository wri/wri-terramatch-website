import { useMemo } from "react";

import { GetV2FormsENTITYUUIDResponse, useGetV2FormsENTITYUUID } from "@/generated/apiComponents";

export function useProcessRecordData(modelUUID: string, modelName: string, inputType: string) {
  const { data: record } = useGetV2FormsENTITYUUID<{ data: GetV2FormsENTITYUUIDResponse }>({
    pathParams: {
      uuid: modelUUID,
      entity: modelName
    }
  });

  const ProcesssRecordData = useMemo(() => {
    const viewDataTable = record?.data?.form?.form_sections.map((formSection: any) =>
      formSection.form_questions
        .map((formQuestion: any) => formQuestion.uuid)
        .map((formQuestionUUID: any) => record?.data?.answers?.[formQuestionUUID])
    );

    for (let sectionIndex in record?.data?.form?.form_sections) {
      for (let questionIndex in record?.data?.form?.form_sections[sectionIndex].form_questions) {
        const question = record?.data?.form?.form_sections[sectionIndex].form_questions[questionIndex];
        if (question.children) {
          for (let child of question.children) {
            if (child.input_type === inputType) {
              return viewDataTable?.[sectionIndex]?.[questionIndex];
            }
          }
        }
      }
    }
    return false;
  }, [record]);

  return ProcesssRecordData;
}
