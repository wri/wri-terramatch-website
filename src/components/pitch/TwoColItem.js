import React from 'react';
import { useTranslation } from "react-i18next";

const TwoColItem = (props) => {
    const { title, link, value, extra, capitalize } = props;
    const { t } = useTranslation();

    return (
        <div className="c-stats__two_col__item">
            <p className={`u-font-primary u-text-bold ${capitalize ? 'u-text-capitalize' : ''} u-font-grey-alt`}>{title}</p>
            { link ?
                <a href={link} className="u-font-primary u-text-bold" target="_blank" rel="noopener noreferrer">{value}</a>
                :
                <p className="u-font-primary u-text-bold u-text-capitalize">
                  {typeof value === "boolean" && value && t('common.yes')}
                  {typeof value === "boolean" && !value && t('common.no')}
                  {typeof value !== "boolean" && value}
                </p>
            }
            <p className="u-font-primary u-font-small">{extra}</p>
        </div>
    )
};

TwoColItem.defaultProps = {
  capitalize: true
};

export default TwoColItem;
