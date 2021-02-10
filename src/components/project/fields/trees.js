import FORM_TYPES from "../../formInput/FormInputTypes";
import { numberOnlyKeyDown } from "../../../helpers/input";
import validators from "../../formWalkthrough/FormValidators";

export default [
  {
    id: 'name',
    label: "createPitch.details.treeSpecies.name",
    type: FORM_TYPES.text,
    required: true,
    showLabel: true
  },
  {
    id: 'count',
    type: FORM_TYPES.number,
    label: 'createPitch.details.treeSpecies.count',
    showLabel: true,
    required: true,
    onKeyDown: numberOnlyKeyDown,
    min: "1"
  },
  {
    id: 'price_to_plant',
    type: FORM_TYPES.number,
    label: 'createPitch.details.treeSpecies.priceToPlant',
    showLabel: true,
    required: true,
    onKeyDown: numberOnlyKeyDown,
    step: "0.01",
    min: "0"
  },
  {
    id: 'price_to_maintain',
    type: FORM_TYPES.number,
    label: 'createPitch.details.treeSpecies.priceToMaintain',
    showLabel: true,
    required: true,
    onKeyDown: numberOnlyKeyDown,
    step: "0.01",
    min: "0"
  },
  {
    id: 'site_prep',
    type: FORM_TYPES.number,
    label: 'createPitch.details.treeSpecies.sitePrep',
    showLabel: true,
    required: true,
    onKeyDown: numberOnlyKeyDown,
    step: "0.01",
    min: "0"
  },
  {
    id: 'saplings',
    type: FORM_TYPES.number,
    label: 'createPitch.details.treeSpecies.saplings',
    showLabel: true,
    required: true,
    onKeyDown: numberOnlyKeyDown,
    step: '0.01',
    min: '0'
  },
  {
    id: 'survival_rate',
    type: FORM_TYPES.number,
    label: 'createPitch.details.treeSpecies.survivalRate',
    showLabel: true,
    required: false,
    onKeyDown: numberOnlyKeyDown,
    min: "0",
    shouldSplitError: true,
    validationFunc: (field, value) => {
      return validators.betweenMinMax(field, value, 0, 100);
    }
  },
  {
    id: 'produces',
    label: "createPitch.details.treeSpecies.produces",
    type: FORM_TYPES.checkboxGroup,
    data: [
      {
        value: 'produces_food',
        label: "createPitch.details.treeSpecies.produces_food"
      },
      {
        value: 'produces_firewood',
        label: "createPitch.details.treeSpecies.produces_firewood"
      },
      {
        value: 'produces_timber',
        label: "createPitch.details.treeSpecies.produces_timber"
      }
    ],
    required: false,
    showLabel: false
  },
  {
    id: 'owner',
    label: "createPitch.details.treeSpecies.owner",
    key: 'owner',
    type: FORM_TYPES.asyncSelect,
    resource: "/tree_species_owners",
    asyncValue: "owner",
    asyncLabel: "api.tree_species_owners",
    translate: true,
    required: true,
    showLabel: true
  },
  {
    id: 'is_native',
    label: "createPitch.details.treeSpecies.isNative",
    type: FORM_TYPES.checkboxGroup,
    data: [
      {
        value: 'is_native',
        label: "createPitch.details.treeSpecies.isNative"
      }
    ],
    required: false,
    showLabel: false
  },
  {
    id: 'season',
    label: "createPitch.details.treeSpecies.season",
    key: 'season',
    type: FORM_TYPES.text,
    required: true,
    showLabel: true
  }
];
