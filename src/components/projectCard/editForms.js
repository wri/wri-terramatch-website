import FORM_TYPES from '../../components/formInput/FormInputTypes';

export const editForms = {
  land_types: {
    title: 'createPitch.details.landTypes',
    subtext: 'createPitch.details.landTypesHelp',
    fields: [
      {
        modelKey: 'land_types',
        label: 'addTeamMember.details.landOwnership',
        type: FORM_TYPES.checkboxGroup,
        asyncValue: 'type',
        asyncLabel: 'api.land_types',
        translate: true,
        resource: '/land_types',
        required: true,
        showLabel: false,
        isGrid: true,
        validationFuncName: 'notEmptyArrayCheck'
      }
    ]
  },
  land_ownerships: {
    title: 'createPitch.details.landOwnership',
    subtext: 'createPitch.details.landOwnershipHelp',
    fields: [
      {
        modelKey: 'land_ownerships',
        label: 'addTeamMember.details.landOwnership',
        type: FORM_TYPES.checkboxGroup,
        asyncValue: 'ownership',
        asyncLabel: 'api.land_ownerships',
        resource: '/land_ownerships',
        translate: true,
        required: true,
        showLabel: false,
        isGrid: true,
        validationFuncName: 'notEmptyArrayCheck'
      },
    ]
  },
  land_size: {
    title: 'createPitch.details.location',
    subtext: 'createPitch.details.locationHelp',
    fields: [
        {
          modelKey: 'land_size',
          label: 'createPitch.details.landSize',
          type: FORM_TYPES.asyncSelect,
          resource: '/land_sizes',
          asyncValue: 'size',
          asyncLabel: 'api.land_sizes',
          translate: true,
          required: true,
          showLabel: true
        },
      ]
  },
  land_continent: {
    title: 'createPitch.details.location',
    subtext: 'createPitch.details.locationHelp',
    fields: [
        {
          modelKey: 'land_continent',
          label: 'createPitch.details.continent',
          type: FORM_TYPES.asyncSelect,
          resource: '/continents',
          asyncValue: 'continent',
          asyncLabel: 'api.continents',
          translate: true,
          required: true,
          showLabel: true,
          sortAlphabetical: true
        },
        {
          modelKey: 'land_country',
          label: 'createOrganisation.details.country',
          type: FORM_TYPES.asyncSelect,
          resource: '/countries',
          asyncValue: 'code',
          translate: true,
          asyncLabel: 'api.countries',
          required: true,
          showLabel: true,
          sortAlphabetical: true
        }
      ]
  },
  restoration_methods: {
    title: 'createPitch.details.restorationMethods',
    subtext: 'createPitch.details.restorationMethodsHelp',
    fields: [
      {
        modelKey: 'restoration_methods',
        label: 'createPitch.details.restorationMethods',
        type: FORM_TYPES.checkboxGroup,
        asyncValue: 'method',
        asyncLabel: 'api.restoration_methods',
        translate: true,
        resource: '/restoration_methods',
        required: true,
        showLabel: false,
        isGrid: true,
        validationFuncName: 'notEmptyArrayCheck'
      },
    ]
  },
  restoration_goals: {
    title: 'createPitch.details.restorationGoals',
    subtext: 'createPitch.details.restorationGoalsHelp',
    fields: [
      {
        modelKey: 'restoration_goals',
        label: 'createPitch.details.restorationGoals',
        type: FORM_TYPES.checkboxGroup,
        asyncValue: 'goal',
        asyncLabel: 'api.restoration_goals',
        translate: true,
        resource: '/restoration_goals',
        required: true,
        showLabel: false,
        isGrid: true,
        validationFuncName: 'notEmptyArrayCheck'
      },
    ]
  },
  funding_sources: {
    title: 'createPitch.details.fundingSources',
    subtext: 'createPitch.details.fundingSourcesHelp',
    fields: [
      {
        modelKey: 'funding_sources',
        label: 'createPitch.details.fundingSources',
        type: FORM_TYPES.checkboxGroup,
        asyncValue: 'source',
        asyncLabel: 'api.funding_sources',
        translate: true,
        resource: '/funding_sources',
        required: true,
        showLabel: false,
        isGrid: true,
        validationFuncName: 'notEmptyArrayCheck'
      },
    ]
  },
  funding_amount: {
    title: 'createPitch.details.fundingAmount',
    subtext: 'createPitch.details.fundingAmountHelp',
    nextSubmitButton: 'common.next',
    fields: [
      {
        modelKey: 'funding_amount',
        label: 'createPitch.details.fundingAmount',
        type: FORM_TYPES.number,
        required: true,
        showLabel: true
      }
    ]
  },
  funding_bracket: {
    title: 'createPitch.details.fundingBracket',
    subtext: 'createPitch.details.fundingBracketHelp',
    nextSubmitButton: 'common.next',
    fields: [
      {
        modelKey: 'funding_bracket',
        label: 'createPitch.details.fundingBracket',
        type: FORM_TYPES.asyncSelect,
        resource: '/funding_brackets',
        asyncValue: 'bracket',
        asyncLabel: 'api.funding_brackets',
        translate: true,
        required: true,
        showLabel: true
      }
    ]
  }
};
