import FORM_TYPES from '../../components/formInput/FormInputTypes';

export const steps = [
  {
    title: 'addTeamMember.details.title',
    subtext: 'addTeamMember.details.needsAccountSubtext',
    nextSubmitButton: 'common.next',
    cancelButton: 'common.cancel',
    fields: [
      {
        modelKey: 'email_address',
        label: 'addTeamMember.details.email',
        type: FORM_TYPES.email,
        required: true,
        showLabel: true
      }
    ]
  },
];
