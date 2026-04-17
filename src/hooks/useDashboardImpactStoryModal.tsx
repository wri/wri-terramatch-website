import { useT } from "@transifex/react";
import { useEffect, useState } from "react";

import type { ImpactStoryModalRow } from "@/components/dashboard/impactStoriesModalColumns";
import { ModalId } from "@/components/extensive/Modal/ModalConst";
import ModalStory, { ImpactStoryData } from "@/components/extensive/Modal/ModalStory";
import { useDashboardImpactStory } from "@/connections/DashboardEntity";
import { useGadmChoices } from "@/connections/Gadm";
import { useModalContext } from "@/context/modal.provider";
import { DashboardImpactStoryFullDto } from "@/generated/v3/dashboardService/dashboardServiceSchemas";
import { parseImpactStoryContent } from "@/utils/impactStory";
import Log from "@/utils/log";

type PendingStoryData = Record<string, unknown> & {
  uuid?: string;
  category?: unknown;
  organization?: { facebook_url?: string; instagram_url?: string; linkedin_url?: string; twitter_url?: string };
};

export function useDashboardImpactStoryModal() {
  const t = useT();
  const { openModal } = useModalContext();
  const countryChoices = useGadmChoices({ level: 0 });
  const [selectedStoryId, setSelectedStoryId] = useState<string | undefined>(undefined);
  const [pendingStoryData, setPendingStoryData] = useState<PendingStoryData | null>(null);
  const [, { data: impactStory, loadFailure }] = useDashboardImpactStory({ id: selectedStoryId });

  useEffect(() => {
    if (!selectedStoryId || !pendingStoryData || !impactStory) return;

    const fullStory = impactStory as unknown as DashboardImpactStoryFullDto;
    const parsedData = {
      uuid: fullStory.uuid ?? "",
      title: fullStory.title ?? "",
      date: fullStory.date ?? "",
      content: fullStory.content ? parseImpactStoryContent(fullStory.content) : "",
      category: fullStory.category ?? [],
      thumbnail: fullStory.thumbnail ?? "",
      organization: {
        name: fullStory.organisation?.name ?? "",
        category: fullStory.category ?? pendingStoryData.category ?? [],
        country:
          fullStory.organisation?.countries && fullStory.organisation.countries.length > 0
            ? fullStory.organisation.countries
                .map((c: { label?: string }) => {
                  const found = countryChoices.find(choice => choice.id === c.label);
                  return found ? found.name : c.label;
                })
                .join(", ")
            : "No country",
        facebook_url: fullStory.organisation?.facebook_url ?? pendingStoryData.organization?.facebook_url ?? "",
        instagram_url: fullStory.organisation?.instagram_url ?? pendingStoryData.organization?.instagram_url ?? "",
        linkedin_url: fullStory.organisation?.linkedin_url ?? pendingStoryData.organization?.linkedin_url ?? "",
        twitter_url: fullStory.organisation?.twitter_url ?? pendingStoryData.organization?.twitter_url ?? ""
      },
      status: fullStory.status ?? ""
    };
    openModal(
      ModalId.MODAL_STORY,
      <ModalStory data={parsedData as ImpactStoryData} preview={false} title={t("IMPACT STORY")} />
    );

    setSelectedStoryId(undefined);
    setPendingStoryData(null);
  }, [selectedStoryId, pendingStoryData, impactStory, openModal, t, countryChoices]);

  useEffect(() => {
    if (!selectedStoryId || !pendingStoryData || !loadFailure) return;

    Log.error("Error fetching story details:", loadFailure.message);
    openModal(
      ModalId.MODAL_STORY,
      <ModalStory data={pendingStoryData as unknown as ImpactStoryData} preview={false} title={t("IMPACT STORY")} />
    );

    setSelectedStoryId(undefined);
    setPendingStoryData(null);
  }, [selectedStoryId, pendingStoryData, loadFailure, openModal, t]);

  const openStoryFromListItem = (storyData: ImpactStoryModalRow) => {
    setSelectedStoryId(storyData.uuid);
    setPendingStoryData(storyData as unknown as PendingStoryData);
  };

  return { openStoryFromListItem };
}
