// TODO TM-4219: temporary mock data for the Organization Details tab, typed as the form answers it stands
// in for. Replace with the organization form answers before merging.
import type { OrganisationFormSection } from "./OrganizationDetailsTabContent";

export const MOCK_ORGANISATION_FORM_SECTIONS: OrganisationFormSection[] = [
  {
    title: "Organization Details",
    completed: true,
    entries: [
      {
        title: "About",
        inputType: "long-text",
        value:
          "We are a community-led restoration organization working with smallholder farmers to restore degraded " +
          "land through agroforestry and assisted natural regeneration. Since 2015 we have trained more than 3,000 " +
          "farmers, set up 12 community nurseries and planted native species across three districts."
      },
      { title: "Website", inputType: "url", value: "http://www.bondy.earth" },
      { title: "Headquarters", inputType: "text", value: "Antananarivo, MDG" },
      { title: "Organization phone number", inputType: "tel", value: "+261344456374" }
    ]
  },
  {
    title: "Organizational Governance",
    completed: true,
    entries: [
      { title: "Legal registration", inputType: "text", value: "Registered NGO, 2015" },
      { title: "Board members", inputType: "number", value: 7 },
      {
        title: "Decision-making structure",
        inputType: "long-text",
        value: "A board elected every two years sets the strategy; cooperatives vote on how each site is managed."
      }
    ]
  },
  {
    title: "Social Media Presence",
    completed: true,
    entries: [
      { title: "Facebook", inputType: "url", value: "https://facebook.com/bondy.earth" },
      { title: "Instagram", inputType: "url", value: "https://instagram.com/bondy.earth" },
      { title: "LinkedIn", inputType: "url", value: "https://linkedin.com/company/bondy-earth" }
    ]
  },
  {
    title: "Organization Profile",
    completed: true,
    entries: [
      { title: "Full-time permanent employees", inputType: "number", value: 24 },
      { title: "Part-time permanent employees", inputType: "number", value: 12 },
      { title: "Temporary employees", inputType: "number", value: 40 }
    ]
  },
  { title: "Financial History", completed: false, entries: [] },
  { title: "Past Community Engagement Experience", completed: false, entries: [] },
  { title: "Past Restoration Experience", completed: false, entries: [] }
];
