export const getSteps = (name) => {
  return [
    {
      title: 'addTeamMember.details.title',
      subtext: 'addTeamMember.details.successAddSubtext',
      subtextVariables: { name },
      nextSubmitButton: 'common.next',
      fields: []
    },
  ];
}
