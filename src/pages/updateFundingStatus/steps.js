import FORM_TYPES from '../../components/formInput/FormInputTypes';

export default (isFunding, defaultValue) => {
  return [
    {
      title: 'projectStatus.title',
      subtext: 'projectStatus.help',
      nextSubmitButton: 'projectStatus.submit',
      cancelButton: 'common.cancel',
      fields: [
        {
          modelKey: 'status',
          label: 'projectStatus.title',
          type: FORM_TYPES.radioGroup,
          asyncValue: 'visibility',
          asyncLabel: isFunding ? 'api.visibilities.offer' : 'api.visibilities.pitch',
          translate: true,
          resource: '/visibilities',
          required: true,
          showLabel: false,
          initialValue: defaultValue
        }
      ]
    }
  ];
}
