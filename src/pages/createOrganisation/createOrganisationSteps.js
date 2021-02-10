import FORM_TYPES from '../../components/formInput/FormInputTypes';
import { uploadOrganisationAvatar, uploadOrganisationCover } from '../../redux/modules/organisation';
import validators from '../../components/formWalkthrough/FormValidators';

export const steps = [
  {
    title: 'welcome.title',
    subtext: 'welcome.subtext',
    nextSubmitButton: 'welcome.button',
    fields: []
  },
  {
    title: 'createOrganisation.details.title',
    subtext: 'createOrganisation.details.subtext',
    nextSubmitButton: 'common.next',
    fields: [
      {
        modelKey: 'category',
        label: 'createOrganisation.details.accountType',
        type: FORM_TYPES.select,
        data: [
          { value: 'funder', label: 'organisation.categories.funder'},
          { value: 'developer', label: 'organisation.categories.developer'},
          { value: 'both', label: 'organisation.categories.both'}
        ],
        required: true,
        showLabel: true,
        autocomplete: "off"
      },
      {
        modelKey: 'type',
        label: 'createOrganisation.details.organisationType',
        type: FORM_TYPES.asyncSelect,
        resource: '/organisation_types',
        asyncValue: 'type',
        asyncLabel: 'api.organisation_types',
        required: true,
        showLabel: true,
        autocomplete: "off",
        translate: true
      },
      {
        modelKey: 'name',
        label: 'createOrganisation.details.name',
        type: FORM_TYPES.text,
        required: true,
        showLabel: true,
        autocomplete: "off"
      },
      {
        modelKey: 'address_1',
        label: 'createOrganisation.details.address_1',
        type: FORM_TYPES.text,
        required: true,
        showLabel: true
      },
      {
        modelKey: 'address_2',
        label: 'createOrganisation.details.address_2',
        type: FORM_TYPES.text,
        required: false,
        showLabel: true
      },
      {
        modelKey: 'city',
        label: 'createOrganisation.details.city',
        type: FORM_TYPES.text,
        required: true,
        showLabel: true
      },
      {
        modelKey: 'state',
        label: 'createOrganisation.details.state',
        type: FORM_TYPES.text,
        required: true,
        showLabel: true
      },
      {
        modelKey: 'zip_code',
        label: 'createOrganisation.details.zipCode',
        type: FORM_TYPES.text,
        required: false,
        showLabel: true
      },
      {
        modelKey: 'country',
        label: 'createOrganisation.details.country',
        type: FORM_TYPES.asyncSelect,
        resource: '/countries',
        asyncValue: 'code',
        asyncLabel: 'api.countries',
        required: true,
        showLabel: true,
        autocomplete: "off",
        translate: true,
        sortAlphabetical: true
      },
      {
        modelKey: 'phone_number',
        label: 'createOrganisation.details.phoneNumber',
        type: FORM_TYPES.text,
        required: true,
        showLabel: true
      },
      {
        modelKey: 'founded_at',
        label: 'createOrganisation.details.foundedAt',
        type: FORM_TYPES.date,
        required: true,
        showLabel: true,
        maxDate: new Date()
      },
      {
        modelKey: 'website',
        label: 'createOrganisation.details.website',
        type: FORM_TYPES.text,
        required: true,
        showLabel: true,
        shouldSetOnError: true,
        validationFunc: validators.validUrl
      },
      {
        modelKey: 'facebook',
        label: 'createOrganisation.details.facebook',
        type: FORM_TYPES.text,
        required: false,
        showLabel: true,
        shouldSetOnError: true,
        validationFunc: validators.validUrl
      },
      {
        modelKey: 'twitter',
        label: 'createOrganisation.details.twitter',
        type: FORM_TYPES.text,
        required: false,
        showLabel: true,
        shouldSetOnError: true,
        validationFunc: validators.validUrl
      },
      {
        modelKey: 'instagram',
        label: 'createOrganisation.details.instagram',
        type: FORM_TYPES.text,
        required: false,
        showLabel: true,
        shouldSetOnError: true,
        validationFunc: validators.validUrl
      },
      {
        modelKey: 'linkedin',
        label: 'createOrganisation.details.linkedin',
        type: FORM_TYPES.text,
        required: false,
        showLabel: true,
        shouldSetOnError: true,
        validationFunc: validators.validUrl
      }
    ]
  },
  {
    title: 'createOrganisation.description.title',
    subtext: 'createOrganisation.description.subtext',
    nextSubmitButton: 'common.next',
    fields: [
      {
        modelKey: 'description',
        label: 'createOrganisation.description.description',
        type: FORM_TYPES.textarea,
        required: true,
        showLabel: true
      }
    ]
  },
  {
    title: 'createOrganisation.logoCover.title',
    subtext: 'createOrganisation.logoCover.subtext',
    nextSubmitButton: 'common.next',
    fields: [
      {
        modelKey: 'avatar',
        label: 'createOrganisation.logoCover.avatar',
        type: FORM_TYPES.file,
        accept: FORM_TYPES.fileTypes.image,
        uploadMethod: uploadOrganisationAvatar,
        required: true,
        showLabel: true
      },
      {
        modelKey: 'cover_photo',
        label: 'createOrganisation.logoCover.cover',
        type: FORM_TYPES.file,
        accept: FORM_TYPES.fileTypes.image,
        uploadMethod: uploadOrganisationCover,
        required: true,
        showLabel: true
      }
    ]
  },
];
