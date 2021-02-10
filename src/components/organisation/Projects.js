import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';
import ProjectPreviewList from '../projectPreviewList/ProjectPreviewList';
import { Link } from 'react-router-dom';
import { Modal, Button } from 'tsc-chameleon-component-library';
import { getVersionByState, canFetch, isAdmin } from '../../helpers';

const Projects = (props) => {
  const {
    projects,
    organisation,
    editMode,
    archivePitch,
    archivePitchState,
    clearArchivePitch,
    archiveOffer,
    archiveOfferState,
    clearArchiveOffer,
    fetchExtras,
    isMyOrganisation,
    isOffer,
    organisationVersions,
    getDrafts,
    getOfferDraftsState,
    getPitchDraftsState,
    deleteDraftState,
    deleteDraft,
    clearDeleteDraft,
    me
  } = props;
  const { t } = useTranslation();
  const [ projectToArchive, setProjectToArchive ] = useState(null);
  const [ draftToDelete, setDraftToDelete ] = useState(null);

  useEffect(() => {
    if (isMyOrganisation) {
      if (canFetch(getOfferDraftsState) && isOffer) {
        getDrafts('offer');
      }
      if (canFetch(getPitchDraftsState) && !isOffer) {
        getDrafts('pitch');
      }
    }
  }, [getDrafts, getOfferDraftsState, getPitchDraftsState, isMyOrganisation, isOffer]);

  useEffect(() => {
    if (archivePitchState.data && archivePitchState.lastSuccessTime > 0) {
      clearArchivePitch();
      fetchExtras();
      setProjectToArchive(null);
    }
  }, [archivePitchState, clearArchivePitch, fetchExtras]);

  useEffect(() => {
    if (archiveOfferState.data && archiveOfferState.lastSuccessTime > 0) {
      clearArchiveOffer();
      fetchExtras();
      setProjectToArchive(null);
    }
  }, [archiveOfferState, clearArchiveOffer, fetchExtras]);

  useEffect(() => {
    if (deleteDraftState.data && deleteDraftState.lastSuccessTime > 0) {
      clearDeleteDraft();
      setDraftToDelete(null);
      if (isOffer) {
        getDrafts('offer');
      } else {
        getDrafts('pitch');
      }
    }
  }, [deleteDraftState, clearDeleteDraft, isOffer, getDrafts]);

  const onArchive = (item, draftId) => {
    if (draftId !== null) {
      setDraftToDelete(draftId);
    } else {
      setProjectToArchive(item);
    }
  };

  const archiveButtonClick = () => {
    if (isOffer) {
      archiveOffer(projectToArchive.id);
    } else {
      archivePitch(projectToArchive.id);
    }
  };

  const deleteDraftButtonClick = () => {
    deleteDraft(draftToDelete);
  };

  const draftsState = isOffer ? getOfferDraftsState : getPitchDraftsState;

  return (
    <>
      <section className="c-section c-section--standard-width u-padding-top">
          <ProjectPreviewList
            isAdmin={isAdmin(me.data)}
            isMyOrganisation={isMyOrganisation}
            projects={projects.data ? projects.data : []}
            drafts={draftsState.data ? draftsState.data : []}
            canArchive={editMode || isMyOrganisation}
            onArchive={onArchive}
            isOffer={isOffer}
            fromUrl={isMyOrganisation ? 'profile' : null} />
      </section>

      {(projects.data && projects.data.length === 0) &&
        <section className="c-section c-section--thin-width u-padding-top-none u-text-center">
          <p>{isOffer ? t('organisation.noOffers') : t('organisation.noPitches')}</p>
        </section>
      }
      { isMyOrganisation && organisation && getVersionByState(organisationVersions, 'approved') &&
      <section className="c-section c-section-thin-width u-text-center">
        {isOffer ?
          <Link className="c-button c-button--outline u-padding-vertical-small u-margin-tiny" to={'/createOffer'}>{t('createOffer.addNewPitch')}</Link>
          :
          <Link className="c-button c-button--outline u-padding-vertical-small u-margin-tiny" to={'/createProject'}>{t('createPitch.addNewPitch')}</Link>
        }
      </section>
      }
      {projectToArchive &&
        <Modal show close={() => setProjectToArchive(null)}>
          <div className="u-text-center">
            <h2 className="u-margin-bottom-tiny u-margin-top-none u-font-medium u-text-uppercase">{t('createPitch.archivePitch')}</h2>
            <p>{t('createPitch.archivePitchHelp',
                {
                  name: projectToArchive.name
                })}
            </p>
            <Button
              className="u-margin-top-large"
              click={archiveButtonClick}
              disabled={archivePitchState.isFetching}>
              {archivePitchState.isFetching ? t('common.archiving') : t('common.archive')}
            </Button>
          </div>
        </Modal>
      }
      {draftToDelete !== null &&
        <Modal show close={() => setDraftToDelete(null)}>
          <div className="u-text-center">
            <h2 className="u-margin-bottom-tiny u-margin-top-none u-font-medium u-text-uppercase">{t('drafts.delete')}</h2>
            <p>{t('drafts.deleteHelp')}</p>
            <Button
              className="u-margin-top-large"
              click={deleteDraftButtonClick}
              disabled={deleteDraftState.isFetching}>
              {deleteDraftState.isFetching ? t('common.deleting') : t('common.delete')}
            </Button>
          </div>
        </Modal>
      }
    </>
  );
};

Projects.propTypes = {
  projects: PropTypes.object.isRequired,
  organisation: PropTypes.object.isRequired,
  editMode: PropTypes.bool
};

Projects.defaultProps = {
  editMode: false
};

export default Projects;
