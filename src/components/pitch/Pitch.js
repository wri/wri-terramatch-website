import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import PropTypes from "prop-types";
import { Button, Modal } from "tsc-chameleon-component-library";
import { canFetch, canCreate, didSend, getResponseErrors, getLatestVersion, getHeaderGradient, isProjectArchived } from '../../helpers';
import LoadingScreen from "../../components/loading/LoadingScreen";
import locationPin from "../../assets/images/icons/location-pin-white.svg";
import ProfilePreviewCard from "../../components/profilePreviewCard/ProfilePreviewCard";
import PitchTabs from "./PitchTabs";
import { Link } from 'react-router-dom';

const Pitch = (props) => {
    const {
        pitch,
        getOrganisation,
        organisationState,
        myOrganisationState,
        updatePitch,
        updatePitchState,
        updateMetrics,
        updateMetricsState,
        updateTreeSpecies,
        updateTreeSpeciesState,
        updateCarbonCertificates,
        updateCarbonCertificatesState,
        clearGetOrganisation,
        clearUpdateState,
        clearPitchVersions,
        carbonCertsEditState,
        treeSpeciesEditState,
        metricsEditState,
        me,
        compareProjectId
    } = props;

    const [ showConfirmModal, setShowConfirmModal ] = useState(false);
    const [ isMyOrganisation, setIsMyOrganisation ] = useState(false);
    const [ isAdmin, setIsAdmin ] = useState(false);
    // errors specifically for the project
    const [ errors, setErrors ] = useState({});
    const [ pitchState, setPitch ] = useState(null);
    const [ isEditing, setIsEditing ] = useState(false);
    const [ finishOnSave, setFinishOnSave ] = useState(false);
    const [ activeTab, setActiveTab ] = useState("about");

    const { t } = useTranslation();
    const [ hasClearedOrganisation, setHasClearedOrganisation ] = useState(false);
    if (!hasClearedOrganisation) {
        clearGetOrganisation();
    }

    useEffect(() => {
        if (organisationState.data && !organisationState.isFetching && me.data && !me.isFetching && hasClearedOrganisation) {
          setIsMyOrganisation(organisationState.data.id === me.data.organisation_id);
          setIsAdmin(me.data.role === 'admin');
        }

        if (!organisationState.data) {
          setHasClearedOrganisation(true);
        }
      }, [organisationState, me, setIsMyOrganisation, hasClearedOrganisation]);

    useEffect(() => {
        if (didSend(updatePitchState) &&
            didSend(updateMetricsState) &&
            didSend(updateCarbonCertificatesState) &&
            didSend(updateTreeSpeciesState)) {
              if (finishOnSave) {
                setIsEditing(false);
                setFinishOnSave(false);
              }
          clearPitchVersions();
        }
    }, [finishOnSave, clearPitchVersions, updateCarbonCertificatesState, updateMetricsState, updatePitchState, updateTreeSpeciesState]);


    useEffect(() => {
      if (updatePitchState.error) {
        const responseErrors = getResponseErrors(updatePitchState);
        setErrors(responseErrors);
      }
    }, [updatePitchState])

    useEffect(() => {
        if (pitch && pitch.data) {
            setPitch(pitch.data);

            if (canFetch(organisationState)) {
                getOrganisation(pitch.data.organisation_id);
            }
        }
    }, [getOrganisation, organisationState, pitch]);


    useEffect(() => {
      const canUpdateChildren = !updatePitchState.isFetching &&
      updatePitchState.data &&
      !updatePitchState.error &&
      canCreate(updateCarbonCertificatesState) &&
      canCreate(updateTreeSpeciesState);

      if (canUpdateChildren) {
        updateCarbonCertificates(carbonCertsEditState);
        updateTreeSpecies(treeSpeciesEditState);
        updateMetrics(metricsEditState);
      }
    }, [carbonCertsEditState, metricsEditState, treeSpeciesEditState, updateCarbonCertificates, updateCarbonCertificatesState, updateMetrics, updatePitchState, updateTreeSpecies, updateTreeSpeciesState])

    const saveAll = () => {
        setErrors({});
        setFinishOnSave(true);
        clearUpdateState();
        updatePitch(pitchState);
    }

    const headerBackgroundImage = getHeaderGradient(pitch && pitch.data && pitch.data.cover_photo);

    if (!pitchState || organisationState.isFetching) {
        return <LoadingScreen />;
    }

    const canRegisterInterest = !isMyOrganisation && !isAdmin &&
                                myOrganisationState.data &&
                                getLatestVersion(myOrganisationState).data.category !== 'developer';

    const canUpdateFundingStatus = isMyOrganisation && !isProjectArchived(pitch.data);

    return (
        <div className="c-project">
          <Modal show={showConfirmModal} close={() => setShowConfirmModal(false)}>
            <div className="u-text-center">
                <h2 className="u-margin-bottom-tiny u-margin-top-none u-font-medium u-text-uppercase">{t('createPitch.details.editPitchConfirm')}</h2>
                <p className="u-margin-bottom-large u-margin-top-large">{t('createPitch.details.editPitchHelp')}</p>
                <Button
                  variant="secondary"
                  className="u-margin-small"
                  click={() => setShowConfirmModal(false)}>
                  {t('common.cancel')}
                </Button>
                <Button
                  className="u-margin-small"
                  click={() => {
                    setShowConfirmModal(false);
                    saveAll();
                  }}>
                  {t('common.continue')}
                </Button>
            </div>
          </Modal>
        <section
          className="u-font-white c-project__header u-flex u-flex--break-md"
          style={{ backgroundImage: headerBackgroundImage }}
        >
          <div className="c-section c-section--standard-width u-padding-top-huge">
            <div
              className="c-project__icon u-margin-top-none u-margin-bottom-small"
              role="presentation"
              style={{ backgroundImage: `url(${pitch.data.avatar})` }}
            ></div>
            <h1 className="u-font-white u-margin-vertical-tiny">
                {pitchState.name}
            </h1>

          <p className="u-font-primary u-margin-vertical-tiny">
            <img
              alt=""
              src={locationPin}
              className="c-project__pin u-margin-right-small"
            />
            {t(`api.countries.${pitch.data.land_country}`)},{" "}
            {t(`api.continents.${pitch.data.land_continent}`)}
          </p>
          {pitch.data.funding_amount &&
            <>
            <h2 className="u-font-white u-margin-vertical-tiny">
              ${pitch.data.funding_amount.toLocaleString()}
            </h2>

            <p className="u-font-primary u-margin-vertical-tiny">
              {t("project.funding.amount")}
            </p>
            </>
          }
          <p className="u-font-primary u-font-white u-margin-vertical-tiny u-text-bold u-text-uppercase u-text-spaced-small u-font-normal">
            {t('common.status')}: {t(`api.visibilities.pitch.${pitch.data.visibility}`)}
          </p>
          {canRegisterInterest &&
            <Link className="c-button c-button--is-link u-text-center c-button--alternative" to={`/registerInterest/pitch/${pitch.data.id}`}>
              {t('match.interest.applyFunding')}
            </Link>
          }
          {/* passing an object to "to" allows us to specify props which appear on location.<propkey> in the linked component */}
          {canUpdateFundingStatus &&
            <Link className="c-button c-button--is-link u-text-center c-button--alternative" to={
              {
                pathname:`/profile/projects/updateStatus/${pitch.data.id}`,
                visibility: pitch.data.visibility
              }}>
              {t('project.updateStatus')}
            </Link>
          }
        </div>
        <div className="c-section c-section--standard-width u-padding-top-huge u-padding-bottom-huge">
          {(organisationState && organisationState.data) && <ProfilePreviewCard item={organisationState.data} />}
        </div>
      </section>
      <section className="c-section c-project__tabs u-padding-none">
        <div className="c-organisation__controls">
          {(isMyOrganisation && pitch.data.visibility !== "archived") &&
            (!isEditing ? (
              <Button
                className="c-button--small"
                click={() => {
                  setIsEditing(true);
                }}
                variant="secondary"
              >
                {t("common.edit")}
              </Button>
            ) : (
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
                  click={() => setShowConfirmModal(true)}
                  disabled={updatePitchState.isFetching}
                >
                  {updatePitchState.isFetching
                    ? t("common.saving")
                    : t("common.finish")}
                </Button>
              </>
            ))}
        </div>
        <PitchTabs
            pitchStatus={pitch.status}
            pitchState={pitchState}
            setPitch={setPitch}
            organisationState={organisationState.data}
            errors={errors}
            setErrors={setErrors}
            activeTab={activeTab}
            setActiveTab={setActiveTab}
            isEditing={isEditing}
            me={me}
            compareProjectId={compareProjectId}
        />
        </section>
        </div>
    );
};


Pitch.propTypes = {
    pitch: PropTypes.object,
    isAdmin: PropTypes.bool
};

Pitch.defaultProps = {
    pitch: null
};

export default Pitch;
