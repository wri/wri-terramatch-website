import { useCallback, useEffect } from "react";

import {
  OnboardingCardEntityType,
  OnboardingCardType,
  trackOnboardingCardLinkClicked,
  trackOnboardingCardViewedOnce
} from "@/utils/analytics/onboardingCardAnalytics";

type UseOnboardingCardAnalyticsProps = {
  cardType: OnboardingCardType;
  entityType?: OnboardingCardEntityType | null;
  entityId?: string | null;
};

export const useOnboardingCardAnalytics = ({ cardType, entityType, entityId }: UseOnboardingCardAnalyticsProps) => {
  useEffect(() => {
    trackOnboardingCardViewedOnce({ cardType, entityType, entityId });
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
