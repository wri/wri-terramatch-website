import { FormModelType } from "@/connections/Form";
import { EntityName } from "@/types/common";
import { OnboardingCardEventName, trackOnboardingCardEvent } from "@/utils/ga4";

export const ONBOARDING_CARD_TYPES = {
  MRV_GUIDANCE: "mrv_guidance",
  FINANCIAL_REPORTING: "financial_reporting"
} as const;

export type OnboardingCardType = (typeof ONBOARDING_CARD_TYPES)[keyof typeof ONBOARDING_CARD_TYPES];

export type OnboardingCardEntityType = "project-report" | "site-report" | "nursery-report" | "financial-report";

const TRACKED_REPORT_ENTITY_TYPES: Partial<Record<FormModelType | EntityName, OnboardingCardEntityType>> = {
  projectReports: "project-report",
  "project-reports": "project-report",
  siteReports: "site-report",
  "site-reports": "site-report",
  nurseryReports: "nursery-report",
  "nursery-reports": "nursery-report",
  financialReports: "financial-report",
  "financial-reports": "financial-report"
};

export const resolveOnboardingCardEntityType = (
  model?: FormModelType | EntityName | null
): OnboardingCardEntityType | null => {
  if (model == null) return null;
  return TRACKED_REPORT_ENTITY_TYPES[model] ?? null;
};

type OnboardingCardContext = {
  cardType: OnboardingCardType;
  entityType: OnboardingCardEntityType;
  entityId: string;
};

const isTrackableContext = (
  cardType?: string | null,
  entityType?: OnboardingCardEntityType | null,
  entityId?: string | null
): cardType is OnboardingCardType =>
  cardType != null && cardType.trim() !== "" && entityType != null && entityId != null && entityId.trim() !== "";

const getOnboardingCardContext = ({
  cardType,
  entityType,
  entityId
}: {
  cardType?: OnboardingCardType | null;
  entityType?: OnboardingCardEntityType | null;
  entityId?: string | null;
}): OnboardingCardContext | null =>
  isTrackableContext(cardType, entityType, entityId)
    ? { cardType, entityType: entityType!, entityId: entityId! }
    : null;

export const trackOnboardingCardAnalyticsEvent = (
  eventName: OnboardingCardEventName,
  params: OnboardingCardContext & { link_label?: string; link_url?: string }
): void => {
  const { cardType, entityType, entityId, link_label, link_url } = params;
  const context = getOnboardingCardContext({ cardType, entityType, entityId });
  if (context == null) return;

  trackOnboardingCardEvent(eventName, {
    card_type: context.cardType,
    entity_type: context.entityType,
    entity_id: context.entityId,
    ...(link_label != null && link_label !== "" ? { link_label } : {}),
    ...(link_url != null && link_url !== "" ? { link_url } : {})
  });
};

export const trackOnboardingCardViewed = (params: {
  cardType?: OnboardingCardType | null;
  entityType?: OnboardingCardEntityType | null;
  entityId?: string | null;
}): void => {
  const context = getOnboardingCardContext(params);
  if (context == null) return;
  trackOnboardingCardAnalyticsEvent("onboarding_card_viewed", context);
};

export const trackOnboardingCardLinkClicked = (params: {
  cardType?: OnboardingCardType | null;
  entityType?: OnboardingCardEntityType | null;
  entityId?: string | null;
  linkLabel: string;
  linkUrl: string;
}): void => {
  const context = getOnboardingCardContext(params);
  if (context == null) return;
  trackOnboardingCardAnalyticsEvent("onboarding_card_link_clicked", {
    ...context,
    link_label: params.linkLabel,
    link_url: params.linkUrl
  });
};
