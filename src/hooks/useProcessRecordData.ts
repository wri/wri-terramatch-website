import { useMemo, useState } from "react";

import { GetV2FormsENTITYUUIDResponse, useGetV2FormsENTITYUUID } from "@/generated/apiComponents";

export function useProcessRecordData(modelUUID: string, modelName: string, inputType: string) {
  const [show, setShow] = useState(false);
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
              setShow(viewDataTable?.[sectionIndex]?.[questionIndex]);
            }
          }
        } else {
          setShow(true);
        }
      }
    }

    return show;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [record, inputType, modelUUID, modelName, show]);

  return ProcesssRecordData;
}
