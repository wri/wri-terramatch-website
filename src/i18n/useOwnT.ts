import { useT } from "@transifex/react";

import { TranslatedText } from "./types";

const useOwnT = () => {
  const t = useT();

  return (text: string): TranslatedText => {
    return t(text) as TranslatedText;
  };
};

export default useOwnT;
