import { Button } from "@mui/material";
import { useCallback, useEffect, useState } from "react";

import Text from "@/components/elements/Text/Text";
import Icon, { IconNames } from "@/components/extensive/Icon/Icon";
import { useDelayedJobs } from "@/connections/DelayedJob";

const PUSH_TRANSLATIONS_JOB_NAME = "Push Translations to Transifex";

type PushTranslationsButtonProps = {
  uuid?: string;
  push: (uuid: string) => Promise<unknown>;
};

export const PushTranslationsButton = ({ uuid, push }: PushTranslationsButtonProps) => {
  const [, { delayedJobs }] = useDelayedJobs();
  const [hasBeenPushed, setHasBeenPushed] = useState(false);
  const [isPushing, setIsPushing] = useState(false);
  const [pendingPush, setPendingPush] = useState(false);
  const [pendingPushJobUuid, setPendingPushJobUuid] = useState<string | null>(null);
  const [ignoredPushJobUuids, setIgnoredPushJobUuids] = useState<Set<string>>(() => new Set());

  const finishPush = useCallback((succeeded: boolean) => {
    if (succeeded) {
      setHasBeenPushed(true);
    }
    setIsPushing(false);
    setPendingPush(false);
    setPendingPushJobUuid(null);
  }, []);

  const pushTranslations = useCallback(() => {
    if (uuid == null) return;

    setIsPushing(true);
    setHasBeenPushed(false);
    setPendingPushJobUuid(null);
    setIgnoredPushJobUuids(
      new Set((delayedJobs ?? []).filter(job => job.name === PUSH_TRANSLATIONS_JOB_NAME).map(job => job.uuid))
    );
    setPendingPush(true);

    void push(uuid).catch(() => {
      finishPush(false);
    });
  }, [uuid, delayedJobs, finishPush, push]);

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

  return (
    <div className="inline-flex items-center gap-2">
      <Button disabled={isPushing || uuid == null} onClick={pushTranslations}>
        {isPushing ? (
          <Icon name={IconNames.SPINNER} className="h-5 w-5 animate-spin lg:h-6 lg:w-6" />
        ) : (
          <Icon name={IconNames.UPLOAD_PA} className="h-5 w-5 lg:h-6 lg:w-6" />
        )}
        Push Translations
      </Button>
      {hasBeenPushed && (
        <Text variant="text-14-light" className="text-darkCustom">
          Translations have been pushed successfully
        </Text>
      )}
    </div>
  );
};
