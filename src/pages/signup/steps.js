import FORM_TYPES from '../../components/formInput/FormInputTypes';

export default [
  {
    title: 'signup.title',
    subtext: 'signup.subtext',
    nextSubmitButton: 'signup.title',
    cancelButton: 'common.cancel',
    fields: [
      {
        modelKey: 'first_name',
        label: 'signup.firstName',
        type: FORM_TYPES.text,
        showLabel: true,
        required: true
      },
      {
        modelKey: 'last_name',
        label: 'signup.lastName',
        type: FORM_TYPES.text,
        showLabel: true,
        required: true
      },
      {
        modelKey: 'email_address',
        label: 'signup.emailAddress',
        type: FORM_TYPES.email,
        showLabel: true,
        required: true
      },
      {
        modelKey: 'phone_number',
        label: 'signup.phoneNumber',
        type: FORM_TYPES.tel,
        showLabel: true,
        required: true
      },
      {
        modelKey: 'job_role',
        label: 'signup.jobRole',
        type: FORM_TYPES.text,
        showLabel: true,
        required: true
      },
      {
        modelKey: 'password',
        label: 'signup.password',
        type: FORM_TYPES.newPassword,
        showLabel: true,
        required: true
      },
      {
        type: FORM_TYPES.textDescription,
        text: 'signup.termsDescription',
        key: 'text1'
      },
      {
        modelKey: 'agree_terms',
        type: FORM_TYPES.checkbox,
        showLabel: true,
        label: 'signup.agreeTerms',
        isHtmlLabel: true,
        required: true,
        labelOptions: {
          terms: '<a href="https://wriorg.s3.amazonaws.com/s3fs-public/terra-match-terms-and-conditions.pdf" target="_blank" rel="noopener noreferrer">Terms of Service</a>',
          privacy: '<a href="https://www.wri.org/about/privacy-policy" target="_blank" rel="noopener noreferrer">Privacy Policy</a>',
        },
        className: "u-margin-bottom-none"
      },
      {
        modelKey: 'agree_consent',
        type: FORM_TYPES.checkbox,
        label: 'signup.agreeConsent',
        showLabel: true,
        required: true
      }
    ]
  }
];
