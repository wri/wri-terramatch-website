import FORM_TYPES from '../../components/formInput/FormInputTypes';
import { numberOnlyKeyDown } from '../../helpers/input';
import { uploadPitchCover } from '../../redux/modules/pitch';
import validators from '../../components/formWalkthrough/FormValidators';

export const getSteps = (t) => [
  {
    title: 'createOffer.details.beforeYouBegin',
    subtext: 'createOffer.details.beforeYouBeginHelp',
    nextSubmitButton: 'common.start',
    cancelButton: 'common.cancel',
    fields: [
      {
        type: FORM_TYPES.externalLink,
        label: 'createOffer.details.downloadChecklist',
        link: '/pdf/terra-match-project-pitch-funding-offfer-checklist.pdf',
        key: 'link1'
      }
    ]
  },
  {
    title: 'createOffer.details.projectName',
    subtext: 'createOffer.details.projectNameHelp',
    nextSubmitButton: 'common.next',
    fields: [
      {
        modelKey: 'name',
        label: 'createOffer.details.projectName',
        type: FORM_TYPES.text,
        required: true,
        showLabel: true
      }
    ]
  },
  {
    title: 'createOffer.details.landOwnership',
    subtext: 'createOffer.details.landOwnershipHelp',
    nextSubmitButton: 'common.next',
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
        validationFuncName: 'notEmptyArrayCheck',
        shouldSetOnError: true
      },
    ]
  },
  {
    title: 'createOffer.details.landTypes',
    subtext: 'createOffer.details.landTypesHelp',
    nextSubmitButton: 'common.next',
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
        validationFuncName: 'notEmptyArrayCheck',
        shouldSetOnError: true
      },
    ]
  },
  {
    title: 'createOffer.details.restorationMethods',
    subtext: 'createOffer.details.restorationMethodsHelp',
    nextSubmitButton: 'common.next',
    fields: [
      {
        modelKey: 'restoration_methods',
        label: 'createOffer.details.restorationMethods',
        type: FORM_TYPES.checkboxGroup,
        asyncValue: 'method',
        asyncLabel: 'api.restoration_methods',
        translate: true,
        resource: '/restoration_methods',
        required: true,
        showLabel: false,
        isGrid: true,
        validationFuncName: 'notEmptyArrayCheck',
        shouldSetOnError: true
      },
    ]
  },
  {
    title: 'createOffer.details.fundingSources',
    subtext: 'createOffer.details.fundingSourcesHelp',
    nextSubmitButton: 'common.next',
    fields: [
      {
        modelKey: 'funding_sources',
        label: 'createOffer.details.fundingSources',
        type: FORM_TYPES.checkboxGroup,
        asyncValue: 'source',
        asyncLabel: 'api.funding_sources',
        translate: true,
        resource: '/funding_sources',
        required: true,
        showLabel: false,
        isGrid: true,
        validationFuncName: 'notEmptyArrayCheck',
        shouldSetOnError: true
      },
    ]
  },
  {
    title: 'createOffer.details.restorationGoals',
    subtext: 'createOffer.details.restorationGoalsHelp',
    nextSubmitButton: 'common.next',
    fields: [
      {
        modelKey: 'restoration_goals',
        label: 'createOffer.details.restorationGoals',
        type: FORM_TYPES.checkboxGroup,
        asyncValue: 'goal',
        asyncLabel: 'api.restoration_goals',
        translate: true,
        resource: '/restoration_goals',
        required: true,
        showLabel: false,
        isGrid: true,
        validationFuncName: 'notEmptyArrayCheck',
        shouldSetOnError: true
      },
    ]
  },
  {
    title: 'createOffer.details.fundingBracket',
    subtext: 'createOffer.details.fundingBracketHelp',
    nextSubmitButton: 'common.next',
    fields: [
      {
        modelKey: 'funding_bracket',
        label: 'createOffer.details.fundingBracket',
        type: FORM_TYPES.asyncSelect,
        resource: '/funding_brackets',
        asyncValue: 'bracket',
        asyncLabel: 'api.funding_brackets',
        translate: true,
        required: true,
        showLabel: true
      },
      {
        modelKey: 'funding_amount',
        label: 'createOffer.details.fundingAmount',
        type: FORM_TYPES.number,
        required: false,
        showLabel: true,
        onKeyDown: numberOnlyKeyDown,
        min: "0"
      }
    ]
  },
  {
    title: 'createOffer.details.location',
    subtext: 'createOffer.details.locationHelp',
    nextSubmitButton: 'common.next',
    fields: [
      {
        modelKey: 'land_size',
        label: 'createOffer.details.landSize',
        type: FORM_TYPES.asyncSelect,
        resource: '/land_sizes',
        asyncValue: 'size',
        asyncLabel: 'api.land_sizes',
        translate: true,
        required: true,
        showLabel: true
      },
      {
        modelKey: 'land_continent',
        label: 'createOffer.details.continent',
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
        keyFunc: (model) => {
          // This forces the component to re-mount when land_country changes
          return `land_country-${model.land_continent}`
        },
        modelKey: 'land_country',
        label: 'createOrganisation.details.country',
        type: FORM_TYPES.asyncSelect,
        resource: '/countries',
        filterData: (item, model) => {
          // Filter by land_continent
          if (model.land_continent) {
            return item.continent === model.land_continent;
          }
          return true;
        },
        asyncValue: 'code',
        translate: true,
        asyncLabel: 'api.countries',
        required: false,
        showLabel: true,
        isClearable: true,
        sortAlphabetical: true
      }
    ]
  },
  {
    title: 'createOffer.details.longTermEngagement',
    subtext: 'createOffer.details.longTermEngagementHelp',
    nextSubmitButton: 'common.next',
    fields: [
      {
        modelKey: 'long_term_engagement',
        label: 'addTeamMember.details.longTermEngagement',
        type: FORM_TYPES.radioGroup,
        data: [
          { value: true, label: t('common.yes')},
          { value: false, label: t('common.no')}
        ],
        required: true,
        showLabel: false,
        validationFunc: validators.requiredCheck
      }
    ]
  },
  {
    title: 'createOffer.details.averagePricePerTree',
    subtext: 'createOffer.details.averagePricePerTreeHelp',
    nextSubmitButton: 'common.next',
    fields: [
      {
        modelKey: 'price_per_tree',
        label: 'createOffer.details.averagePricePerTree',
        type: FORM_TYPES.number,
        required: false,
        showLabel: true,
        onKeyDown: numberOnlyKeyDown,
        min: "0",
        step: "0.01"
      }
    ]
  },
  {
    title: 'createOffer.details.reporting',
    subtext: 'createOffer.details.reportingHelp',
    nextSubmitButton: 'common.next',
    fields: [
      {
        modelKey: 'reporting_frequency',
        label: 'createOffer.details.reportingFrequency',
        type: FORM_TYPES.asyncSelect,
        resource: '/reporting_frequencies',
        asyncValue: 'frequency',
        asyncLabel: 'api.reporting_frequencies',
        translate: true,
        required: true,
        showLabel: true
      },
      {
        modelKey: 'reporting_level',
        label: 'createOffer.details.reportingLevel',
        type: FORM_TYPES.asyncSelect,
        resource: '/reporting_levels',
        asyncValue: 'level',
        asyncLabel: 'api.reporting_levels',
        translate: true,
        required: true,
        showLabel: true
      }
    ]
  },
  {
    title: 'createOffer.details.sustDevGoals',
    subtext: 'createOffer.details.sustDevGoalsHelp',
    nextSubmitButton: 'common.next',
    fields: [
      {
        modelKey: 'sustainable_development_goals',
        label: 'createOffer.details.sustDevGoals',
        type: FORM_TYPES.checkboxGroup,
        asyncValue: 'goal',
        asyncLabel: 'api.sustainable_development_goals',
        translate: true,
        resource: '/sustainable_development_goals',
        required: false,
        showLabel: false,
        isGrid: true,
        shouldSetOnError: true
      },
    ]
  },
  {
    title: 'createOffer.details.projectTeam',
    subtext: 'createOffer.details.projectTeamHelp',
    nextSubmitButton: 'common.next',
    model: 'offer_contacts',
    fullWidth: true,
    fields: [
      {
        modelKey: 'teamSelect',
        label: 'createOffer.details.projectName',
        type: FORM_TYPES.userSelect,
        required: true,
        showLabel: false,
        validationFuncName: 'notEmptyArrayCheck',
        shouldSetOnError: true
      }
    ]
  },
  {
    title: 'createOffer.details.details',
    subtext: 'createOffer.details.detailsHelp',
    nextSubmitButton: 'createOffer.createOffer',
    fields: [
      {
        modelKey: 'description',
        label: 'createOffer.details.description',
        placeholder: 'createOffer.details.descriptionHelp',
        type: FORM_TYPES.textarea,
        required: true,
        showLabel: true
      },
      {
        type: FORM_TYPES.seperator,
        label: 'createPitch.details.media',
        key: 'sep1'
      },
      {
        modelKey: 'cover_photo',
        label: 'createPitch.details.cover',
        type: FORM_TYPES.file,
        accept: FORM_TYPES.fileTypes.image,
        uploadMethod: uploadPitchCover,
        required: true,
        showLabel: true
      }
    ]
  }
];
