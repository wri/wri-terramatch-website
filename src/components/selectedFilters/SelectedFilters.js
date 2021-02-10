import React from 'react';
import { useTranslation } from 'react-i18next';
import cross from '../../assets/images/icons/cross-icon.svg';
import { getFilterTranslation } from '../../helpers/filters';

const SelectedFilters = props => {
  const { filters, setFilters, projectType } = props;
  const { t } = useTranslation();

  const attributes = Object.keys(filters);
  let filterList = [];

  const removeFilter = filter => e => {

    if (!Array.isArray(filters[filter.attribute])) {
      delete filters[filter.attribute];
      return setFilters(filters);
    }

    const newFilters = filters[filter.attribute].filter(item => item !== filter.filter);
    filters[filter.attribute] = newFilters;
    setFilters(filters);
  }

  // flatten filter tree
  attributes.forEach(attribute => {
    // in some cases (price_per_tree) the filter value could be null
    // we don't want to display anything if this is the case.
    if (filters[attribute] === null) {
      return;
    }

    // for attribs which aren't arrays, just show the value for that.
    if (!Array.isArray(filters[attribute])) {
      let attrName = t(`api.attributes.${attribute}`);

      if (attribute === 'price_per_tree') {
        attrName = projectType === 'offer' ? t(`filters.minimumPricePerTree`)
                                           : t(`filters.maximumPricePerTree`);
      }

      const label = `${attrName}: ${filters[attribute]}`;

      const filterObject = {
        attribute,
        filter: filters[attribute],
        label
      }

      filterList = [...filterList, filterObject];
      return filterList;
    }

    filters[attribute].forEach(filter => {
      const label = getFilterTranslation(attribute, filter, t);

      const filterObject = {
        attribute,
        filter,
        label
      }
      filterList = [...filterList, filterObject];
    });
  });

  const filterElements = filterList.map(filter => (
    <li className='u-d-inline' key={`selected-${filter.label}`}>
      <button type="button" className="c-selected-filter u-text-center u-text-capitalize" onClick={removeFilter(filter)}>
        <p>{filter.label}</p>
        <img src={cross} alt="remove filter" />
      </button>
    </li>
  ));

  return (
    <>
      {(filterList && filterList.length > 0) && (
        <h3 className='u-font-small u-text-bold'>{t("projects.currentlyFiltering")}</h3>
      )}
      <ul className='c-filter-elements-list u-list-unstyled'>
        {filterElements}
      </ul>
    </>
  );

}

export default SelectedFilters;
