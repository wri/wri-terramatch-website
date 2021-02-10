import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { initialAsyncStatePropType } from '../../redux/asyncActionReducer';
import PitchComponent from '../../components/pitch/PitchContainer';
import { useTranslation } from 'react-i18next';
import { getLatestVersion, canFetch } from '../../helpers';
import qs from 'query-string';

const Pitch = (props) => {
  const {
    getPitchVersions,
    getPitchVersionsState,
    getPitchState,
    getPitch,
    showNotificationBar,
    closeNotificationBar,
    clearState
  } = props;

  const [ pitch, setPitch ] = useState(null);
  const { t } = useTranslation();
  const { compareProjectId } = qs.parse(props.location.search);

  useEffect(() => {
    return clearState;
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    if (canFetch(getPitchVersionsState)) {
      getPitchVersions(props.match.params.id);
    }
    if (canFetch(getPitchState) && getPitchVersionsState.error) {
      getPitch(props.match.params.id);
    }
  }, [getPitchVersionsState, getPitchVersions, props.match.params.id, getPitchState, getPitch]);

  useEffect(() => {
    if (getPitchVersionsState.data && !getPitchVersionsState.isFetching) {
      const pitch = getLatestVersion(getPitchVersionsState);
      const isPending = pitch.status === 'pending';
      const isRejected = pitch.status === 'rejected';

      setPitch(pitch);

      if (isPending) {
        showNotificationBar('project.awaitingApprovalMessage', 'project.awaitingApproval');
      } else if (isRejected) {
        showNotificationBar('project.rejectedMessage', 'project.rejected', {reason: `${t(`api.rejected_reasons.${pitch.rejected_reason}`)}: ${pitch.rejected_reason_body}`});
      }

      return () => {
        closeNotificationBar();
      };
    }

    if (getPitchState.data && !getPitchState.isFetching && getPitchVersionsState.error) {
      setPitch(getPitchState);
    }
  }, [getPitchVersionsState, getPitchState, setPitch, showNotificationBar, closeNotificationBar, t]);

  return (
    <PitchComponent pitch={pitch} compareProjectId={compareProjectId}/>
  )
}

Pitch.propTypes = {
  meState: initialAsyncStatePropType.isRequired,
  getPitchVersionsState: initialAsyncStatePropType.isRequired,
  getPitchVersions: PropTypes.func.isRequired
};

export default Pitch;
