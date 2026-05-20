import { TranslatedText } from "./types";

// This hook is used to return the correct type but not call the translation function
// It is useful when you want to mark a string as translated but not actually translate it
// In the future when we need to translate the string, we can replace the translation function
const useNotT = () => {
  return (text: string): TranslatedText => {
    return text as TranslatedText;
  };
};

export default useNotT;
