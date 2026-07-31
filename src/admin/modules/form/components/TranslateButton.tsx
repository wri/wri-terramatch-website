import { Button, Dialog, DialogActions, DialogContent, DialogTitle } from "@mui/material";
import { useCallback, useEffect, useState } from "react";
import { useRecordContext } from "react-admin";

import Text from "@/components/elements/Text/Text";
import Icon, { IconNames } from "@/components/extensive/Icon/Icon";
import { useDelayedJobs } from "@/connections/DelayedJob";
import { loadFormTranslation, pushFormTranslation } from "@/connections/Form";
import ApiSlice from "@/store/apiSlice";

import { FormBuilderData } from "./FormBuilder/types";

const PUSH_TRANSLATIONS_JOB_NAME = "Push Translations to Transifex";

export const TranslateButton = () => {
  const record = useRecordContext<FormBuilderData>();
  const [, { delayedJobs }] = useDelayedJobs();
  const [hasBeenPushed, setHasBeenPushed] = useState(false);
  const [hasBeenPulled, setHasBeenPulled] = useState(false);
  const [isPushing, setIsPushing] = useState(false);
  const [isPulling, setIsPulling] = useState(false);
  const [pendingPush, setPendingPush] = useState(false);
  const [pendingPushJobUuid, setPendingPushJobUuid] = useState<string | null>(null);
  const [ignoredPushJobUuids, setIgnoredPushJobUuids] = useState<Set<string>>(() => new Set());
  const [open, setOpen] = useState(false);

  const finishPush = useCallback((succeeded: boolean) => {
    if (succeeded) {
      setHasBeenPushed(true);
    }
    setIsPushing(false);
    setPendingPush(false);
    setPendingPushJobUuid(null);
  }, []);

  const pushTranslations = useCallback(() => {
    if (record?.uuid == null) return;

    setIsPushing(true);
    setHasBeenPulled(false);
    setHasBeenPushed(false);
    setPendingPushJobUuid(null);
    setIgnoredPushJobUuids(
      new Set((delayedJobs ?? []).filter(job => job.name === PUSH_TRANSLATIONS_JOB_NAME).map(job => job.uuid))
    );
    setPendingPush(true);

    void pushFormTranslation(record.uuid).catch(() => {
      finishPush(false);
    });
  }, [record?.uuid, delayedJobs, finishPush]);

  useEffect(() => {
    if (!pendingPush || delayedJobs == null || delayedJobs.length === 0) {
      return;
    }

    const relevantJobs = delayedJobs.filter(
      job => job.name === PUSH_TRANSLATIONS_JOB_NAME && !ignoredPushJobUuids.has(job.uuid)
    );

    if (pendingPushJobUuid == null) {
      const pendingJob = relevantJobs.find(job => job.status === "pending");
      if (pendingJob != null) {
        setPendingPushJobUuid(pendingJob.uuid);
        return;
      }

      // Job may finish before we observe the pending state.
      const completedJob = relevantJobs.find(job => job.status === "succeeded" || job.status === "failed");
      if (completedJob != null) {
        finishPush(completedJob.status === "succeeded");
      }
      return;
    }

    const trackedJob = delayedJobs.find(job => job.uuid === pendingPushJobUuid);
    if (trackedJob == null || trackedJob.status === "pending") {
      return;
    }

    finishPush(trackedJob.status === "succeeded");
  }, [delayedJobs, pendingPush, pendingPushJobUuid, ignoredPushJobUuids, finishPush]);

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
