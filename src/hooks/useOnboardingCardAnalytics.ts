import { useCallback, useEffect, useRef } from "react";

import {
  OnboardingCardEntityType,
  OnboardingCardType,
  trackOnboardingCardLinkClicked,
  trackOnboardingCardViewed
} from "@/utils/analytics/onboardingCardAnalytics";

type UseOnboardingCardAnalyticsProps = {
  cardType: OnboardingCardType;
  entityType?: OnboardingCardEntityType | null;
  entityId?: string | null;
};

export const useOnboardingCardAnalytics = ({ cardType, entityType, entityId }: UseOnboardingCardAnalyticsProps) => {
  const viewedKeyRef = useRef<string | null>(null);

  useEffect(() => {
    if (entityType == null || entityId == null || entityId.trim() === "") return;

    const viewedKey = `${cardType}|${entityType}|${entityId}`;
    if (viewedKeyRef.current === viewedKey) return;

    viewedKeyRef.current = viewedKey;
    trackOnboardingCardViewed({ cardType, entityType, entityId });
  }, [cardType, entityType, entityId]);

  const trackLinkClick = useCallback(
    (linkLabel: string, linkUrl: string) => {
      trackOnboardingCardLinkClicked({ cardType, entityType, entityId, linkLabel, linkUrl });
    },
    [cardType, entityType, entityId]
  );

  const isTrackingEnabled = entityType != null && entityId != null && entityId.trim() !== "";

  return { trackLinkClick, isTrackingEnabled };
};
