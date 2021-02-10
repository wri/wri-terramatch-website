import FORM_TYPES from '../formInput/FormInputTypes';
import validators from '../formWalkthrough/FormValidators';

export default [
    {
        title: 'createPitch.details.carbonCerts.title',
        subtext: 'createPitch.details.carbonCerts.help',
        nextSubmitButton: 'common.next',
        cancelButton: 'common.cancel',
        fields: [
            {
                modelKey: 'type',
                label: 'createPitch.details.carbonCerts.type',
                key: 'type',
                type: FORM_TYPES.asyncSelect,
                resource: '/carbon_certification_types',
                asyncValue: 'type',
                asyncLabel: 'api.carbon_certification_types',
                translate: true,
                required: true,
                showLabel: true
            },
            {
                modelKey: 'other_value',
                label: 'createPitch.details.carbonCerts.other_value',
                placeholder: 'createPitch.details.carbonCerts.other_help',
                key: 'other_value',
                type: FORM_TYPES.textarea,
                showLabel: true,
                autocomplete: 'off',
                hiddenFunc: (model) => {
                    return model.type !== 'other';
                }
            },
            {
                modelKey: 'link',
                label: 'createPitch.details.carbonCerts.link',
                key: 'link',
                type: FORM_TYPES.text,
                required: false,
                showLabel: true,
                shouldSetOnError: true,
                validationFunc: (field, newValue, model) => {
                  if (model && model['type']) {
                    return validators.validUrl(field, newValue);
                  }
                  return {
                    hasError: false,
                    code: null
                  };
                }
            }
        ]
    }
];
