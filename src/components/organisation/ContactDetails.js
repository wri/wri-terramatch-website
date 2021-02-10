import React from 'react'
import { useTranslation } from 'react-i18next';

const Detail = (props) => {
  const { item, header } = props;
  const { t } = useTranslation();

  return (
    <>
      <h4 className="u-text-bold u-margin-bottom-none">
        {header}
      </h4>
      {item ? <p className="u-margin-top-none">{item}</p>
            : <p className="u-text-italic u-margin-top-none u-text-grey">
                {t('common.missing')}
              </p>
      }
    </>
  );
};

const ContactDetails = (props) => {
  const { className, organisation } = props;
  const { t } = useTranslation();

  return organisation ? (
    <div className={className}>
      <Detail item={organisation.address_1} header={t('createOrganisation.details.address_1')} />
      <Detail item={organisation.address_2} header={t('createOrganisation.details.address_2')} />
      <Detail item={organisation.city} header={t('createOrganisation.details.city')} />
      <Detail item={organisation.state} header={t('createOrganisation.details.state')} />
      <Detail item={organisation.zip_code} header={t('createOrganisation.details.zipCode')} />
      <Detail item={t(`api.countries.${organisation.country}`)} header={t('createOrganisation.details.country')} />
      <Detail item={organisation.phone_number} header={t('createOrganisation.details.phoneNumber')} />
    </div>
  ) : null;
};

export default ContactDetails;
