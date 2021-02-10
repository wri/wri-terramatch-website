import React, { useEffect, useState, useCallback } from "react";
import { useTranslation } from "react-i18next";
import PropTypes from "prop-types";
import { Loader, Button, Modal } from "tsc-chameleon-component-library";
import { getResponseErrors } from '../../helpers/errors';
import { canFetch, canCreate, getMappedVersionedArray } from '../../helpers';
import LoadingScreen from "../../components/loading/LoadingScreen";
import locationPin from "../../assets/images/icons/location-pin-white.svg";
import ProfilePreviewCard from "../../components/profilePreviewCard/ProfilePreviewCard";
import ProjectTabs from "./ProjectTabs";
import { Link } from 'react-router-dom';

const Project = props => {
  const {
    project,
    teamMembers,
    getTeamMembers,
    clearState,
    getOrganisation,
    organisation,
    carbonCertifications,
    carbonCertificationsInspect,
    getCarbonCertifications,
    getCarbonCertificationsInspect,
    getMetrics,
    getMetricsInspect,
    metrics,
    metricsInspect,
    getTreeSpecies,
    getTreeSpeciesInspect,
    treeSpecies,
    treeSpeciesInspect,
    userOffers,
    getUserOffers,
    me,
    getDocuments,
    getDocumentsInspect,
    documents,
    documentsInspect,
    updateProject,
    updateProjectState,
    updateMetrics,
    updateMetricsState,
    updateTreeSpecies,
    updateTreeSpeciesState,
    updateCarbonCertificates,
    updateCarbonCertificatesState,
    clearUpdateState,
    clearGetOrganisation
  } = props;

  const initialErrorState = {
    project:  {},
    carbon:   {},
    metric:   {},
    tree:     {}
  };

  const [ isMyOrganisation, setIsMyOrganisation ] = useState(false);
  const [ isAdmin, setIsAdmin ] = useState(false);
  const [ hasClearedOrganisation, setHasClearedOrganisation ] = useState(false);
  const [ projectState, setProject ] = useState(null);
  const [ carbonCertsState, setCarbonCerts ] = useState([])
  const [ metricsState, setMetrics ] = useState([]);
  const [ treesState, setTrees ] = useState([]);
  const [ documentsState, setDocuments ] = useState([]);
  const [ isEditing, setIsEditing ] = useState(false);
  const [ errors, setErrors ] = useState(initialErrorState);
  const [ activeTab, setActiveTab ] = useState("about");
  const [ showConfirmModal, setShowConfirmModal ] = useState(false);

  const { t } = useTranslation();

  if (!hasClearedOrganisation) {
    clearGetOrganisation();
  }

  useEffect(() => {
    if (organisation.data && !organisation.isFetching && me.data && !me.isFetching && hasClearedOrganisation) {
      setIsMyOrganisation(organisation.data.id === me.data.organisation_id);
      setIsAdmin(me.data.role === 'admin');
    }

    if (!organisation.data) {
      setHasClearedOrganisation(true);
    }
  }, [organisation, me, setIsMyOrganisation, hasClearedOrganisation]);

  const getErrorsForChild = useCallback((childState, childKey) => {

    if (!childState || !childState.error) {
      return;
    }

    const id = childState.error.response.req.url.split("/").pop();

    if (!errors[childKey][id]) {
      const responseErrs = getResponseErrors(childState);
      const newErrs = {...errors};
      newErrs[childKey][id] = responseErrs;
      setErrors(newErrs);
    }
  }, [errors])

  const didSend = state => (state.data && !state.isFetching && !state.error);

  // error handling
  useEffect(() => {
    if (didSend(updateProjectState) &&
      didSend(updateMetricsState) &&
      didSend(updateCarbonCertificatesState) &&
      didSend(updateTreeSpeciesState)
    ) {
      setIsEditing(false);
    }

    if (updateProjectState.error && !Object.keys(errors['project']).length) {
      const responseErrs = getResponseErrors(updateProjectState);
      const newErrs = {...errors};
      newErrs['project'] = responseErrs;
      setErrors(newErrs);
    }

    getErrorsForChild(updateCarbonCertificatesState, 'carbon');
    getErrorsForChild(updateMetricsState, 'metric');
    getErrorsForChild(updateTreeSpeciesState, 'tree');

  }, [carbonCertsState, errors, getErrorsForChild, metrics, metricsState, treesState,
      updateCarbonCertificatesState, updateMetricsState, updateProjectState, updateTreeSpeciesState])

  useEffect(() => {
    return () => {
      clearState();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    const canUpdateChildren = !updateProjectState.isFetching &&
    updateProjectState.data &&
    !updateProjectState.error &&
    canCreate(updateMetricsState) &&
    canCreate(updateTreeSpeciesState) &&
    canCreate(updateCarbonCertificatesState);

    if (canUpdateChildren) {
      updateMetrics(metricsState);
      updateTreeSpecies(treesState);
      updateCarbonCertificates(carbonCertsState);
    }
  }, [carbonCertsState, metricsState, treesState, updateCarbonCertificates, updateCarbonCertificatesState, updateMetrics, updateMetricsState, updateProjectState.data, updateProjectState.error, updateProjectState.isFetching, updateTreeSpecies, updateTreeSpeciesState])

  useEffect(() => {
    if (project) {
      setProject(project.data);
    }
    if (isMyOrganisation || me.data.role === 'admin') {
      if (metricsInspect) {
        setMetrics(getMappedVersionedArray(metricsInspect).data);
      }
      if (treeSpeciesInspect) {
        setTrees(getMappedVersionedArray(treeSpeciesInspect).data);
      }
      if (carbonCertificationsInspect) {
        setCarbonCerts(getMappedVersionedArray(carbonCertificationsInspect).data);
      }
      if (documentsInspect) {
        setDocuments(getMappedVersionedArray(documentsInspect).data);
      }
    } else {
      if (carbonCertifications) {
        setCarbonCerts(carbonCertifications.data);
      }
      if (metrics) {
        setMetrics(metrics.data);
      }
      if (treeSpecies) {
        setTrees(treeSpecies.data);
      }
      if (documents) {
        setDocuments(documents.data);
      }
    }
  }, [carbonCertifications, documents, metrics, project, treeSpecies, isMyOrganisation, me, metricsInspect, treeSpeciesInspect, carbonCertificationsInspect, documentsInspect]
  );

  useEffect(() => {
    if (project && project.data) {
      if (canFetch(teamMembers)) {
        getTeamMembers(project.data.id);
      }
      if (canFetch(organisation)) {
        getOrganisation(project.data.organisation_id);
      }
      if (canFetch(userOffers) && me.organisation_id) {
        getUserOffers(me.data.organisation_id);
      }

      // All these are versioned. If admin or owner, call different endpoint
      if (isMyOrganisation || me.data.role === 'admin') {
        if (canFetch(treeSpeciesInspect)) {
          getTreeSpeciesInspect(project.data.id);
        }
        if (canFetch(metricsInspect)) {
          getMetricsInspect(project.data.id);
        }
        if (canFetch(carbonCertificationsInspect)) {
          getCarbonCertificationsInspect(project.data.id);
        }
        if (canFetch(documentsInspect)) {
          getDocumentsInspect(project.data.id);
        }
      } else {
        if (canFetch(carbonCertifications)) {
          getCarbonCertifications(project.data.id);
        }
        if (canFetch(metrics)) {
          getMetrics(project.data.id);
        }
        if (canFetch(treeSpecies)) {
          getTreeSpecies(project.data.id);
        }
        if (canFetch(documents)) {
          getDocuments(project.data.id);
        }
      }
    }
  }, [isMyOrganisation, carbonCertifications, documents, getCarbonCertifications, getDocuments, getMetrics, getMetricsInspect, getOrganisation, getTeamMembers, getTreeSpecies, getUserOffers, getTreeSpeciesInspect, treeSpeciesInspect, me, metrics, metricsInspect, organisation, project, teamMembers, treeSpecies, userOffers, carbonCertificationsInspect, getCarbonCertificationsInspect, documentsInspect, getDocumentsInspect]);

  const saveAll = () => {
    setErrors(initialErrorState);
    clearUpdateState();
    updateProject(projectState);
  };

  let headerBackgroundImage =
    "linear-gradient(to left, rgba(0, 0, 0, 0.31), rgba(0, 0, 0, 0.66))";

  if (project) {
    headerBackgroundImage += `, url(${project.data.cover_photo})`;
  }

  const isFetching = () => {
    if (isMyOrganisation || me.data.role === 'admin') {
      return (
        metricsInspect.isFetching ||
        organisation.isFetching ||
        carbonCertificationsInspect.isFetching ||
        treeSpeciesInspect.isFetching ||
        documentsInspect.isFetching
      );
    }

    return (
      metrics.isFetching ||
      organisation.isFetching ||
      carbonCertifications.isFetching ||
      treeSpecies.isFetching ||
      documents.isFetching
    );
  }

  const renderNameInput = () => {
    let nameWidth  = projectState.name.length + 'em';
    let spacerSty = { maxWidth: nameWidth };

    return (
        <input
          className="c-project__edit-name"
          style={spacerSty}
          id="project-name"
          type="text"
          value={projectState.name}
          onChange={(e) => {
            projectState.name = e.currentTarget.value;
            setProject({...projectState});
          }}
          errors={errors}
        />
    );
  }

  const renderFundingInput = () => {
    return (
      <input
        className="c-project__edit-name"
        id="project-funding-amt"
        type="number"
        value={projectState.funding_amount}
        onChange={(e) => {
          projectState.funding_amount = e.currentTarget.value;
          setProject({...projectState});
        }}
        errors={errors}
      />
    );
  }

  return projectState ? (
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
              variant="danger"
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
            style={{ backgroundImage: `url(${project.data.avatar})` }}
          ></div>
          {!isEditing ?
            <h1 className="u-font-white u-margin-vertical-tiny">
             {projectState.name}
            </h1> :
            renderNameInput()
          }

          <p className="u-font-primary u-margin-vertical-tiny">
            <img
              alt=""
              src={locationPin}
              className="c-project__pin u-margin-right-small"
            />
            {t(`api.countries.${project.data.land_country}`)},{" "}
            {t(`api.continents.${project.data.land_continent}`)}
          </p>
          {!isEditing ?
            <h2 className="u-font-white u-margin-vertical-tiny">
              ${project.data.funding_amount}
            </h2> :
            renderFundingInput()
          }
          <p className="u-font-primary u-margin-vertical-tiny">
            {t("project.funding.amount")}
          </p>
          {!isMyOrganisation && !isAdmin &&
            <Link className="c-button c-button--is-link u-text-center" to={`/registerInterest/pitch/${project.data.id}`}>
            {t('match.interest.applyFunding')}
            </Link>
          }
        </div>
        <div className="c-section c-section--standard-width u-padding-top-large u-margin-bottom-large">
          {(organisation && organisation.data) && <ProfilePreviewCard item={organisation.data} />}
        </div>
      </section>
      <section className="c-section c-project__tabs u-padding-none">
        <div className="c-organisation__controls">
          {isMyOrganisation && !project.data.completed_at &&
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
                  disabled={updateProject.isFetching}
                >
                  {updateProject.isFetching
                    ? t("common.saving")
                    : t("common.finish")}
                </Button>
              </>
            ))}
        </div>
        {!isFetching() ? (
          <ProjectTabs
            projectStatus={project.status}
            projectState={projectState}
            setProject={setProject}
            documentsState={documentsState}
            setDocuments={setDocuments}
            metricsState={metricsState}
            setMetrics={setMetrics}
            carbonCertsState={carbonCertsState}
            setCarbonCerts={setCarbonCerts}
            treeSpeciesState={treesState}
            setTreeSpecies={setTrees}
            organisationState={organisation.data}
            teamMembersState={teamMembers}
            errors={errors}
            setErrors={setErrors}
            activeTab={activeTab}
            setActiveTab={setActiveTab}
            isEditing={isEditing}
            me={me}
          />
        ) :
          <div className="u-flex u-flex--justify-centered u-padding-small">
            <Loader className="u-margin-auto"/>
          </div>
        }

      </section>
    </div>
  ) : (
    <LoadingScreen />
  );
};

Project.propTypes = {
  project: PropTypes.object,
  isAdmin: PropTypes.bool
}

Project.defaultProps = {
  project: null,
  isAdmin: false
}

export default Project;
