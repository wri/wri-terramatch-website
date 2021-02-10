import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import PanelItem from '../../components/panelItem/PanelItem';
import moment from 'moment';
import { useTranslation } from 'react-i18next';
import { Collapse } from 'react-collapse';
import ConnectionContact from './ConnectionContact';
import { Button, Modal } from 'tsc-chameleon-component-library';
import { Link } from 'react-router-dom';
import ConnectionItemContainer from './ConnectionItemContainer';

const ConnectionItem = (props) => {
  const { match,
          myOrganisationId,
          unmatchConnectionState,
          unmatchConnection,
          getMatches,
          isInterest,
          showUnmatchButton,
          clearUnmatch,
          clearState,
          showPairing } = props;

  const { t, i18n } = useTranslation();
  const [ isOpen, setIsOpen ] = useState(false);
  const [ matched, setMatched ] = useState(null);
  const [ matchedOpposite, setMatchedOpposite ] = useState(null);

  const [ matchToUnmatch, setMatchToUnmatch ] = useState(null);
  const [ interestToWithdraw, setInterestToWithdraw ] = useState(null);

  const localeMoment = moment.utc(isInterest ? match.created_at : match.matched_at).local().locale(i18n.language);

  useEffect(() => {
    return clearState;
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    // Set the type of match it is.
    if (match.pitch.organisation_id === myOrganisationId) {
      setMatched('offer');
      setMatchedOpposite('pitch');
    } else {
      setMatched('pitch');
      setMatchedOpposite('offer');
    }
  }, [match, myOrganisationId]);


  const contacts = matched && !isInterest ? match[`${matched}_contacts`].map((contact) => {
    return <ConnectionContact key={contact.email_address} contact={contact} />
  }) : null;

  const unmatchButtonClick = () => {
    // just remove it via the ID if it's not matched with anything.
    if (!match.matched_at) {
      return unmatchConnection(match.id);
    }

    let interestId = match.offer_interest_id;

    if (matched === 'offer') {
      interestId = match.pitch_interest_id;
    }

    unmatchConnection(interestId);
  };

  useEffect(() => {
    if (unmatchConnectionState.data && (matchToUnmatch || interestToWithdraw)) {
      clearUnmatch();
      setMatchToUnmatch(null);
      setInterestToWithdraw(null);
      getMatches();
    }
  }, [getMatches, matchToUnmatch, interestToWithdraw, unmatchConnectionState.data, clearUnmatch]);

  const link = matched === 'pitch' ? `/projects/${match.pitch_id}` : `/funding/${match.offer_id}`;
  const linkText = matched === 'pitch' ? t('interests.viewPitch') : t('interests.viewFundingOffer');

  return matched ? (
    <>
    <PanelItem className="u-flex u-flex--space-between c-connection u-flex--break-md u-margin-bottom-small u-flex--centered">
      <div className="u-flex u-flex--break-md c-connection__content u-margin-vertical-small">
        <div className="c-connection__avatar" role="presentation" style={match[matched].avatar ? {backgroundImage: `url(${match[matched].avatar})`} : null}></div>
        <div className="u-margin-horizontal-tiny">
          <h3 className="u-text-bold u-text-spaced-small u-margin-bottom-none u-font-grey">
            <Link to={link} className="u-link">
                {match[matched].name}
            </Link>
          </h3>
          <p className="u-margin-none u-margin-bottom-tiny">{t('connections.with', {projectName: match[matchedOpposite].name})}</p>
          <span>{localeMoment.fromNow()}</span>
        </div>
      </div>
      { !isInterest ?
        <div
          role="button"
          aria-label={t('common.open')}
          onClick={() => {setIsOpen(!isOpen)}}
          onKeyDown={() => {setIsOpen(!isOpen)}}
          tabIndex="0"
          className={`c-connection__collapse-button ${isOpen ? 'c-connection__collapse-button--open' : ''}`}>
          <div
            role="presentation"
            className="c-icon c-icon--chevron-black"
          />
        </div>
      : <div className="u-flex u-flex--break-md">
          {match.organisation_id === myOrganisationId &&
            <Button variant="link"
                    className="c-button c-button--grey c-button--is-link u-text-center u-margin-small"
                    click={() => setInterestToWithdraw(match)}>
                  {t('match.interest.withdraw')}
            </Button>
          }
          <Link className="c-button c-button--is-link u-text-center u-margin-small" to={link}>{linkText}</Link>
        </div>
    }
    </PanelItem>
    { !isInterest &&
      <Collapse isOpened={isOpen}>
        <section className="c-connection__collapse u-padding-bottom-small">
          <ul className="u-list-unstyled u-margin-none">
            {contacts}
          </ul>
          { showUnmatchButton &&
            <div className="u-text-center">
              <Button variant="danger" className="u-margin-small" click={() => setMatchToUnmatch(match)}>
                {t('connections.unmatch')}
              </Button>
            </div>
          }
        </section>
      </Collapse>
    }
    {matchToUnmatch &&
      <Modal show close={() => setMatchToUnmatch(null)}>
        <div className="u-text-center">
          <h2 className="u-margin-bottom-tiny u-margin-top-none u-font-medium u-text-uppercase">{t('connections.unmatch')}</h2>
          <p>{t('connections.unmatchHelp',
              {
                name: match[matched].name
              })}
          </p>
          <Button
            variant="danger"
            className="u-margin-top-large"
            click={unmatchButtonClick}
            disabled={unmatchConnectionState.isFetching}>
            {unmatchConnectionState.isFetching ? t('connections.unmatching') : t('connections.unmatch')}
          </Button>
        </div>
      </Modal>
    }
    {interestToWithdraw &&
      <Modal show close={() => setInterestToWithdraw(null)}>
        <div className="u-text-center">
          <h2 className="u-margin-bottom-tiny u-margin-top-none u-font-medium u-text-uppercase">{t('match.interest.withdraw')}</h2>
          <p>{t('match.interest.withdrawHelp',
              {
                name: match[matched].name
              })}
          </p>
          <Button
            variant="danger"
            className="u-margin-top-large"
            click={unmatchButtonClick}
            disabled={unmatchConnectionState.isFetching}>
            {unmatchConnectionState.isFetching ? t('match.interest.withdrawing') : t('match.interest.withdraw')}
          </Button>
        </div>
      </Modal>
    }
    {showPairing &&
      <ConnectionItemContainer
        match={match}
        myOrganisationId={matched === 'pitch' ? match['pitch'].organisation_id : match['offer'].organisation_id}
        showUnmatchButton={false}
      /> }
    </>
  ) : null;
};

ConnectionItem.propTypes = {
  match: PropTypes.object.isRequired,
  showUnmatchButton: PropTypes.bool,
  showPairing: PropTypes.bool
};

ConnectionItem.defaultProps = {
  showUnmatchButton: true,
  showPairing: false
};

export default ConnectionItem;
