import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { Backdrop } from 'tsc-chameleon-component-library';
import { canFetch } from '../../helpers';
import { useTranslation } from 'react-i18next';
import FormInput from '../../components/formInput/FormInput';
import FormTypes from '../../components/formInput/FormInputTypes';

const DraftSelection = (props) => {
  const { onDraftSelected,
    projectType,
    getOfferDraftsState,
    getPitchDraftsState,
    getDrafts,
    clearGetDrafts,
    draftId } = props;

  const { t } = useTranslation();

  const state = projectType === 'offer' ? getOfferDraftsState : getPitchDraftsState;
  const [ selected, setSelected ] = useState(null);

  useEffect(() => {
    if (canFetch(state)) {
      getDrafts(projectType);
    }
  }, [getDrafts, projectType, state]);

  useEffect(() => {
    return clearGetDrafts;
  }, [clearGetDrafts]);

  const onSelection = (value) => {
    setSelected(value.value !== undefined ? value.value : null);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onDraftSelected(state.data ? state.data.find(draft => draft.id === selected) : null)
  };

  if (state.data && state.data.length === 0) {
    onDraftSelected(null);
  } else if (state.data && draftId) {
    const draft = state.data.find(draft => draft.id === parseInt(draftId, 10));
    if (draft) {
      onDraftSelected(draft);
    }
  }

  return (
    <section className="u-whole-page u-flex u-flex--centered u-flex--justify-centered">
      <div className="c-form-container">
          <div className="c-form-container__content u-text-center u-margin-vertical-small">
            <form onSubmit={handleSubmit}>
              <h2>{t('drafts.start')}</h2>
              <p>{t('drafts.startHelp')}</p>

              <div className="u-border-bottom u-margin-bottom u-margin-top-large">
                <FormInput
                  type={FormTypes.radio}
                  label={t('drafts.startNew')}
                  showLabel
                  id="newProject"
                  className="u-margin-bottom-none"
                  onChange={onSelection}
                  value={selected === null}
                />
              </div>

              {state.data && state.data.length > 0 && <FormInput
                type={FormTypes.radioGroup}
                label={t('drafts.drafts')}
                id="drafts"
                className="u-margin-bottom-small"
                showLabel
                data={state.data.map(draft => ({
                  value: draft.id,
                  label: draft.name
                }))}
                onChange={onSelection}
                value={selected}
              />}

              {state.isFetching && <p>{t('common.loadingOptions')}</p>}

              <input
                type="submit"
                className="c-button u-margin-top-large"
                value={t('common.continue')}
                disabled={state.isFetching}
              />
            </form>
          </div>
      </div>
      <Backdrop show opaque className="c-backdrop--has-background"/>
    </section>
  );
};

DraftSelection.propTypes = {
  onDraftSelected: PropTypes.func.isRequired,
  clearGetDrafts: PropTypes.func.isRequired,
  getDrafts: PropTypes.func.isRequired,
  getOfferDraftsState: PropTypes.object.isRequired,
  getPitchDraftsState: PropTypes.object.isRequired,
  projectType: PropTypes.string.isRequired
};

export default DraftSelection;
