import { Button, Dialog, DialogActions, DialogContent, DialogTitle } from "@mui/material";
import { useCallback, useState } from "react";
import { useRecordContext } from "react-admin";

import Text from "@/components/elements/Text/Text";
import Icon, { IconNames } from "@/components/extensive/Icon/Icon";
import { loadFormTranslation, pushFormTranslation } from "@/connections/Form";
import ApiSlice from "@/store/apiSlice";

import { FormBuilderData } from "./FormBuilder/types";

export const TranslateButton = () => {
  const record = useRecordContext<FormBuilderData>();
  const [hasBeenPushed, setHasBeenPushed] = useState(false);
  const [hasBeenPulled, setHasBeenPulled] = useState(false);
  const [isPushing, setIsPushing] = useState(false);
  const [isPulling, setIsPulling] = useState(false);
  const [open, setOpen] = useState(false);

  const pushTranslations = useCallback(() => {
    setIsPushing(true);
    setHasBeenPulled(false);
    setHasBeenPushed(false);
    const pushTranslation = async () => {
      try {
        await pushFormTranslation(record?.uuid ?? "");
        setHasBeenPushed(true);
        setIsPushing(false);
      } catch (error) {
        setIsPushing(false);
      }
    };
    pushTranslation();
  }, [record?.uuid]);

  const pullTranslations = useCallback(() => {
    setIsPulling(true);
    setHasBeenPulled(false);
    setHasBeenPushed(false);
    const startPulling = async () => {
      try {
        ApiSlice.pruneCache("formTranslations", [record?.uuid ?? ""]);
        await loadFormTranslation({ id: record?.uuid ?? "" });
        setHasBeenPulled(true);
        setIsPulling(false);
      } catch (error) {
        setIsPulling(false);
      }
      setIsPulling(false);
    };
    startPulling();
  }, [record?.uuid]);

  return (
    <>
      <Button onClick={() => setOpen(true)}>Translations</Button>
      <Dialog open={open} fullWidth>
        <DialogTitle>Translations</DialogTitle>
        <DialogContent>
          <Button disabled={isPushing} onClick={pushTranslations}>
            {isPushing ? (
              <Icon name={IconNames.SPINNER} className="h-5 w-5 animate-spin lg:h-6 lg:w-6" />
            ) : (
              <Icon name={IconNames.UPLOAD_PA} className="h-5 w-5 lg:h-6 lg:w-6" />
            )}
            Push Translations
          </Button>
          <Button disabled={isPulling} onClick={pullTranslations}>
            {isPulling ? (
              <Icon name={IconNames.SPINNER} className="h-5 w-5 animate-spin lg:h-6 lg:w-6" />
            ) : (
              <Icon name={IconNames.DOWNLOAD_PA} className="h-5 w-5 lg:h-6 lg:w-6" />
            )}
            Pull Translations
          </Button>
          <div className="flex items-center gap-2">
            {hasBeenPushed && (
              <Text variant="text-14-light" className="text-darkCustom">
                Translations have been pushed successfully
              </Text>
            )}
            {hasBeenPulled && (
              <Text variant="text-14-light" className="text-darkCustom">
                Translations have been pulled successfully
              </Text>
            )}
          </div>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpen(false)}>Close</Button>
        </DialogActions>
      </Dialog>
    </>
  );
};
