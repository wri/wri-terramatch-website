import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { initialAsyncStatePropType } from '../../../redux/asyncActionReducer';
import OrganisationComponent from '../../../components/organisation/OrganisationContainer';
import { Link, Redirect } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Button, Modal, Loader } from 'tsc-chameleon-component-library';
import FormInput from '../../../components/formInput/FormInput';
import VersionHistoryTable from '../../../components/versionHistoryTable/VersionHistoryTableContainer';
import { getLatestVersion } from '../../../helpers';
import ContactDetails from '../../../components/organisation/ContactDetails';

const Organisation = (props) => {
  const { getOrganisationVersions,
    getOrganisationVersion,
    organisationVersions,
    organisationVersion,
    documentsVersions,
    approveOrganisation,
    approveState,
    rejectOrganisation,
    rejectState,
    isVersionId
  } = props;

  const { t } = useTranslation();

  const [ organisation, setOrganisation ] = useState(null);
  const [ isApproveModal, setIsApproveModal ] = useState(false);
  const [ isRejectModal, setIsRejectModal ] = useState(false);
  const [ rejectionReason, setRejectionReason ] = useState(null);
  const [ rejectionReasonBody, setRejectionReasonBody ] = useState('');
  const [ rejectApproveSuccess, setSuccess ] = useState(false);
  const [ tasks, setTasks ] = useState({});

  useEffect(() => {
    // Make sure we are scolled to the top.
    window.scrollTo(0, 0);
  }, []);

  useEffect(() => {
    if (isVersionId && !organisationVersion.isFetching && !organisationVersion.data && !organisationVersion.error) {
      // Exact version to get
      getOrganisationVersion(props.match.params.id);
    } else if (!isVersionId && !organisationVersions.isFetching && !organisationVersions.data && !organisationVersions.error) {
      getOrganisationVersions(props.match.params.id);
    }
  }, [getOrganisationVersions, organisationVersions, isVersionId, props.match.params.id, organisationVersion, getOrganisationVersion]);

  useEffect(() => {
    if (organisationVersion.data && !organisationVersion.isFetching) {
      setOrganisation(organisationVersion.data);
    }

    if (organisationVersions.data && !organisationVersions.isFetching) {
      setOrganisation(getLatestVersion(organisationVersions));
    }
  }, [organisationVersions, organisationVersion, setOrganisation]);

  const closeModal = () => {
    setIsRejectModal(false);
    setIsApproveModal(false);
  };

  const onSubmit = () => {
    if (isRejectModal) {
      let rejectionTasks = {...tasks};

      rejectionTasks.rejection = {
        reason: rejectionReason,
        reasonBody: rejectionReasonBody
      };

      rejectOrganisation(rejectionTasks);
    } else {
      approveOrganisation(tasks);
    }
  };

  useEffect(() => {
    const isSuccsess = (approveState.lastSuccessTime > 0 && !approveState.isFetching && !approveState.errors) ||
                       (rejectState.lastSuccessTime > 0 && !rejectState.isFetching && !rejectState.errors)
    if (isSuccsess) {
      setSuccess(true);
    }
  }, [approveState, rejectState]);

  useEffect(() => {
    let tasks = {
      organisation: null,
      documents: []
    };

    if (organisation && organisation.status === 'pending') {
      tasks.organisation = organisation;
    }

    if (documentsVersions.data && !documentsVersions.isFetching) {
      documentsVersions.data.forEach((docVersion) => {
        if (docVersion.status === 'pending' || docVersion.status === 'rejected') {
          tasks.documents.push(docVersion);
        }
      });
    }
    setTasks(tasks);
  }, [organisation, documentsVersions]);

  if (rejectApproveSuccess) {
    return <Redirect to="/admin/organization" />;
  }

  const renderRejectModal = () => {
    return (
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
    )
  };

  return (
    <>
      <Link to={`/admin/organization`} className="c-button c-button--small u-link-button">{t('common.back')}</Link>

      {organisationVersions.data && organisationVersions.data.length > 0 &&
        <div className="u-margin-bottom-small">
          <h2 className="u-text-uppercase u-font-normal">{t('admin.versions.history')}</h2>
          <VersionHistoryTable versions={organisationVersions.data} className="u-width-100 u-margin-vertical-small"/>
        </div>
      }

      <h2 className="u-text-uppercase u-font-normal">{t('admin.organisations.preview')}</h2>
      <div className="u-overflow-hidden u-box-shadow u-margin-vertical-small u-border-radius-small u-background-white">
        <OrganisationComponent organisation={organisation} />
      </div>

      {organisation &&
        <>
        <h2 className="u-text-uppercase u-font-normal">{t('createOrganisation.details.address')}</h2>
        <ContactDetails organisation={organisation.data}
          className="u-padding-small u-box-shadow u-margin-vertical-small u-border-radius-small u-background-white"/>

        <div className="u-flex u-flex--justify-centered u-text-centered">
          {(organisation.status === 'pending' || (organisation.status !== 'pending' && !isVersionId)) &&
            <>
              <Button className="u-margin-tiny" variant="secondary" click={() => setIsRejectModal(true)} >{t('admin.reject')}</Button>
              <Button className="u-margin-tiny" click={() => setIsApproveModal(true)}>{t('admin.approve')}</Button>
            </>
          }
          {organisation.status !== 'pending' && isVersionId &&
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
            {isApproveModal ? t('admin.approveMessage', {name: organisation.data.name})
                            : t('admin.rejectMessage', {name: organisation.data.name})}
          </p>
          {isRejectModal && renderRejectModal()}
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

Organisation.propTypes = {
  getOrganisationVersions: PropTypes.func.isRequired,
  organisationVersions: initialAsyncStatePropType.isRequired,
  approveOrganisation: PropTypes.func.isRequired,
  approveState: initialAsyncStatePropType.isRequired
};

export default Organisation;
