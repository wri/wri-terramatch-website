import { Button, Dialog, DialogActions, DialogContent, DialogTitle } from "@mui/material";
import { useState } from "react";
import { useRecordContext } from "react-admin";

import { FormBuilderData } from "./FormBuilder/types";

export const TranslateButton = () => {
  const record = useRecordContext<FormBuilderData>();
  const [open, setOpen] = useState(false);

  const pushTranslations = () => {
    console.log("Pushing translations to API", record?.uuid);
  };

  const pullTranslations = () => {
    console.log("Pulling translations from API", record?.uuid);
  };

  return (
    <>
      <Button onClick={() => setOpen(true)}>Translations</Button>
      <Dialog open={open} fullWidth>
        <DialogTitle>Translations</DialogTitle>
        <DialogContent>
          <Button onClick={pushTranslations}>Push Translations</Button>
          <Button onClick={pullTranslations}>Pull Translations</Button>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpen(false)}>Close</Button>
        </DialogActions>
      </Dialog>
    </>
  );
};
