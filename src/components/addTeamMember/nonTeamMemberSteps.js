import FORM_TYPES from '../../components/formInput/FormInputTypes';

export const steps = [
  {
    title: 'addTeamMember.details.title',
    subtext: 'addTeamMember.details.noAccountSubtext',
    nextSubmitButton: 'common.next',
    cancelButton: 'common.cancel',
    fields: [
      {
        type: FORM_TYPES.seperator,
        label: 'addTeamMember.details.addTeamMemberProfile',
        key: 'sep1'
      },
      {
        modelKey: 'avatar',
        label: 'addTeamMember.details.avatar',
        type: FORM_TYPES.file,
        accept: FORM_TYPES.fileTypes.image,
        required: true,
        showLabel: false,
        uploadMethod: () => {}
      },
      {
        modelKey: 'first_name',
        label: 'addTeamMember.details.firstName',
        type: FORM_TYPES.text,
        required: true,
        showLabel: true
      },
      {
        modelKey: 'last_name',
        label: 'addTeamMember.details.lastName',
        type: FORM_TYPES.text,
        required: true,
        showLabel: true
      },
      {
        modelKey: 'job_role',
        label: 'addTeamMember.details.jobRole',
        type: FORM_TYPES.text,
        required: true,
        showLabel: true
      },
      {
        modelKey: 'email_address',
        label: 'addTeamMember.details.email',
        type: FORM_TYPES.email,
        required: true,
        showLabel: true
      },
      {
        modelKey: 'phone_number',
        label: 'addTeamMember.details.phoneNumber',
        type: FORM_TYPES.tel,
        required: true,
        showLabel: true
      },
    ]
  },
];
