import React from 'react';
import PropTypes from 'prop-types';
import Select from 'react-select';
import DropdownIndicator from '../../components/navigation/DropdownIndicator';
import { useTranslation } from 'react-i18next';

const sortByChoices = (t) => [
  {
    key: 'created_at_asc',
    label: t('sort.created_at_asc')
  },
  {
    key: 'created_at_desc',
    label: t('sort.created_at_desc')
  },
  {
    key: 'compatibility_score_asc',
    label: t('sort.compatibility_score_asc')
  },
  {
    key: 'compatibility_score_desc',
    label: t('sort.compatibility_score_desc') 
  }
]

const SortByDropdown = props => {

  const { setSortAttribute, sortAttribute, 
      setSortDirection, sortDirection, 
      getPitches, getOffers, projectType, showCompatibility } = props;
  const { t } = useTranslation();

  const updateSearch = () => {
    if (projectType === 'funding') {
      getOffers();
    } else {
      getPitches();
    }
  }

  const onSortChange = (str) => {

    const attrib = str.substring(0, str.lastIndexOf("_"));
    const dir = str.substring(str.lastIndexOf("_") + 1, str.length);

    setSortAttribute(attrib);
    setSortDirection(dir);
    updateSearch();
  }

  const value = {
    key: sortAttribute,
    label: t(`sort.${sortAttribute}_${sortDirection}`)
  }

  return (
    <div className="u-flex u-flex--space-between u-flex--baseline" 
      style={{flex: 1, justifyContent: 'flex-end', alignItems: 'center'}}>
      <p className="
        c-sort-dropdown__label
        u-font-primary u-margin-none 
        u-font-grey-alt u-text-uppercase u-text-bold">{t('sort.sortBy')}</p>
        <Select
          components={{ DropdownIndicator }}
          options={showCompatibility ? sortByChoices(t) : 
            sortByChoices(t).filter(choice => !choice.key.startsWith("compat"))}
          onChange={data => onSortChange(data.key)}
          value={value}
          isSearchable={false}
          className="c-sort-dropdown"
          classNamePrefix='c-sort-dropdown'
        />
    </div>

  );
};

SortByDropdown.propTypes = {
  projectType: PropTypes.oneOf(['funding', 'pitch'])
}

export default SortByDropdown;
