import { createContext, ReactNode, useCallback, useContext, useMemo } from "react";

import { QuestionDefinition } from "@/components/extensive/WizardForm/types";
import { questionDtoToDefinition } from "@/components/extensive/WizardForm/utils";
import { selectQuestions, selectSections, useForm } from "@/connections/util/Form";

export type FormQuestionContextType = {
  childQuestions: (questionId: string) => QuestionDefinition[];
  linkedFieldQuestion: (linkedFieldKey: string) => QuestionDefinition | undefined;
  allQuestions: QuestionDefinition[];
};

const FormQuestionContext = createContext<FormQuestionContextType>({
  childQuestions: () => [],
  linkedFieldQuestion: () => undefined,
  allQuestions: []
});

type FormQuestionsProviderProps = {
  children: ReactNode;
  formId: string;
};

export const FormQuestionsProvider = ({ children, formId }: FormQuestionsProviderProps) => {
  const [loaded] = useForm({ id: formId, enabled: formId != null });
  const { questionDtos, allQuestions } = useMemo(() => {
    if (!loaded || formId == null) return { questionDtos: [], allQuestions: [] };

    const sections = selectSections(formId);
    const questionDtos = sections.flatMap(({ uuid }) => selectQuestions(uuid));
    const allQuestions = questionDtos.filter(({ parentId }) => parentId == null).map(questionDtoToDefinition);
    return { questionDtos, allQuestions };
  }, [formId, loaded]);
  const childQuestions = useCallback(
    (questionId: string) => questionDtos.filter(({ parentId }) => parentId === questionId).map(questionDtoToDefinition),
    [questionDtos]
  );
  const linkedFieldQuestion = useCallback(
    (linkedFieldKey: string) => allQuestions.find(q => q.linkedFieldKey === linkedFieldKey),
    [allQuestions]
  );
  return (
    <FormQuestionContext.Provider value={{ childQuestions, linkedFieldQuestion, allQuestions }}>
      {children}
    </FormQuestionContext.Provider>
  );
};

export const useFormQuestions = () => useContext(FormQuestionContext);
