import FORM_TYPES from '../../formInput/FormInputTypes'
import { numberOnlyKeyDown } from '../../../helpers/input';

export default [
    {
        id: "experience",
        type: FORM_TYPES.number,
        label: `createPitch.details.restorationMethod.experience`,
        showLabel: true,
        required: true,
        onKeyDown: numberOnlyKeyDown,
        min: "0"
    },
    {
        id: "land_size",
        type: FORM_TYPES.number,
        label: `createPitch.details.restorationMethod.landSize`,
        showLabel: true,
        required: true,
        onKeyDown: numberOnlyKeyDown,
        min: "0"
      },
      {
        id: "price_per_hectare",
        type: FORM_TYPES.number,
        label: `createPitch.details.restorationMethod.pricePerHectare`,
        showLabel: true,
        required: true,
        onKeyDown: numberOnlyKeyDown,
        min: "0"
      },
      {
        id: "biomass_per_hectare",
        type: FORM_TYPES.number,
        label: `createPitch.details.restorationMethod.biomassPerHectare`,
        showLabel: true,
      },
      {
        id: "carbon_impact",
        type: FORM_TYPES.number,
        label: `createPitch.details.restorationMethod.carbonImpact`,
        showLabel: true,
        onKeyDown: numberOnlyKeyDown
      },
      {
        id: "species_impacted",
        type: FORM_TYPES.multiText,
        label: `createPitch.details.restorationMethod.speciesImpacted`,
        showLabel: true,
      }
]