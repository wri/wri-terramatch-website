import { V2FinancialIndicatorsRead } from "@/generated/apiSchemas";

export const formatDocumentData = (documents: V2FinancialIndicatorsRead) => {
  return documents
    ?.filter(financial => financial?.collection == "description-documents")
    .map(financial => ({ year: financial?.year, files: financial?.documentation }));
};

export const formatDescriptionData = (documents: V2FinancialIndicatorsRead) => {
  return documents
    ?.filter(financial => financial?.collection == "description-documents")
    .map(financial => ({ label: financial?.year, description: financial?.description }));
};

export const currencyInput = {
  USD: "$",
  EUR: "€",
  GBP: "£"
} as any;
