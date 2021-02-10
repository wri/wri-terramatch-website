import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { initialAsyncStatePropType } from '../../redux/asyncActionReducer';
import { canFetch, getLatestVersion } from '../../helpers';
import { useTranslation } from 'react-i18next';
import ConnectionItem from '../../components/connections/ConnectionItemContainer';
import connectionImage from '../../assets/images/connections/connections.svg';
import offerImage from '../../assets/images/connections/funding.svg';
import pitchImage from '../../assets/images/connections/projects.svg';
import bothImage from '../../assets/images/connections/both.svg';
import LoadingSection from '../../components/loading/LoadingSection';

const EmptyState = (props) => {
  const { image, text, wideImage } = props;

  return (
    <div className="u-text-center c-connections__empty-section">
      <img src={image} alt="" role="presentation" className={wideImage && 'c-connections__empty-section--wide-image'}/>
      <p className="u-font-medium u-font-primary">{text}</p>
    </div>
  );
};

const Connections = (props) => {
  const { getMatches,
          clearState,
          getMatchesState,
          getRecievedInterests,
          getRecievedInterestsState,
          getInitiatedInterests,
          getInitiatedInterestsState,
          getOrganisationVersionsNavBar,
          meState } = props;

  const { t } = useTranslation();
  const [ organisationCategory, setOrganisationCategory ] = useState(null);

  useEffect(() => {
    if (canFetch(getMatchesState)) {
      getMatches();
    }
    if (canFetch(getRecievedInterestsState)) {
      getRecievedInterests();
    }
    if (canFetch(getInitiatedInterestsState)) {
      getInitiatedInterests();
    }
  }, [getInitiatedInterests,
      getInitiatedInterestsState,
      getMatches,
      getMatchesState,
      getRecievedInterests,
      getRecievedInterestsState]);

  useEffect(() => {
    if (getOrganisationVersionsNavBar.data) {
      setOrganisationCategory(getLatestVersion(getOrganisationVersionsNavBar).data.category);
    }
  }, [getOrganisationVersionsNavBar]);

  useEffect(() => {
    return clearState;
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const matches = [];
  const recievedInterests = [];
  const initiatedInterests = [];

  if (getRecievedInterestsState.data) {
    getRecievedInterestsState.data.forEach((interest) => {
      recievedInterests.push(<ConnectionItem match={interest} key={interest.id} myOrganisationId={meState.data.organisation_id} isInterest/>);
    });
  };

  if (getInitiatedInterestsState.data) {
    getInitiatedInterestsState.data.forEach((interest) => {
      initiatedInterests.push(<ConnectionItem match={interest} key={interest.id} myOrganisationId={meState.data.organisation_id} isInterest/>);
    });
  };

  if (getMatchesState.data) {
    getMatchesState.data.forEach((match) => {
      matches.push(<ConnectionItem match={match} key={match.id} myOrganisationId={meState.data.organisation_id}/>);
    });
  };

  let yourInterestsImage = null;
  let interestedInMeImage = null;

  switch (organisationCategory) {
    case 'both':
      yourInterestsImage = bothImage;
      interestedInMeImage = bothImage;
    break;
    case 'developer':
      interestedInMeImage = pitchImage;
      yourInterestsImage = offerImage;
    break;
    case 'funder':
      interestedInMeImage = offerImage;
      yourInterestsImage = pitchImage;
    break;
    default:
    break;
  }

  return (
    <section className="c-section c-section--standard-width c-connections">
      <section className="c-connections__section">
        <h2 className="u-margin-bottom-small">{t('connections.yourConnections')}</h2>
        <hr className="u-margin-bottom-large"/>
        {(getMatchesState.isFetching || !organisationCategory) && <LoadingSection />}
        {matches.length > 0 && organisationCategory &&
          <>
            {matches}
          </>
        }
        {matches.length === 0 && organisationCategory && !getMatchesState.isFetching &&
          <EmptyState text={t('connections.empty')} image={connectionImage} />
        }

        <p className="u-text-center u-font-medium u-margin-vertical-small u-font-primary">{t('connections.newTime')}</p>
      </section>
      <section className="c-connections__section">
        <h2 className="u-margin-bottom-small">{t('interests.interestedInYou')}</h2>
        <hr className="u-margin-bottom-large"/>
        {(getRecievedInterestsState.isFetching || !organisationCategory) && <LoadingSection />}
        {recievedInterests.length > 0 && organisationCategory &&
          <>
            {recievedInterests}
          </>
        }

        {recievedInterests.length === 0 && organisationCategory && !getRecievedInterestsState.isFetching &&
          <EmptyState
            text={t(`interests.empty.${organisationCategory}InterestedInYou`)}
            image={interestedInMeImage}
            wideImage={organisationCategory === 'both'}
          />
        }

      </section>
      <section className="c-connections__section">
        <h2 className="u-margin-bottom-small">{t('interests.yourInterests')}</h2>
        <hr className="u-margin-bottom-large"/>
        {(getInitiatedInterestsState.isFetching || !organisationCategory) && <LoadingSection />}
        {initiatedInterests.length > 0 && organisationCategory &&
          <>
            {initiatedInterests}
          </>
        }
        {initiatedInterests.length === 0 && organisationCategory && !getInitiatedInterestsState.isFetching &&
          <EmptyState
            text={t(`interests.empty.${organisationCategory}YourInterests`)}
            image={yourInterestsImage}
            wideImage={organisationCategory === 'both'}
          />
        }
      </section>
    </section>
  );
};

Connections.propTypes = {
  getMatches: PropTypes.func.isRequired,
  clearState: PropTypes.func.isRequired,
  getMatchesState: initialAsyncStatePropType.isRequired,
  meState: initialAsyncStatePropType.isRequired
};

export default Connections;
