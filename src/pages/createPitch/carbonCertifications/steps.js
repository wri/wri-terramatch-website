import FORM_TYPES from '../../../components/formInput/FormInputTypes';
import validators from '../../../components/formWalkthrough/FormValidators';

export const getCarbonSteps = (t, ...rest) => {
  const model = rest[1].carbon_certifications;
  const fields = [];
  for (let index = 0; index < model.listCount; index++) {
    fields.push([
      {
        type: FORM_TYPES.seperator,
        label: `createPitch.details.carbonCerts.certificate`,
        labelOptions: {number: index + 1},
        key: `sep-${index}`
      },
      {
        type: FORM_TYPES.button,
        onClick: (e, props) => props.removeFromList(index),
        key: `remove-${index}`,
        label: `common.remove`,
        className: 'c-button--small c-button--outline'
      },
      {
        modelKey: `${index}-type`,
        label: 'createPitch.details.carbonCerts.type',
        key: `${index}-owner`,
        type: FORM_TYPES.asyncSelect,
        resource: '/carbon_certification_types',
        asyncValue: 'type',
        asyncLabel: 'api.carbon_certification_types',
        translate: true,
        required: false,
        showLabel: true,
        isClearable: true
      },
      {
        modelKey: `${index}-other_value`,
        label: 'createPitch.details.carbonCerts.other_value',
        placeholder: 'createPitch.details.carbonCerts.other_help',
        key: `${index}-other_value`,
        type: FORM_TYPES.textarea,
        showLabel: true,
        autocomplete: 'off',
        hiddenFunc: (model) => {
          return model[`${index}-type`] !== 'other';
        }
      },
      {
        modelKey: `${index}-link`,
        label: 'createPitch.details.carbonCerts.link',
        key: `${index}-link`,
        type: FORM_TYPES.text,
        required: false,
        showLabel: true,
        shouldSetOnError: true,
        shouldSplitError: true,
        validationFunc: (field, newValue, model, childModels) => {
          if ((model && model[`${index}-type`]) ||
              (childModels && childModels.carbon_certifications && childModels.carbon_certifications[`${index}-type`])) {
                if (!newValue) {
                  return {
                    error: true,
                    code: 'INVALID'
                  };
                }
                return validators.validUrl(field, newValue);
          }

          return {
            hasError: false,
            code: null
          };
        }
      }
    ]);
  }

  const merged = [].concat.apply([], fields);

  return  {
    title: 'createPitch.details.carbonCerts.title',
    subtext: 'createPitch.details.carbonCerts.help',
    nextSubmitButton: 'common.next',
    model: 'carbon_certifications',
    fields: merged,
    addListLabel: 'createPitch.details.carbonCerts.add'
  };
};
