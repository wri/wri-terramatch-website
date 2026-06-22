import { createContext, useContext } from "react";

type OnboardingCardAnalyticsContextValue = {
  trackLinkClick: (linkLabel: string, linkUrl: string) => void;
  isTrackingEnabled: boolean;
};

export const OnboardingCardAnalyticsContext = createContext<OnboardingCardAnalyticsContextValue | null>(null);

export const useOnboardingCardAnalyticsContext = () => useContext(OnboardingCardAnalyticsContext);
