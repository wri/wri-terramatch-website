import React from 'react';
import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';
import moment from 'moment';

const DocumentListItem = (props) => {
  const { option, onRemove, type, editable } = props;
  const { i18n } = useTranslation();
  const localeMoment = moment(option.lastModifiedDate).locale(i18n.language);

  return (
    <div className="c-item-card">
      <div className="c-item-card__image-container">
        <div role="presentation" className={`c-icon c-icon--${type} c-item-card__image`}></div>
      </div>
      <div className="c-item-card__profile-content u-text-left">
        {editable ?
          <p className="u-text-bold u-font-primary u-font-normal u-text-ellipsis u-margin-bottom-none">
            {option.name}
          </p>
        :
          <a href={option.document}
              target="_blank"
              rel="noopener noreferrer"
              className="c-document__link u-text-bold u-font-primary u-font-normal u-text-ellipsis u-margin-bottom-none u-link">
           {option.name}
          </a>
        }

        {option.lastModifiedDate && <p className="u-margin-top-none u-font-primary">{localeMoment.format("MMM Do YYYY")}</p>}
      </div>
      {editable && <div className="c-item-card__button-container">
        <button onClick={onRemove}
        aria-label="Remove">
          <div role="presentation" className="c-icon c-icon--trash c-item-card__delete"></div>
        </button>
      </div>}
    </div>
  );
};

DocumentListItem.propTypes = {
  option: PropTypes.object.isRequired,
  onRemove: PropTypes.func,
  type: PropTypes.string,
  editable: PropTypes.bool
};

DocumentListItem.defaultProps = {
  onRemove: () => {},
  type: 'document',
  editable: false
};

export default DocumentListItem;
