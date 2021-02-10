import FORM_TYPES from "../../formInput/FormInputTypes";

export default [
  {
    title: "project.funding.title",
    fields: [
      {
        id: "funding_amount",
        label: "createPitch.details.fundingAmount",
        type: FORM_TYPES.number,
        required: true,
        showLabel: true
      },
      {
        id: "revenue_drivers",
        label: "createPitch.details.revenueDrivers",
        type: FORM_TYPES.checkboxGroup,
        resource: "/revenue_drivers",
        asyncValue: "driver",
        asyncLabel: "api.revenue_drivers",
        required: true,
        translate: true,
        showLabel: true,
        validationFuncName: 'notEmptyArrayCheck'
      },
      {
        id: "estimated_timespan",
        label: "createPitch.details.timespan",
        type: FORM_TYPES.number,
        required: true,
        showLabel: true
      }
    ]
  },
  {
    title: "project.capabilities.title",
    fields: [
      {
        id: "reporting_frequency",
        label: "createPitch.details.reportingFrequency",
        type: FORM_TYPES.asyncSelect,
        resource: "/reporting_frequencies",
        asyncValue: "frequency",
        asyncLabel: "api.reporting_frequencies",
        required: true,
        translate: true,
        showLabel: true
      },
      {
        id: "reporting_level",
        label: "createPitch.details.reportingLevel",
        type: FORM_TYPES.asyncSelect,
        resource: "/reporting_levels",
        asyncValue: "level",
        asyncLabel: "api.reporting_levels",
        required: true,
        translate: true,
        showLabel: true
      }
    ]
  },
  {
    title: "createPitch.details.locationMap",
    subtext: "createPitch.details.locationMapHelp",
    nextSubmitButton: "common.next",
    fullWidth: true,
    fields: [
      {
        id: "land_geojson",
        label: "createPitch.details.locationMap",
        type: FORM_TYPES.map,
        required: true,
        showLabel: true,
        validationFuncName: "requiredCheck"
      }
    ]
  },
  {
    title: "createPitch.details.sustDevGoals",
    subtext: "createPitch.details.sustDevGoalsHelp",
    nextSubmitButton: "common.next",
    fields: [
      {
        id: "sustainable_development_goals",
        label: "createPitch.details.sustDevGoals",
        type: FORM_TYPES.checkboxGroup,
        asyncValue: "goal",
        asyncLabel: "api.sustainable_development_goals",
        translate: true,
        resource: "/sustainable_development_goals",
        required: true,
        showLabel: false,
        validationFuncName: "notEmptyArrayCheck"
      }
    ]
  }
];
