import React from 'react';
import { useTranslation } from 'react-i18next';
import { getFilterTranslation } from '../../helpers/filters';

const FilterItem = props => {
    const { item, valueKey, filters, onFilterChange, modelKey, isRadio } = props;
    const { t } = useTranslation();
    const attributeArray = filters[modelKey];
    const id = item[valueKey];
    const checked = !!(attributeArray && attributeArray.includes(id));

    const onChange = () => {
        const newFilters = {...filters};
        if (checked && !isRadio) {
            // remove from the array
            newFilters[modelKey] = newFilters[modelKey].filter(item => item !== id);
        } else if (checked && isRadio) {
            newFilters[modelKey] = [];
        } else if (attributeArray && !isRadio) {
            // it does not exist in the array, add it
            newFilters[modelKey].push(id);
        } else {
            // no entries for this attribute
            // create the node on state tree
            newFilters[modelKey] = [id];
        }

        onFilterChange(newFilters);
    };

    const label = getFilterTranslation(modelKey, id, t);

    return (
        <>
            <input
              className='c-facet__input u-visually-hidden'
              id={`${modelKey}-${id}`}
              name={item.name}
              checked={checked}
              type='checkbox'
              onChange={onChange}
            />
                <label
                htmlFor={`${modelKey}-${id}`}
                className='c-facet__label u-d-inline u-text-capitalize u-text-bold'
                >
                  {label}
            </label>
        </>
    );
};


const FilterItems = (props) => {
  const { options, valueKey, modelKey, filters, onFilterChange, isRadio } = props;

  return options.map(option => {
    return (
      <FilterItem
          key={`${modelKey}-${option.name}`}
          item={option}
          valueKey={valueKey}
          modelKey={modelKey}
          filters={filters}
          onFilterChange={onFilterChange}
          isRadio={isRadio}
      />
    )
  });
};

export default FilterItems;
