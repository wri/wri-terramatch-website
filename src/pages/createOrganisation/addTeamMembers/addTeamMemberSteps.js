
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
        type: 'email',
        required: true,
        showLabel: true
      }
    ]
  },
];