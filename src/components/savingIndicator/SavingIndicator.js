import React from 'react';
import PropTypes from 'prop-types';
import Spinner from './Spinner';
import { useTranslation } from 'react-i18next';
import ErrorImg from '../../assets/images/icons/error.svg';
import SuccessImg from '../../assets/images/icons/success-tick.svg';

const SavingIndicator = (props) => {
  const { isSaving, isError, isSaved, className } = props;
  const { t } = useTranslation();
  let text = null;
  let image = null;

  if (isSaving) {
    text = t('common.saving');
    image = (<Spinner className="c-saving-indicator__image" />)
  } else if (isError) {
    text = t('common.errorSaving');
    image = (
      <img src={ErrorImg} alt="" role="presentation" className="c-saving-indicator__image" />
    );
  } else if (isSaved) {
    text = t('common.latestSaved');
    image = (
      <img src={SuccessImg} alt="" role="presentation" className="c-saving-indicator__image" />
    );
  }

  return (
    <div className={`c-saving-indicator u-flex u-flex--centered ${className}`}>
      <span className="u-margin-right-tiny c-saving-indicator__image-wrapper">{image}</span>
      <p className="c-saving-indicator__text u-margin-none u-font-primary">{text}</p>
    </div>
  );
};

SavingIndicator.propTypes = {
  isSaving: PropTypes.bool,
  isError: PropTypes.bool,
  isSaved: PropTypes.bool
};

SavingIndicator.defaultProps = {
  isSaving: false,
  isError: false,
  isSaved: false
};

export default SavingIndicator;
