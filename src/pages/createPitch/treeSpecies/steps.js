import FORM_TYPES from '../../../components/formInput/FormInputTypes';
import { numberOnlyKeyDown } from '../../../helpers/input';
import validators from '../../../components/formWalkthrough/FormValidators';

export const getTreeSteps = (t, ...rest) => {
  const model = rest[1].tree_species;
  const fields = [];
  for (let index = 0; index < model.listCount; index++) {
    fields.push([
      {
        type: FORM_TYPES.seperator,
        label: `createPitch.details.treeSpecies.specie`,
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
        modelKey: `${index}-name`,
        label: 'createPitch.details.treeSpecies.name',
        key: `${index}-name`,
        type: FORM_TYPES.text,
        required: true,
        showLabel: true,
        maxLength: 255
      },
      {
        modelKey: `${index}-count`,
        type: FORM_TYPES.number,
        label: `createPitch.details.treeSpecies.count`,
        key: `${index}-count`,
        showLabel: true,
        required: true,
        onKeyDown: numberOnlyKeyDown,
        min: "1"
      },
      {
        modelKey: `${index}-price_to_plant`,
        type: FORM_TYPES.number,
        label: `createPitch.details.treeSpecies.priceToPlant`,
        key: `${index}-price_to_plant`,
        showLabel: true,
        required: true,
        onKeyDown: numberOnlyKeyDown,
        step: "0.01",
        min: "0"
      },
      {
        modelKey: `${index}-price_to_maintain`,
        type: FORM_TYPES.number,
        label: `createPitch.details.treeSpecies.priceToMaintain`,
        key: `${index}-price_to_maintain`,
        showLabel: true,
        required: true,
        onKeyDown: numberOnlyKeyDown,
        step: "0.01",
        min: "0"
      },
      {
        modelKey: `${index}-site_prep`,
        type: FORM_TYPES.number,
        label: `createPitch.details.treeSpecies.sitePrep`,
        key: `${index}-site_prep`,
        showLabel: true,
        required: true,
        onKeyDown: numberOnlyKeyDown,
        step: "0.01",
        min: "0"
      },
      {
        modelKey: `${index}-saplings`,
        type: FORM_TYPES.number,
        label: `createPitch.details.treeSpecies.saplings`,
        key: `${index}-saplings`,
        showLabel: true,
        required: true,
        onKeyDown: numberOnlyKeyDown,
        step: "0.01",
        min: "0"
      },
      {
        modelKey: `${index}-total_price_per_tree`,
        type: FORM_TYPES.number,
        label: `createPitch.details.treeSpecies.totalPricePerTree`,
        key: `${index}-total_price_per_tree`,
        showLabel: true,
        required: false,
        disabled: true,
        onKeyDown: numberOnlyKeyDown,
        min: "0",
        step: "0.01",
        valueFunc: (model) => {
          let value = (parseFloat(model[`${index}-price_to_plant`], 10) || 0) +
                 (parseFloat(model[`${index}-price_to_maintain`], 10) || 0) +
                 (parseFloat(model[`${index}-site_prep`], 10) || 0) +
                 (parseFloat(model[`${index}-saplings`], 10) || 0);



          return value.toFixed(2);
        }
      },
      {
        modelKey: `${index}-survival_rate`,
        type: FORM_TYPES.number,
        label: `createPitch.details.treeSpecies.survivalRate`,
        key: `${index}-survival_rate`,
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
        modelKey: `${index}-produces`,
        label: 'createPitch.details.treeSpecies.produces',
        type: FORM_TYPES.checkboxGroup,
        data: [
            { value: `${index}-produces_food`, label: t('createPitch.details.treeSpecies.produces_food') },
            { value: `${index}-produces_firewood`, label: t('createPitch.details.treeSpecies.produces_firewood') },
            { value: `${index}-produces_timber`, label: t('createPitch.details.treeSpecies.produces_timber') },
        ],
        required: false,
        showLabel: false
      },
      {
        modelKey: `${index}-owner`,
        label: 'createPitch.details.treeSpecies.owner',
        key: `${index}-owner`,
        type: FORM_TYPES.text,
        translate: true,
        showLabel: true,
        requiredFunc: (model) => {
          const choices = model[`${index}-produces`];
          return choices && choices.length > 0;
        },
        maxLength: 255
      },
      {
        modelKey: `${index}-is_native`,
        label: 'createPitch.details.treeSpecies.isNative',
        type: FORM_TYPES.checkboxGroup,
        data: [
          { value: `${index}-is_native`, label: t('createPitch.details.treeSpecies.isNative') }
        ],
        required: false,
        showLabel: false
      },
      {
        modelKey: `${index}-season`,
        label: 'createPitch.details.treeSpecies.season',
        key: `${index}-season`,
        type: FORM_TYPES.text,
        required: true,
        showLabel: true,
        maxLength: 255
      }
    ]);
  }

  const merged = [].concat.apply([], fields);

  return  {
    title: 'createPitch.details.treeSpecies.title',
    subtext: 'createPitch.details.treeSpecies.help',
    nextSubmitButton: 'common.next',
    model: 'tree_species',
    fields: merged,
    addListLabel: 'createPitch.details.treeSpecies.add'
  };
};
