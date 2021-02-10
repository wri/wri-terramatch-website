import FORM_TYPES from '../../components/formInput/FormInputTypes';
import { uploadPitchCover, uploadPitchVideo } from '../../redux/modules/pitch';
import { getMethodMetricsSteps } from './methodMetrics/steps';
import { getTreeSteps } from './treeSpecies/steps';
import { getCarbonSteps } from './carbonCertifications/steps';
import validators from '../../components/formWalkthrough/FormValidators';

export const getSteps = (t) => [
  {
    title: 'createPitch.details.beforeYouBegin',
    subtext: 'createPitch.details.beforeYouBeginHelp',
    nextSubmitButton: 'common.start',
    cancelButton: 'common.cancel',
    fields: [
      {
        type: FORM_TYPES.externalLink,
        label: 'createPitch.details.downloadChecklist',
        link: '/pdf/terra-match-project-pitch-funding-offfer-checklist.pdf',
        key: 'link1'
      }
    ]
  },
  {
    title: 'createPitch.details.projectName',
    subtext: 'createPitch.details.projectNameHelp',
    nextSubmitButton: 'createPitch.createPitch',
    fields: [
      {
        modelKey: 'name',
        label: 'createPitch.details.projectName',
        type: FORM_TYPES.text,
        required: true,
        showLabel: true
      }
    ]
  },
  {
    title: 'createPitch.details.landOwnership',
    subtext: 'createPitch.details.landOwnershipHelp',
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
      }
    ]
  },
  {
    title: 'createPitch.details.landTypes',
    subtext: 'createPitch.details.landTypesHelp',
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
    title: 'createPitch.details.restorationMethods',
    subtext: 'createPitch.details.restorationMethodsHelp',
    nextSubmitButton: 'common.next',
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
        validationFuncName: 'notEmptyArrayCheck',
        shouldSetOnError: true
      },
    ]
  },
  {
    title: 'createPitch.details.fundingSources',
    subtext: 'createPitch.details.fundingSourcesHelp',
    nextSubmitButton: 'common.next',
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
        validationFuncName: 'notEmptyArrayCheck',
        shouldSetOnError: true
      },
    ]
  },
  {
    title: 'createPitch.details.restorationGoals',
    subtext: 'createPitch.details.restorationGoalsHelp',
    nextSubmitButton: 'common.next',
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
        validationFuncName: 'notEmptyArrayCheck',
        shouldSetOnError: true
      },
    ]
  },
  {
    title: 'createPitch.details.fundingAmount',
    subtext: 'createPitch.details.fundingAmountHelp',
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
      },
      {
        modelKey: 'funding_amount',
        label: 'createPitch.details.fundingAmount',
        type: FORM_TYPES.number,
        required: true,
        showLabel: true,
        min: "0"
      }
    ]
  },
  {
    title: 'createPitch.details.location',
    subtext: 'createPitch.details.locationHelp',
    nextSubmitButton: 'common.next',
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
        required: true,
        showLabel: true,
        sortAlphabetical: true
      }
    ]
  },
  {
    title: 'createPitch.details.locationMap',
    subtext: 'createPitch.details.locationMapHelp',
    nextSubmitButton: 'common.next',
    fullWidth: true,
    fields: [
      {
        modelKey: 'land_geojson',
        label: 'createPitch.details.locationMap',
        type: FORM_TYPES.map,
        required: true,
        showLabel: true,
        validationFuncName: 'requiredCheck'
      }
    ]
  },
  {
    title: 'createPitch.details.reporting',
    subtext: 'createPitch.details.reportingHelp',
    nextSubmitButton: 'common.next',
    fields: [
      {
        modelKey: 'reporting_frequency',
        label: 'createPitch.details.reportingFrequency',
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
        label: 'createPitch.details.reportingLevel',
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
    // Method Metrics
    overrideMethod: getMethodMetricsSteps,
    model: 'restoration_method_metrics'
  },
  {
    // Tree Species
    overrideMethod: getTreeSteps,
    model: 'tree_species',
    isList: true,
    defaultCount: 0
  },
  {
    // Carbon certificates
    overrideMethod: getCarbonSteps,
    model: 'carbon_certifications',
    isList: true
  },
  {
    title: 'createPitch.details.revenueDrivers',
    subtext: 'createPitch.details.revenueDriversHelp',
    nextSubmitButton: 'common.next',
    fields: [
      {
        modelKey: 'revenue_drivers',
        label: 'createPitch.details.revenueDrivers',
        type: FORM_TYPES.checkboxGroup,
        asyncValue: 'driver',
        asyncLabel: 'api.revenue_drivers',
        translate: true,
        resource: '/revenue_drivers',
        required: false,
        showLabel: false,
        isGrid: true,
        shouldSetOnError: true
      },
    ]
  },
  {
    title: 'createPitch.details.sustDevGoals',
    subtext: 'createPitch.details.sustDevGoalsHelp',
    nextSubmitButton: 'common.next',
    fields: [
      {
        modelKey: 'sustainable_development_goals',
        label: 'createPitch.details.sustDevGoals',
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
    title: 'createPitch.details.timespan',
    subtext: 'createPitch.details.timespanHelp',
    nextSubmitButton: 'common.next',
    fields: [
      {
        modelKey: 'estimated_timespan',
        label: 'createPitch.details.timespan',
        type: FORM_TYPES.number,
        required: true,
        showLabel: false
      }
    ]
  },
  {
    title: 'createPitch.details.projectTeam',
    subtext: 'createPitch.details.projectTeamHelp',
    nextSubmitButton: 'common.next',
    model: 'pitch_contacts',
    fullWidth: true,
    fields: [
      {
        modelKey: 'teamSelect',
        label: 'createPitch.details.projectName',
        type: FORM_TYPES.userSelect,
        required: true,
        showLabel: false,
        validationFuncName: 'notEmptyArrayCheck',
        shouldSetOnError: true
      }
    ]
  },
  {
    title: 'createPitch.details.details',
    subtext: 'createPitch.details.detailsHelp',
    nextSubmitButton: 'common.next',
    fields: [
      {
        modelKey: 'description',
        label: 'createPitch.details.description',
        placeholder: 'createPitch.details.descriptionHelp',
        type: FORM_TYPES.textarea,
        required: true,
        showLabel: true,
        autocomplete: 'off'
      },
      {
        modelKey: 'problem',
        label: 'createPitch.details.problem',
        placeholder: 'createPitch.details.problemHelp',
        type: FORM_TYPES.textarea,
        required: true,
        showLabel: true,
        autocomplete: 'off'
      },
      {
        modelKey: 'anticipated_outcome',
        label: 'createPitch.details.anticipatedOutcome',
        placeholder: 'createPitch.details.anticipatedOutcomeHelp',
        type: FORM_TYPES.textarea,
        required: true,
        showLabel: true,
        autocomplete: 'off'
      },
      {
        modelKey: 'who_is_involved',
        label: 'createPitch.details.whoIsInvolved',
        placeholder: 'createPitch.details.whoIsInvolvedHelp',
        type: FORM_TYPES.textarea,
        required: true,
        showLabel: true,
        autocomplete: 'off'
      },
      {
        modelKey: 'local_community_involvement',
        label: 'createPitch.details.localCommunityInvolvement',
        type: FORM_TYPES.radioGroup,
        data: [
          { value: true, label: t('common.yes')},
          { value: false, label: t('common.no')}
        ],
        required: true,
        showLabel: true,
        validationFunc: validators.requiredCheck
      },
      {
        modelKey: 'training_involved',
        label: 'createPitch.details.trainingInvolved',
        type: FORM_TYPES.radioGroup,
        data: [
          { value: true, label: t('common.yes')},
          { value: false, label: t('common.no')}
        ],
        required: true,
        showLabel: true,
        validationFunc: validators.requiredCheck
      },
      {
        modelKey: 'training_type',
        label: 'createPitch.details.trainingType',
        placeholder: 'createPitch.details.trainingTypeHelp',
        type: FORM_TYPES.textarea,
        showLabel: true,
        autocomplete: 'off',
        requiredFunc: (model) => {
          return model.traning_involved;
        }
      },
      {
        modelKey: 'training_amount_people',
        label: 'createPitch.details.trainingAmountPeople',
        type: FORM_TYPES.number,
        showLabel: true,
        min: "0",
        requiredFunc: (model) => {
          return model.traning_involved;
        }
      },
      {
        modelKey: 'people_working_in',
        label: 'createPitch.details.peopleWorkingIn',
        placeholder: 'createPitch.details.peopleWorkingInHelp',
        type: FORM_TYPES.textarea,
        required: true,
        showLabel: true,
        autocomplete: 'off'
      },
      {
        modelKey: 'people_amount_nearby',
        label: 'createPitch.details.peopleAmountNearby',
        type: FORM_TYPES.number,
        required: true,
        showLabel: true,
        min: "0"
      },
      {
        modelKey: 'people_amount_abroad',
        label: 'createPitch.details.peopleAmountAbroad',
        type: FORM_TYPES.number,
        required: true,
        showLabel: true,
        min: "0"
      },
      {
        modelKey: 'people_amount_employees',
        label: 'createPitch.details.peopleAmountEmployees',
        type: FORM_TYPES.number,
        required: true,
        showLabel: true,
        min: "0"
      },
      {
        modelKey: 'people_amount_volunteers',
        label: 'createPitch.details.peopleAmountVolunteers',
        type: FORM_TYPES.number,
        required: true,
        showLabel: true,
        min: "0"
      },
      {
        modelKey: 'benefited_people',
        label: 'createPitch.details.benefitedPeople',
        type: FORM_TYPES.number,
        required: true,
        showLabel: true,
        min: "0"
      },
      {
        modelKey: 'future_maintenance',
        label: 'createPitch.details.futureMaintenance',
        placeholder: 'createPitch.details.futureMaintenanceHelp',
        type: FORM_TYPES.textarea,
        required: true,
        showLabel: true,
        autocomplete: 'off'
      },
      {
        modelKey: 'use_of_resources',
        label: 'createPitch.details.useOfResources',
        placeholder: 'createPitch.details.useOfResourcesHelp',
        type: FORM_TYPES.textarea,
        required: true,
        showLabel: true,
        autocomplete: 'off'
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
  },
  {
    title: 'createPitch.details.addDocumentsTitle',
    subtext: 'createPitch.details.addDocumentsSubtext',
    nextSubmitButton: 'common.next',
    model: 'legalDocuments',
    fields: [
      {
        modelKey: 'docs',
        label: 'addDocumentAwards.details.uploadDocuments',
        type: FORM_TYPES.multiUpload,
        required: true,
        showLabel: true,
        accept: FORM_TYPES.fileTypes.imagePdf,
        validationFuncName: 'notEmptyArrayCheck',
        uploadMessage: 'addDocumentAwards.details.uploadDocuments'
      }
    ]
  },
  {
    title: 'createPitch.details.elevatorPitch',
    subtext: 'createPitch.details.elevatorPitchHelp',
    nextSubmitButton: 'createPitch.createPitch',
    fields: [
      {
        type: FORM_TYPES.videoPreview,
        label: 'common.exampleVideo',
        src: 'video-preview.mp4',
      },
      {
        modelKey: 'video',
        label: 'createPitch.details.video',
        type: FORM_TYPES.file,
        accept: FORM_TYPES.fileTypes.video,
        uploadMethod: uploadPitchVideo,
        showLabel: false
      }
    ]
  }
]
