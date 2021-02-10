import FORM_TYPES from '../formInput/FormInputTypes';
import { numberOnlyKeyDown } from '../../helpers/input';
import validators from '../formWalkthrough/FormValidators';

export const getSteps = (methods) => [
    {
        title: 'createPitch.details.restorationMethod.title',
        subtext: 'createPitch.details.restorationMethod.help',
        nextSubmitButton: 'common.next',
        cancelButton: 'common.cancel',
        fields: [
            {
                modelKey: 'restoration_method',
                label: 'createPitch.details.restorationMethods',
                type: FORM_TYPES.asyncSelect,
                resource: '/restoration_methods',
                asyncValue: 'method',
                asyncLabel: 'api.restoration_methods',
                translate: true,
                required: true,
                showLabel: true,
                filterData: (item, model) => {
                  return !methods.includes(item.method);
                }
            },
            {
                modelKey: "experience",
                type: FORM_TYPES.number,
                label: `createPitch.details.restorationMethod.experience`,
                showLabel: true,
                required: true,
                onKeyDown: numberOnlyKeyDown,
                shouldSplitError: true,
                shouldSetOnError: true,
                validationFunc: (field, value) => {
                  return validators.numberAtleast(field, value, 1);
                },
                min: "1"
            },
            {
                modelKey: "land_size",
                type: FORM_TYPES.number,
                label: `createPitch.details.restorationMethod.landSize`,
                showLabel: true,
                required: true,
                onKeyDown: numberOnlyKeyDown,
                min: "0",
                step: "0.01",
              },
              {
                modelKey: "price_per_hectare",
                type: FORM_TYPES.number,
                label: `createPitch.details.restorationMethod.pricePerHectare`,
                showLabel: true,
                required: true,
                onKeyDown: numberOnlyKeyDown,
                min: "0",
                step: "0.01",
              },
              {
                modelKey: "biomass_per_hectare",
                type: FORM_TYPES.number,
                label: `createPitch.details.restorationMethod.biomassPerHectare`,
                showLabel: true,
                step: "0.01",
                onKeyDown: numberOnlyKeyDown
              },
              {
                modelKey: "carbon_impact",
                type: FORM_TYPES.number,
                label: `createPitch.details.restorationMethod.carbonImpact`,
                showLabel: true,
                onKeyDown: numberOnlyKeyDown,
                step: "0.01",
              },
              {
                modelKey: "species_impacted",
                type: FORM_TYPES.multiText,
                label: `createPitch.details.restorationMethod.speciesImpacted`,
                showLabel: true,
                validationFunc: (field, value) => {
                  const unique = validators.uniqueArray(field, value);

                  if (unique.error) {
                    return unique;
                  }

                  const arrayStringAtLeast = validators.arrayStringAtLeast(field, value, 1);

                  return arrayStringAtLeast;
                }
              }
        ]
    }
];
