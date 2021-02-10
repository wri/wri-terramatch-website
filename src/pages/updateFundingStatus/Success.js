import React from 'react';
import ribbonImage from '../../assets/images/icons/ribbon.svg';
import { useTranslation } from 'react-i18next';

const UpdateSuccess = (props) => {
  const { isFunding } = props;
  const { t } = useTranslation();

  const congratsString = `projectStatus.congratulations.${isFunding ? 'offer' : 'pitch'}`;
  const congratsDetails = `projectStatus.congratulationsHelp.${isFunding ? 'offer' : 'pitch'}`;

  return (
    <div className="c-update-funding__success">
      <img src={ribbonImage} className="c-update-funding__success-image u-margin-bottom" role="presentation" alt=""/>
      <p className="u-text-bold u-font-primary u-font-medium u-text-uppercase">{t(congratsString)}</p>
      <p className="u-margin-bottom-large u-text-pre-wrap">{t(congratsDetails)}</p>
    </div>
  );
};

export default UpdateSuccess;
