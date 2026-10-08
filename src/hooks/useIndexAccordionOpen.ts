import { useState } from "react";

import { useValueChanged } from "@/hooks/useValueChanged";

type IndexAccordionOpenOptions = {
  defaultOpen: boolean;
  resetKey?: string;
  restoreOpen?: boolean;
};

export const useIndexAccordionOpen = ({ defaultOpen, resetKey, restoreOpen }: IndexAccordionOpenOptions) => {
  const [open, setOpen] = useState(restoreOpen ?? defaultOpen);

  useValueChanged(`${defaultOpen}:${resetKey}`, () => {
    if (restoreOpen == null) setOpen(defaultOpen);
  });

  return [open, setOpen] as const;
};
