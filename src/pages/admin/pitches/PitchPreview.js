import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Redirect, Link } from 'react-router-dom';
import { Button, Modal, Loader } from 'tsc-chameleon-component-library';
import FormInput from '../../../components/formInput/FormInput';
import PitchComponent from '../../../components/pitch/PitchContainer';
import VersionHistoryTable from '../../../components/versionHistoryTable/VersionHistoryTableContainer';
import { getLatestVersion } from '../../../helpers';

const Pitch = props => {
  const {
    getPitchVersions,
    getPitchVersion,
    pitchVersions,
    pitchVersion,
    clearPitch,
    approvePitch,
    approveState,
    rejectPitch,
    rejectState,
    isVersionId,
    carbonCertificationsInspect,
    metricsInspect,
    treeSpeciesInspect,
    documentsInspect,
    getExtras
  } = props;

  const [ pitch, setPitch ] = useState(null);
  const [ tasks, setTasks ] = useState({});
  const [ isApproveModal, setIsApproveModal ] = useState(false);
  const [ isRejectModal, setIsRejectModal ] = useState(false);
  const [ rejectionReason, setRejectionReason ] = useState('');
  const [ rejectionReasonBody, setRejectionReasonBody] = useState('');
  const [ rejectApproveSuccess, setSuccess ] = useState(false);

  const { t } = useTranslation();

  useEffect(() => {
    // Make sure we are scolled to the top.
    window.scrollTo(0, 0);
  }, []);

  useEffect(() => {
    if (isVersionId && !pitchVersion.isFetching && !pitchVersion.data && !pitchVersion.error) {
      // Exact version to get
      getPitchVersion(props.match.params.id);
    } else if (!isVersionId && !pitchVersions.isFetching && !pitchVersions.data && !pitchVersions.error) {
      getPitchVersions(props.match.params.id);
    }
  }, [getPitchVersions, pitchVersions, props.match.params.id, isVersionId, pitchVersion, getPitchVersion]);

  useEffect(() => {
    if (pitchVersion.data && !pitchVersion.isFetching) {
      setPitch(pitchVersion.data);
    }

    if (pitchVersions.data && !pitchVersions.isFetching) {
      setPitch(getLatestVersion(pitchVersions));
    }

  }, [pitchVersions, setPitch, pitchVersion]);

  const closeModal = () => {
    setIsRejectModal(false);
    setIsApproveModal(false);
  }

  const onSubmit = () => {
    if (isRejectModal) {
      let rejectionTasks = {...tasks};

      rejectionTasks.rejection = {
        reason: rejectionReason,
        reasonBody: rejectionReasonBody
      };

      rejectPitch(rejectionTasks);
    } else {
      approvePitch(tasks);
    }
  }

  useEffect(() => {
    const isSuccsess = (approveState.lastSuccessTime > 0 && !approveState.isFetching && !approveState.errors) ||
                       (rejectState.lastSuccessTime > 0 && !rejectState.isFetching && !rejectState.errors);
    if (isSuccsess) {
      setSuccess(true);
    }
  }, [approveState, rejectState]);

  const getTasks = (state) => {
    const tasks = []
    if (state.data && !state.isFetching) {
      state.data.forEach((item) => {
        if (item.status === 'pending' || item.status === 'rejected') {
          tasks.push(item);
        }
      });
    }
    return tasks;
  };

  useEffect(() => {
    if (pitch && pitch.data && pitch.data.id) {
      getExtras(pitch.data.id);
    }
  }, [getExtras, pitch]);

  useEffect(() => {
    let tasks = {
      pitch: null,
      treeSpecies: getTasks(treeSpeciesInspect),
      restorationMethods: getTasks(metricsInspect),
      carbonCerts: getTasks(carbonCertificationsInspect),
      documents: getTasks(documentsInspect)
    };

    if (pitch && pitch.status === 'pending') {
      tasks.pitch = pitch;
    }

    setTasks(tasks);
  }, [carbonCertificationsInspect, documentsInspect, metricsInspect, pitch, treeSpeciesInspect]);

  if (rejectApproveSuccess) {
    return <Redirect to="/admin/pitches" />
  }

  return (
    <>
      <Link onClick={clearPitch} to={`/admin/pitches`} className="c-button c-button--small u-link-button">{t('common.back')}</Link>

      {pitchVersions.data && pitchVersions.data.length > 0 &&
        <div className="u-margin-bottom-small">
          <h2 className="u-text-uppercase u-font-normal">{t('admin.versions.history')}</h2>
          <VersionHistoryTable versions={pitchVersions.data} className="u-width-100 u-margin-vertical-small"/>
        </div>
      }

      {pitch &&
        <>
          <h2 className="u-text-uppercase u-font-normal">{t('admin.pitches.preview')}</h2>
          <div className="u-overflow-hidden u-box-shadow u-margin-vertical-small u-border-radius-small">
            <PitchComponent pitch={pitch} />
          </div>

          <div className="u-flex u-flex--justify-centered u-text-centered">
            {(pitch.status === 'pending' || (pitch.status !== 'pending' && !isVersionId)) &&
              <>
                <Button className="u-margin-tiny" variant="secondary" click={() => setIsRejectModal(true)} >{t('admin.reject')}</Button>
                <Button className="u-margin-tiny" click={() => setIsApproveModal(true)}>{t('admin.approve')}</Button>
              </>
            }
            {pitch.status !== 'pending' && isVersionId &&
              <p>{t('admin.outOfDateVersion')}</p>
            }
          </div>
        </>
      }
      { (isApproveModal || isRejectModal) &&
        <Modal show close={closeModal}>
          <h2 className="u-margin-bottom-tiny u-margin-top-none u-font-medium u-text-normal">
            {isApproveModal ? t('admin.approve') : t('admin.reject')}
          </h2>
          <p>
            {isApproveModal ? t('admin.approveMessage', {name: pitch.data.name})
                            : t('admin.rejectMessage', {name: pitch.data.name})}
          </p>
          {isRejectModal &&
            <>
            <FormInput
              type="asyncSelect"
              resource="/rejected_reasons"
              label={t('admin.rejectReason')}
              id="async-select"
              asyncValue="reason"
              asyncLabel="api.rejected_reasons"
              showLabel
              translate
              className="u-margin-bottom-small"
              onChange={(e) => {
                setRejectionReason(e.value);
              }}
            />
            <FormInput
              className="u-margin-bottom-large"
              id="textarea-error-example"
              label={t('admin.rejectReasonBody')}
              type="textarea"
              errorText=""
              showLabel
              value={rejectionReasonBody}
              onChange={(e) => setRejectionReasonBody(e.currentTarget.value)}
            />
            </>
          }
          <div className="u-position-bottom u-position-right u-margin-small">
            <Button
              className="c-button--small u-margin-tiny"
              variant="secondary"
              click={closeModal}>
              {t('common.cancel')}
            </Button>
            <Button
              className="c-button--small u-margin-tiny"
              disabled={isRejectModal ? rejectionReasonBody.length < 8 || rejectionReason === null : false}
              click={onSubmit}>
              {t('common.continue')}
            </Button>
          </div>
          {(approveState.isFetching || rejectState.isFetching) && (
            <div className="u-overlay u-overlay--light u-flex u-flex--centered u-flex--justify-centered">
              <Loader />
            </div>
          )}
        </Modal>
      }
    </>
  );
};

export default Pitch;
