import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';
import { initialAsyncStatePropType } from '../../redux/asyncActionReducer';
import OrganisationComponent from '../../components/organisation/OrganisationContainer';
import qs from 'query-string';
import { getLatestVersion, canFetch } from '../../helpers';

const Organisation = (props) => {
  const { meState,
    getOrganisationVersions,
    getOrganisation,
    organisationVersions,
    getOrganisationState,
    showNotificationBar,
    closeNotificationBar,
    clearState
  } = props;

  const { t } = useTranslation();
  const organisationId = props.match.params.id;

  const [ sectionToJumpTo ] = useState(qs.parse(props.location.search).section);
  const [ organisation, setOrganisation ] = useState(null);

  useEffect(() => {
    let id = organisationId;

    // If no ID, assume it's the profile page and get the user's organisation
    if (!id && !meState.isFetching && meState.data && meState.data.organisation_id) {
      id = meState.data.organisation_id;
    }

    if (canFetch(organisationVersions) && id !== undefined && id !== null) {
      getOrganisationVersions(id);
    }

    // If error, get organisation from normal endpoint.
    if (canFetch(getOrganisationState) && !organisationVersions.isFetching && organisationVersions.error && id !== undefined && id !== null) {
      getOrganisation(id);
    }
  }, [meState, getOrganisationVersions, organisationVersions, organisationId, getOrganisation, getOrganisationState]);

  useEffect(() => {
    return () => {
      setOrganisation(null);
      clearState();
    };
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    clearState();
  }, [organisationId]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    if (organisationVersions.data && !organisationVersions.isFetching) {
      const org = getLatestVersion(organisationVersions);
      const isPending = org.status === 'pending';
      const isRejected = org.status === 'rejected';

      setOrganisation(org);

      if (isPending) {
        showNotificationBar('organisation.awaitingApprovalMessage', 'organisation.awaitingApproval');
      }

      if (isRejected) {
        showNotificationBar('organisation.rejectedMessage', 'organisation.rejected', {reason: `${t(`api.rejected_reasons.${org.rejected_reason}`)}: ${org.rejected_reason_body}`});
      }

      return () => {
        closeNotificationBar();
      };
    }

    if (organisationVersions.error && getOrganisationState.data) {
      setOrganisation(getOrganisationState);
    }
  }, [getOrganisationState, organisationVersions, setOrganisation, showNotificationBar, closeNotificationBar, t]);

  return (
    <OrganisationComponent organisation={organisation} sectionToJumpTo={sectionToJumpTo} />
  )
}

Organisation.propTypes = {
  meState: initialAsyncStatePropType.isRequired,
  getOrganisationVersions: PropTypes.func.isRequired,
  clearState: PropTypes.func.isRequired
};

export default Organisation;
