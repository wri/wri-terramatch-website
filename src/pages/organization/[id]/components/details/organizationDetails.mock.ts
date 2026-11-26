// TODO TM-4219: temporary mock data for the Organization Details tab, typed as the form answers it stands
// in for. Replace with the organization form answers (see `useOrganisationFormSections`).
import { useT } from "@transifex/react";

import { OrganisationFormSection } from "./useOrganisationFormSections";

export const getMockOrganisationFormSections = (t: typeof useT): OrganisationFormSection[] => [
  {
    id: "organization-details",
    title: t("Organization Details"),
    completed: true,
    entries: [
      {
        name: "description",
        title: t("About"),
        inputType: "long-text",
        value:
          "We are a community-led restoration organization working with smallholder farmers to restore degraded " +
          "land through agroforestry and assisted natural regeneration. Since 2015 we have trained more than 3,000 " +
          "farmers, set up 12 community nurseries and planted native species across three districts."
      },
      { name: "webUrl", title: t("Website"), inputType: "url", value: "http://www.bondy.earth" },
      { name: "hqAddress", title: t("Headquarters"), inputType: "text", value: "Antananarivo, MDG" },
      { name: "phone", title: t("Organization phone number"), inputType: "tel", value: "+261344456374" }
    ]
  },
  {
    id: "organizational-governance",
    title: t("Organizational Governance"),
    completed: true,
    entries: [
      { name: "legalRegistration", title: t("Legal registration"), inputType: "text", value: "Registered NGO, 2015" },
      { name: "boardMembers", title: t("Board members"), inputType: "number", value: 7 },
      {
        name: "decisionMakingStructure",
        title: t("Decision-making structure"),
        inputType: "long-text",
        value: "A board elected every two years sets the strategy; cooperatives vote on how each site is managed."
      }
    ]
  },
  {
    id: "social-media-presence",
    title: t("Social Media Presence"),
    completed: true,
    entries: [
      { name: "facebookUrl", title: t("Facebook"), inputType: "url", value: "https://facebook.com/bondy.earth" },
      { name: "instagramUrl", title: t("Instagram"), inputType: "url", value: "https://instagram.com/bondy.earth" },
      {
        name: "linkedinUrl",
        title: t("LinkedIn"),
        inputType: "url",
        value: "https://linkedin.com/company/bondy-earth"
      }
    ]
  },
  {
    id: "organization-profile",
    title: t("Organization Profile"),
    completed: true,
    entries: [
      {
        name: "ftPermanentEmployees",
        title: t("Full-time permanent employees"),
        inputType: "number",
        value: 24
      },
      {
        name: "ptPermanentEmployees",
        title: t("Part-time permanent employees"),
        inputType: "number",
        value: 12
      },
      { name: "tempEmployees", title: t("Temporary employees"), inputType: "number", value: 40 }
    ]
  },
  { id: "financial-history", title: t("Financial History"), completed: false, entries: [] },
  {
    id: "past-community-engagement-experience",
    title: t("Past Community Engagement Experience"),
    completed: false,
    entries: []
  },
  { id: "past-restoration-experience", title: t("Past Restoration Experience"), completed: false, entries: [] }
];
