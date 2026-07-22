import { FC, PropsWithChildren } from "react";

import { useOnboardingCardAnalytics } from "@/hooks/useOnboardingCardAnalytics";
import { OnboardingCardEntityType, OnboardingCardType } from "@/utils/analytics/onboardingCardAnalytics";
import { OnboardingCardAnalyticsContext } from "@/utils/analytics/onboardingCardAnalytics.context";

export type OnboardingCardProps = PropsWithChildren<{
  cardType: OnboardingCardType;
  entityType?: OnboardingCardEntityType | null;
  entityId?: string | null;
  className?: string;
}>;

/**
 * Wrapper for report-form onboarding cards. Fires `onboarding_card_viewed` once when mounted
 * with valid entity context. Child links can use `useOnboardingCardAnalyticsContext` or pass
 * `onLinkClick` from context to `About`.
 */
const OnboardingCard: FC<OnboardingCardProps> = ({ cardType, entityType, entityId, className, children }) => {
  const analytics = useOnboardingCardAnalytics({ cardType, entityType, entityId });

  return (
    <OnboardingCardAnalyticsContext.Provider value={analytics}>{children}</OnboardingCardAnalyticsContext.Provider>
  );
};

export default OnboardingCard;
