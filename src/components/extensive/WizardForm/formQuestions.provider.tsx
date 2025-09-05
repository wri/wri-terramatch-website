import { createContext, ReactNode, useCallback, useContext } from "react";

import { FormQuestionDto } from "@/generated/v3/entityService/entityServiceSchemas";

export type FormQuestionContextType = {
  childQuestions: (questionId: string) => FormQuestionDto[];
  linkedFieldQuestion: (linkedFieldKey: string) => FormQuestionDto | undefined;
  allQuestions: FormQuestionDto[];
};

const FormQuestionContext = createContext<FormQuestionContextType>({
  childQuestions: () => [],
  linkedFieldQuestion: () => undefined,
  allQuestions: []
});

type FormQuestionsProviderProps = {
  children: ReactNode;
  questions: FormQuestionDto[];
};

export const FormQuestionsProvider = ({ children, questions }: FormQuestionsProviderProps) => {
  const childQuestions = useCallback(
    (questionId: string) => questions.filter(({ parentId }) => parentId === questionId),
    [questions]
  );
  const linkedFieldQuestion = useCallback(
    (linkedFieldKey: string) => questions.find(q => q.linkedFieldKey === linkedFieldKey),
    [questions]
  );
  return (
    <FormQuestionContext.Provider value={{ childQuestions, linkedFieldQuestion, allQuestions: questions }}>
      {children}
    </FormQuestionContext.Provider>
  );
};

export const useFormQuestions = () => useContext(FormQuestionContext);
