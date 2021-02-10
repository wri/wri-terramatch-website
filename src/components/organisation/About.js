import React, {useEffect, useState} from 'react';
import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';
import FormInput from '../formInput/FormInput';
import FormTypes from '../formInput/FormInputTypes';
import { getRawResponseErrors } from '../../helpers';

const About = (props) => {
  const { organisation,
          editMode,
          errors,
          onChange,
          uploadAvatarState,
          uploadOrganisationAvatar,
          uploadCoverState,
          uploadOrganisationCover } = props;

  const [ avatarFileName, setAvatarFileName ] = useState('');
  const [ coverFileName, setCoverFileName ] = useState('');
  const [ combinedErrors, setCombinedErrors ] = useState({});
  const { t } = useTranslation();

  useEffect(() => {
    let newErrors = {...errors};

    const uploadAvatarErrors = getRawResponseErrors(uploadAvatarState);
    const uploadCoverErrors = getRawResponseErrors(uploadCoverState);

    newErrors.avatar = errors.avatar ? [...errors.avatar, ...uploadAvatarErrors]
                                     : uploadAvatarErrors;

    newErrors.cover = errors.cover ? [...errors.cover, ...uploadCoverErrors]
                                   : uploadCoverErrors;

    setCombinedErrors(newErrors);
  }, [errors, uploadAvatarState, uploadCoverState]);

  useEffect(() => {
    if (Object.keys(combinedErrors).length > 0) {
      const element = document.querySelector('ul[role="alert"]');
      if (element) {
        element.scrollIntoView();
      }
    }
  }, [combinedErrors]);

  useEffect(() => {
    if (uploadAvatarState.data) {
      organisation.data.newAvatar = uploadAvatarState.data.id;
    }
  }, [uploadAvatarState.data]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    if (uploadCoverState.data) {
      organisation.data.newCover = uploadCoverState.data.id;
    }
  }, [uploadCoverState.data]); // eslint-disable-line react-hooks/exhaustive-deps

  const descriptionChange = (e) => {
    organisation.data.description = e.currentTarget.value;
    onChange(organisation);
  };

  const valueChange = (e, field) => {
    switch (field) {
      case 'country':
      case 'type':
        organisation.data[field] = e.value;
      break;
      case 'avatar':
      case 'cover':
        const file = e.target.files[0];

        if (file && field === 'avatar') {
          uploadOrganisationAvatar({file});
          setAvatarFileName(file.name);
        } else if (file && field === 'cover') {
          uploadOrganisationCover({file});
          setCoverFileName(file.name);
        }
      break;
      case 'founded_at':
        organisation.data[field] = e;
      break;
      default:
        organisation.data[field] = e.currentTarget.value;
    }
    onChange(organisation);
  };

  useEffect(() => {
    if (Object.keys(errors).length > 0) {
      const element = document.querySelector('ul[role="alert"]');
      if (element) {
        element.scrollIntoView();
      }
    }
  }, [errors])

  return (
    <section className="c-section c-section--thin-width">
      <h2>{t('organisation.aboutOrganisation')}</h2>
      {!editMode ? <p>{organisation.data.description}</p>
                : (
        <>
        <FormInput className="u-margin-bottom-small"
                    id="description"
                    label={t('createOrganisation.description.title')}
                    type={FormTypes.textarea}
                    value={organisation.data.description}
                    onChange={descriptionChange}
                    errors={combinedErrors['description']} />
        <FormInput className="u-margin-bottom-small"
                    id="founded_at"
                    showLabel
                    label={t('createOrganisation.details.foundedAt')}
                    type={FormTypes.date}
                    value={new Date(organisation.data.founded_at)}
                    onChange={(e) => valueChange(e, 'founded_at')}
                    errors={combinedErrors['founded_at']}
                    maxDate={new Date()} />
        <FormInput className="u-margin-bottom-small"
                    id="type"
                    showLabel
                    label={t('createOrganisation.details.organisationType')}
                    type={FormTypes.asyncSelect}
                    value={organisation.data.type}
                    onChange={(e) => valueChange(e, 'type')}
                    errors={combinedErrors['type']}
                    resource="/organisation_types"
                    asyncValue="type"
                    asyncLabel="api.organisation_types"
                    translate />

        <h2>{t('createOrganisation.details.address')}</h2>
        <FormInput className="u-margin-bottom-small"
                    id="address_1"
                    showLabel
                    label={t('createOrganisation.details.address_1')}
                    type={FormTypes.text}
                    value={organisation.data.address_1}
                    onChange={(e) => valueChange(e, 'address_1')}
                    errors={combinedErrors['address_1']} />
        <FormInput className="u-margin-bottom-small"
                    id="address_2"
                    showLabel
                    label={t('createOrganisation.details.address_2')}
                    type={FormTypes.text}
                    value={organisation.data.address_2}
                    onChange={(e) => valueChange(e, 'address_2')}
                    errors={combinedErrors['address_2']} />
        <FormInput className="u-margin-bottom-small"
                    id="city"
                    showLabel
                    label={t('createOrganisation.details.city')}
                    type={FormTypes.text}
                    value={organisation.data.city}
                    onChange={(e) => valueChange(e, 'city')}
                    errors={combinedErrors['city']} />
        <FormInput className="u-margin-bottom-small"
                    id="state"
                    showLabel
                    label={t('createOrganisation.details.state')}
                    type={FormTypes.text}
                    value={organisation.data.state}
                    onChange={(e) => valueChange(e, 'state')}
                    errors={combinedErrors['state']} />
        <FormInput className="u-margin-bottom-small"
                    id="zip_code"
                    showLabel
                    label={t('createOrganisation.details.zipCode')}
                    type={FormTypes.text}
                    value={organisation.data.zip_code}
                    onChange={(e) => valueChange(e, 'zip_code')}
                    errors={combinedErrors['zip_code']} />
        <FormInput className="u-margin-bottom-small"
                    id="country"
                    showLabel
                    label={t('createOrganisation.details.country')}
                    type={FormTypes.asyncSelect}
                    value={organisation.data.country}
                    onChange={(e) => valueChange(e, 'country')}
                    errors={combinedErrors['country']}
                    resource="/countries"
                    asyncValue="code"
                    asyncLabel="api.countries"
                    translate />
        <FormInput className="u-margin-bottom-small"
                    id="phone_number"
                    showLabel
                    label={t('createOrganisation.details.phoneNumber')}
                    type={FormTypes.text}
                    value={organisation.data.phone_number}
                    onChange={(e) => valueChange(e, 'phone_number')}
                    errors={combinedErrors['phone_number']} />
        <FormInput className="u-margin-bottom-small"
                    id="facebook"
                    showLabel
                    label={t('createOrganisation.details.facebook')}
                    type={FormTypes.text}
                    value={organisation.data.facebook}
                    onChange={(e) => valueChange(e, 'facebook')}
                    errors={combinedErrors['facebook']} />
        <FormInput className="u-margin-bottom-small"
                    id="instagram"
                    showLabel
                    label={t('createOrganisation.details.instagram')}
                    type={FormTypes.text}
                    value={organisation.data.instagram}
                    onChange={(e) => valueChange(e, 'instagram')}
                    errors={combinedErrors['instagram']} />
        <FormInput className="u-margin-bottom-small"
                    id="twitter"
                    showLabel
                    label={t('createOrganisation.details.twitter')}
                    type={FormTypes.text}
                    value={organisation.data.twitter}
                    onChange={(e) => valueChange(e, 'twitter')}
                    errors={combinedErrors['twitter']} />
        <FormInput className="u-margin-bottom-small"
                    id="linkedin"
                    showLabel
                    label={t('createOrganisation.details.linkedin')}
                    type={FormTypes.text}
                    value={organisation.data.linkedin}
                    onChange={(e) => valueChange(e, 'linkedin')}
                    errors={combinedErrors['linkedin']} />
        <FormInput className="u-margin-bottom-small"
                    id="website"
                    showLabel
                    label={t('createOrganisation.details.website')}
                    type={FormTypes.text}
                    value={organisation.data.website}
                    onChange={(e) => valueChange(e, 'website')}
                    errors={combinedErrors['website']} />
                  <h2>{t('organisation.media')}</h2>
        <FormInput className="u-margin-bottom-small"
                    id="avatar"
                    showLabel
                    label={t('createOrganisation.logoCover.avatar')}
                    type={FormTypes.file}
                    accept={FormTypes.fileTypes.image}
                    uploadState={uploadAvatarState}
                    onChange={(e) => valueChange(e, 'avatar')}
                    errors={combinedErrors['avatar']}
                    fileName={avatarFileName}
                    busy={uploadAvatarState.isFetching}
                    success={!!uploadAvatarState.data}
                    disabled={uploadAvatarState.isFetching} />
        <FormInput className="u-margin-bottom-small"
                    id="cover"
                    showLabel
                    label={t('createOrganisation.logoCover.cover')}
                    type={FormTypes.file}
                    accept={FormTypes.fileTypes.image}
                    uploadState={uploadCoverState}
                    onChange={(e) => valueChange(e, 'cover')}
                    errors={combinedErrors['cover']}
                    fileName={coverFileName}
                    busy={uploadCoverState.isFetching}
                    success={!!uploadCoverState.data}
                    disabled={uploadCoverState.isFetching} />
        </>)

      }
    </section>
  );
};

About.propTypes = {
  organisation: PropTypes.object.isRequired,
  editMode: PropTypes.bool,
  errors: PropTypes.object
};

About.defaultProps = {
  editMode: false,
  errors: {}
};

export default About;
