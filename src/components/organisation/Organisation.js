import React, { useEffect, useState, useCallback } from 'react';
import PropTypes from 'prop-types';
import { initialAsyncStatePropType } from '../../redux/asyncActionReducer';
import { useTranslation } from 'react-i18next';
import { Loader, Button, Modal } from 'tsc-chameleon-component-library';
import LoadingScreen from '../../components/loading/LoadingScreen';
import locationPin from '../../assets/images/icons/location-pin-white.svg';
import { getResponseErrors, getMappedVersionedArray, getHeaderGradient, yearsSinceOperation } from '../../helpers';
import OrganisationTabs from './OrganisationTabs';
import SocialMediaList from '../socialMediaList/SocialMediaList';
import moment from 'moment';

const Organisation = (props) => {
  const { organisation,
    teamMembersState,
    inspectTeamMembersState,
    pitchesState,
    inspectPitchesState,
    getTeamMembers,
    getInspectTeamMembers,
    getOrganisationPitches,
    getInspectOrganisationPitches,
    clearTeamMembers,
    clearState,
    documentsState,
    inspectDocumentsState,
    getDocumentsInspect,
    getOrganisationDocuments,
    meState,
    updateOrganisation,
    updateOrganisationState,
    clearUpdateOrganisation,
    sectionToJumpTo,
    getOrganisationOffers,
    getOrganisationOffersInspect,
    offersState,
    inspectOfferState,
    clearOrganisationVersions,
    clearGetOrganisationVersionsNavBar,
    getOfferDraftsState,
    getPitchDraftsState
  } = props;

  const [ isMyOrganisation, setIsMyOrganisation ] = useState(false);
  const [ isEditing, setIsEditing ] = useState(false);
  const [ organisationState, setOrganisation ] = useState(organisation);
  const [ errors, setErrors ] = useState({});
  const [ activeTab, setActiveTab ] = useState(sectionToJumpTo ? sectionToJumpTo : 'about');
  const [ organisationToSave, setOrganisationToSave ] = useState(null);
  const { t } = useTranslation();
  const [ isAdmin, setIsAdmin ] = useState(false);

  useEffect(() => {
    clearTeamMembers();
    clearState();
    setOrganisation(organisation);
  }, [clearState, clearTeamMembers, organisation]);

  useEffect(() => {
    if (organisationState && meState.data && !meState.isFetching) {
      setIsMyOrganisation(organisationState.data.id === meState.data.organisation_id);
      setIsAdmin(meState.data.role === 'admin');
    }
  }, [organisationState, meState, setIsMyOrganisation]);

  useEffect(() => {
    return () => {
      clearTeamMembers();
      clearState();
    };
  }, []); // eslint-disable-line react-hooks/exhaustive-deps
  // The empty dependency array allows this useEffect to run only once.
  // The return statement clears the team members state on removing this
  // component.

  const canFetch = useCallback((state) => {
    return organisationState && !state.isFetching && !state.data && !state.error;
  }, [organisationState]);

  const getOrganisationProjects = useCallback(() => {
    if (canFetch(pitchesState) && canFetch(offersState)) {
      getOrganisationOffers(organisationState.data.id);
      getOrganisationPitches(organisationState.data.id);
    }
  }, [canFetch, getOrganisationOffers, getOrganisationPitches, organisationState, pitchesState, offersState]);

  const getUsersList = useCallback(() => {
    if (canFetch(teamMembersState)) {
      getTeamMembers(organisationState.data.id);
    }
  }, [canFetch, getTeamMembers, organisationState, teamMembersState]);

  const getAdminUsersList = useCallback(() => {
    if (canFetch(inspectTeamMembersState)) {
      getInspectTeamMembers(organisationState.data.id);
    }
  }, [canFetch, getInspectTeamMembers, inspectTeamMembersState, organisationState]);


  const getAdminProjects = useCallback(() => {
    if (canFetch(inspectPitchesState) && canFetch(inspectOfferState)) {
      getOrganisationOffersInspect(organisationState.data.id);
      getInspectOrganisationPitches(organisationState.data.id);
    }
  }, [canFetch, inspectPitchesState, getOrganisationOffersInspect, organisationState, getInspectOrganisationPitches, inspectOfferState]);

  const getDocuments = useCallback(() => {
    if (canFetch(documentsState)) {
      getOrganisationDocuments(organisationState.data.id);
    }
  }, [canFetch, documentsState, getOrganisationDocuments, organisationState]);

  const getAdminDocuments = useCallback(() => {
    if (canFetch(inspectDocumentsState)) {
      getDocumentsInspect(organisationState.data.id);
    }
  }, [canFetch, getDocumentsInspect, inspectDocumentsState, organisationState]);

  const getExtras = useCallback(() => {
    if (isMyOrganisation || isAdmin) {
      // Call inspect api
      getAdminProjects();
      getAdminDocuments();
      getAdminUsersList();
    } else {
      // Call normal organisation api
      getOrganisationProjects();
      getDocuments();
      getUsersList();
    }
  }, [getAdminDocuments,
      getAdminProjects,
      getDocuments,
      getOrganisationProjects,
      getAdminUsersList,
      getUsersList,
      isMyOrganisation,
      isAdmin]);

  useEffect(() => {
    if (organisationState) {
      getExtras();
    }
  }, [getExtras, organisationState]);

  const organisationUpdate = (newOrg) => {
    setOrganisation({...newOrg});
  };

  const saveOrganisation = async () => {
    clearUpdateOrganisation();
    const patchData = {
      country: organisationState.data.country,
      address_1: organisationState.data.address_1,
      address_2: organisationState.data.address_2,
      type: organisationState.data.type,
      city: organisationState.data.city,
      state: organisationState.data.state,
      zip_code: organisationState.data.zip_code,
      phone_number: organisationState.data.phone_number,
      website: organisationState.data.website,
      facebook: organisationState.data.facebook,
      instagram: organisationState.data.instagram,
      twitter: organisationState.data.twitter,
      linkedin: organisationState.data.linkedin,
      description: organisationState.data.description,
      founded_at: moment(organisation.data.founded_at).format('YYYY-MM-DD')
    };

    if (organisation.data.newAvatar) {
      patchData.avatar = organisation.data.newAvatar;
    }

    if (organisation.data.newCover) {
      patchData.cover_photo = organisation.data.newCover;
    }
    // Only patch updateable fields
    await updateOrganisation(patchData, organisation.data.id);
  };

  useEffect(() => {
    if (updateOrganisationState.data && !updateOrganisationState.isFetching && !updateOrganisationState.error) {
      setIsEditing(false);
      setOrganisationToSave(null);
      clearState();
      clearOrganisationVersions();
      clearGetOrganisationVersionsNavBar();
    }
    if (updateOrganisationState.error) {
      setErrors(getResponseErrors(updateOrganisationState));
      setOrganisationToSave(null);
    } else {
      setErrors({});
    }
  }, [updateOrganisationState, clearState, clearOrganisationVersions, clearGetOrganisationVersionsNavBar]);

  const pitches = isMyOrganisation || isAdmin ? getMappedVersionedArray(inspectPitchesState) : pitchesState;
  const offers = isMyOrganisation || isAdmin ? inspectOfferState: offersState;
  const documents = isMyOrganisation || isAdmin ? getMappedVersionedArray(inspectDocumentsState) : documentsState;
  const teamMembers = isMyOrganisation || isAdmin ? inspectTeamMembersState : teamMembersState;
  const headerBackgroundImage = getHeaderGradient(organisation && organisation.data && organisation.data.cover_photo);

  const isFetching = organisationState &&
                     (organisationState.isFetching ||
                     inspectDocumentsState.isFetching ||
                     documentsState.isFetching ||
                     pitchesState.isFetching ||
                     inspectPitchesState.isFetching ||
                     teamMembersState.isFetching ||
                     getOfferDraftsState.isFetching,
                     getPitchDraftsState.isFetching);

  return organisationState ? (
    <div className="c-organisation">
      <section className="u-font-white c-organisation__header" style={{backgroundImage: headerBackgroundImage}}>
        <div className="c-section c-section--standard-width u-padding-top-huge">
          <div className="c-organisation__icon u-margin-top-none u-margin-bottom-small" role="presentation" style={{backgroundImage: `url(${organisationState.data.avatar})`}}></div>
          <h1 className="u-font-white u-margin-vertical-tiny u-text-ellipsis">{organisationState.data.name}</h1>
          <p className="u-font-primary u-font-normal u-margin-vertical-tiny u-text-ellipsis">
            <img alt="" src={locationPin} className="c-organisation__pin u-margin-right-small"/>
            {organisationState.data.city}, {t(`api.countries.${organisationState.data.country}`)}
          </p>
          <p className="u-font-primary u-margin-vertical-tiny u-text-ellipsis">{t(`organisation.categories.${organisationState.data.category}`)} | {t(`api.organisation_types.${organisationState.data.type.toLowerCase()}`)}</p>
          <p className="u-font-primary u-margin-vertical-tiny u-text-ellipsis">{t('organisation.yearsOfOperation', {count: yearsSinceOperation(organisationState.data)})}</p>
        </div>
        <SocialMediaList organisation={organisationState.data} className="c-organisation__social-container"/>
      </section>
      <section className="c-section c-organisation__tabs u-padding-none u-padding-bottom-large">
        {!isFetching ? (
          <>
          <div className="c-organisation__controls">
            {isMyOrganisation &&
              (
                !isEditing ? <Button
                              className="c-button--small"
                              click={() => {setIsEditing(true)}}
                              variant="secondary">
                               {t('common.edit')}
                             </Button>
                           :
                           <>
                            <Button
                              className="c-button--small u-margin-right-small"
                              click={() => {
                                window.location.reload();
                              }}
                              variant="secondary"
                            >
                              {t("common.cancel")}
                            </Button>
                            <Button
                              className="c-button--small"
                              click={() => setOrganisationToSave(organisationState.data)}
                              disabled={updateOrganisationState.isFetching}>
                               {updateOrganisationState.isFetching ? t('common.saving') : t('common.finish')}
                             </Button>
                            </>
              )
            }
          </div>
          <OrganisationTabs
            isEditing={isEditing}
            organisation={organisationState}
            organisationUpdate={organisationUpdate}
            pitches={pitches}
            offers={offers}
            errors={errors}
            meState={meState}
            isMyOrganisation={isMyOrganisation}
            isAdmin={isAdmin}
            teamMembers={teamMembers}
            documents={documents}
            fetchTeamMembers={() => getInspectTeamMembers(organisationState.data.id)}
            fetchExtras={() => {
              clearState();
              getExtras();
            }}
            activeTab={activeTab}
            setActiveTab={setActiveTab} />
          </>
        ) :
        <div className="u-flex u-flex--justify-centered u-padding-small">
          <Loader className="u-margin-auto"/>
        </div>}
      </section>
      <Modal show={organisationToSave} close={() => setOrganisationToSave(null)}>
        <div className="u-text-center">
          <h2 className="u-margin-bottom-tiny u-margin-top-none u-font-medium u-text-uppercase">{t('createOrganisation.editOrgConfirm')}</h2>
          <p className="u-margin-bottom-large u-margin-top-large">{t('createOrganisation.editOrgHelp')}</p>
          <Button
            variant="secondary"
            className="u-margin-small"
            click={() => setOrganisationToSave(null)}
            disabled={updateOrganisationState.isFetching}>
            {t('common.cancel')}
          </Button>
          <Button
            className="u-margin-small"
            click={saveOrganisation}
            disabled={updateOrganisationState.isFetching}>
            {updateOrganisationState.isFetching ? t('common.saving') : t('common.save')}
          </Button>
        </div>
      </Modal>
    </div>
  ) : (<LoadingScreen />);
}

Organisation.propTypes = {
  organisation: PropTypes.object,
  teamMembersState: initialAsyncStatePropType.isRequired,
  inspectPitchesState: initialAsyncStatePropType.isRequired,
  meState: initialAsyncStatePropType.isRequired,
  getTeamMembers: PropTypes.func.isRequired,
  getOrganisationPitches: PropTypes.func.isRequired,
  getInspectOrganisationPitches: PropTypes.func.isRequired,
  isAdmin: PropTypes.bool
};

Organisation.defaultProps = {
  organisation: null,
  isAdmin: false
};

export default Organisation;
