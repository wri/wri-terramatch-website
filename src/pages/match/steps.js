import FORM_TYPES from '../../components/formInput/FormInputTypes';

export default (data, isFunding) => {
  if (isFunding) {
    return [
      {
        title: 'match.interest.chooseFunding',
        subtext: 'match.interest.chooseFundingHelp',
        nextSubmitButton: 'match.interest.applyFunding',
        fields: [
          {
            modelKey: 'offer_id',
            label: 'match.interest.selectFunding',
            type: FORM_TYPES.select,
            data,
            required: true,
            showLabel: true
          }
        ]
      }
    ];
  }

  return [
    {
      title: 'match.interest.choosePitch',
      subtext: 'match.interest.choosePitchHelp',
      nextSubmitButton: 'match.interest.applyPitch',
      fields: [
        {
          modelKey: 'pitch_id',
          label: 'match.interest.selectPitch',
          type: FORM_TYPES.select,
          data,
          required: true,
          showLabel: true
        }
      ]
    }
  ];
}
