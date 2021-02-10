import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Collapse } from 'react-collapse';
import FilterItems from './FilterItems';

const FilterSection = props => {
    const { modelKey, valueKey, onFilterChange, filters, title, options, isRadio } = props;
    const [ isOpen, setIsOpen ] = useState(true);
    const { t } = useTranslation();

    const classNames = isOpen ? 'c-facet-accordion__chevron u-rotate-270' :
        'c-facet-accordion__chevron';

    return (
        <div className="u-margin-bottom-small">
            <div className="u-flex u-flex-centered">
                <h3 className='u-text-bold u-text-spaced u-font-normal u-flex--grow'>
                    { t(title) }
                </h3>
                <button onClick={() => setIsOpen(!isOpen)} className={classNames} />
            </div>

            <Collapse isOpened={isOpen}>
                <div className='c-facet-list u-padding-small'>
                    {
                        options.length ?
                        <FilterItems
                          options={options}
                          valueKey={valueKey}
                          modelKey={modelKey}
                          filters={filters}
                          onFilterChange={onFilterChange}
                          isRadio={isRadio}
                        /> : null
                    }
                </div>
            </Collapse>
            <div className="c-facet-separator u-margin-top-small" />
        </div>
    );
};

export default FilterSection;
