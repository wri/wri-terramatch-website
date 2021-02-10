import React, { useEffect, useState, useCallback } from 'react';
import PropTypes from 'prop-types';
import FormWalkthrough from '../../components/formWalkthrough/FormWalkthrough';
import getSteps from './steps';
import { initialAsyncStatePropType } from '../../redux/asyncActionReducer';
import { canFetch } from '../../helpers';
import { Loader } from 'tsc-chameleon-component-library';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { getRawResponseErrors } from '../../helpers';

const RegisterInterest = (props) => {
  const {
    getOrganisationPitches,
    getPitchesState,
    getOrganisationOffers,
    getOffersState,
    meState,
    clearState,
    createInterest,
    createInterestState,
    match
  } = props;

  const isFunding = !props.location.pathname.includes('funding');
  const createInterestSuccess = {
    title: 'match.interest.success',
    text: 'match.interest.successMessage',
    linkText: 'common.continue',
    link: '/connections'
  };

  const [ items, setItems ] = useState(null);
  const [ steps, setSteps ] = useState(null);
  const [ errors, setErrors ] = useState([]);

  const { t } = useTranslation();

  useEffect(() => {
    return clearState;
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    const errors = getRawResponseErrors(createInterestState);

    if (createInterestState.error) {
      errors.forEach(error => {
        const errorCode = error.detail.includes('has an invalid visibility') ? 'CUSTOM' : 'EXISTS';
        error.source = isFunding ? 'offer_id' : 'pitch_id'
        error.code = errorCode
      });
    }

    setErrors(errors);

  }, [createInterestState, isFunding]);

  // Get funding or project list
  useEffect(() => {
    if (isFunding && canFetch(getOffersState) && meState.data) {
      getOrganisationOffers(meState.data.organisation_id);
    } else if (!isFunding && canFetch(getPitchesState) && meState.data) {
      getOrganisationPitches(meState.data.organisation_id);
    }
  }, [getOffersState,
    getOrganisationOffers,
    getOrganisationPitches,
    getPitchesState,
    isFunding,
    meState.data]);

  const getListOfItems = useCallback((state) => {
    if (state.data) {
      return state.data.filter(item => !item.completed_at)
       .map((item) => {
        return {
          value: item.id,
          label: item.name
        }
      });
    }
    return null;
  }, []);

  useEffect(() => {
    if (!items) {
      const state = isFunding ? getOffersState : getPitchesState
      setItems(getListOfItems(state));
    } else {
      setSteps(getSteps(items, isFunding));
    }
  }, [getListOfItems, getOffersState, getPitchesState, isFunding, items]);

  const onSubmit = (data) => {
    const model = {...data};
    if (isFunding) {
      model.pitch_id = parseInt(match.params.id, 10);
      model.initiator = 'offer';
    } else {
      model.offer_id = parseInt(match.params.id, 10);
      model.initiator = 'pitch';
    }

    createInterest(model);
  }

  return (
    <section className="u-whole-page u-flex u-flex--centered u-flex--justify-centered">
      {(!items || !steps) ? <Loader /> :
        items.length > 0 ?
        <FormWalkthrough
          steps={steps}
          onSubmit={onSubmit}
          isFetching={createInterestState.isFetching}
          errors={errors}
          isSuccess={!!(createInterestState.data)}
          successOptions={createInterestSuccess}
        />:
        (
          <div className="u-text-center">
            <p>{isFunding ? t('match.interest.emptyFunding') : t('match.interest.emptyPitch')}</p>
            {
              isFunding ?
              <Link className="c-button c-button--is-link" to="/createOffer">
                {t('createOffer.createOffer')}
              </Link>
              :
              <Link className="c-button c-button--is-link" to="/createProject">
                {t('createPitch.createPitch')}
              </Link>
            }
          </div>
        )
      }
    </section>
  );
};

RegisterInterest.propTypes = {
  getPitchesState: initialAsyncStatePropType.isRequired,
  getOffersState: initialAsyncStatePropType.isRequired,
  getOrganisationPitches: PropTypes.func.isRequired,
  getOrganisationOffers: PropTypes.func.isRequired,
  meState: initialAsyncStatePropType.isRequired,
  clearState: PropTypes.func.isRequired
};

export default RegisterInterest;
