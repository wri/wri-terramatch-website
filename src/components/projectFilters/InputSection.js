import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Collapse } from 'react-collapse';
import { numberOnlyKeyDown } from '../../helpers';

const InputSection = props => {
    const { title, modelKey, valueKey, filters, onFilterChange} = props;
    const [ isOpen, setIsOpen ] = useState(true);
    const { t } = useTranslation();

    const inputValue = filters[modelKey] === undefined ? "" : filters[modelKey];

    const onInputChange = (value) => {
        if (value.length === 0) {
            delete filters[modelKey];
            onFilterChange(filters);
        } else {
            filters[modelKey] = value;
            onFilterChange(filters);
        }
    };

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
                <div className="u-margin-top-small u-padding-top-small
                    u-margin-bottom-small u-padding-bottom-small">
                    <label htmlFor={`${modelKey}-${valueKey}`} className={
                        'u-text-left u-text-uppercase u-text-bold u-text-black u-visually-hidden'
                    } tabIndex={"-1"}>
                        {t('createOffer.details.averagePricePerTree')}
                    </label>
                    <input
                        className="c-form__input c-facet__field u-margin-bottom-small"
                        id={`${modelKey}-${valueKey}`}
                        type="number"
                        value={inputValue}
                        onChange={(e) => {onInputChange(e.target.value)}}
                        showlabel="true"
                        onKeyDown={numberOnlyKeyDown}
                        min="0"
                    />
                </div>
            </Collapse>
            <div className="c-facet-separator u-margin-top-small" />
        </div>
    );

}

export default InputSection;
