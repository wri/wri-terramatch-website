import FORM_TYPES from '../../../components/formInput/FormInputTypes';
import { numberOnlyKeyDown } from '../../../helpers/input';
import validators from '../../../components/formWalkthrough/FormValidators';

export const getMethodMetricsSteps = (t, ...rest) => {
  const model = rest[0];
  const fields = model.restoration_methods.map((method) => {
    return [
      {
        type: FORM_TYPES.seperator,
        label: `api.restoration_methods.${method}`,
        key: `sep-${method}`
      },
      {
        restorationMethod: method,
        modelKey: `${method}-experience`,
        type: FORM_TYPES.number,
        label: `createPitch.details.restorationMethod.experience`,
        key: `experience-${method}`,
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
        restorationMethod: method,
        modelKey: `${method}-land_size`,
        type: FORM_TYPES.number,
        label: `createPitch.details.restorationMethod.landSize`,
        key: `land_size-${method}`,
        showLabel: true,
        required: true,
        onKeyDown: numberOnlyKeyDown,
        step: "0.01",
        min: "0"
      },
      {
        restorationMethod: method,
        modelKey: `${method}-price_per_hectare`,
        type: FORM_TYPES.number,
        label: `createPitch.details.restorationMethod.pricePerHectare`,
        key: `price_per_hectare-${method}`,
        showLabel: true,
        required: true,
        onKeyDown: numberOnlyKeyDown,
        step: "0.01",
        min: "0"
      },
      {
        restorationMethod: method,
        modelKey: `${method}-biomass_per_hectare`,
        type: FORM_TYPES.number,
        label: `createPitch.details.restorationMethod.biomassPerHectare`,
        key: `biomass_per_hectare-${method}`,
        showLabel: true,
        onKeyDown: numberOnlyKeyDown,
        step: "0.01",
        min: "0"
      },
      {
        restorationMethod: method,
        modelKey: `${method}-carbon_impact`,
        type: FORM_TYPES.number,
        label: `createPitch.details.restorationMethod.carbonImpact`,
        key: `carbon_impact-${method}`,
        showLabel: true,
        onKeyDown: numberOnlyKeyDown,
        step: "0.01",
        min: "0"
      },
      {
        restorationMethod: method,
        modelKey: `${method}-species_impacted`,
        help: 'createPitch.details.restorationMethod.speciesImpactedHelp',
        helpLink: 'https://www.iucnredlist.org/',
        type: FORM_TYPES.multiText,
        label: `createPitch.details.restorationMethod.speciesImpacted`,
        key: `species_impacted-${method}`,
        showLabel: true,
        shouldSplitError: true,
        shouldSetOnError: true,
        validationFunc: (field, value) => {
          const unique = validators.uniqueArray(field, value);

          if (unique.error) {
            return unique;
          }

          const arrayStringAtLeast = validators.arrayStringAtLeast(field, value, 1);

          return arrayStringAtLeast;
        }
      },
    ]
  });

  const merged = [].concat.apply([], fields);

  return  {
    title: 'createPitch.details.restorationMethod.title',
    subtext: 'createPitch.details.restorationMethod.help',
    nextSubmitButton: 'common.next',
    model: 'restoration_method_metrics',
    fields: merged
  };
};
